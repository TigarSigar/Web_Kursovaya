package com.cargo.backend.rental.service

import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.client.repository.ClientProfileRepository
import com.cargo.backend.common.domain.UserRole
import com.cargo.backend.common.error.ConflictException
import com.cargo.backend.common.error.ResourceNotFoundException
import com.cargo.backend.common.mapping.toFrontendResponse
import com.cargo.backend.maintenance.repository.MaintenanceWindowRepository
import com.cargo.backend.rental.api.dto.AvailableCarResultResponse
import com.cargo.backend.rental.api.dto.RentalCreateRequest
import com.cargo.backend.rental.api.dto.RentalResponse
import com.cargo.backend.rental.domain.RentalOrder
import com.cargo.backend.rental.domain.RentalStatus
import com.cargo.backend.rental.domain.RentalStatusHistory
import com.cargo.backend.rental.repository.RentalOrderRepository
import com.cargo.backend.rental.repository.RentalStatusHistoryRepository
import com.cargo.backend.tariff.repository.TariffRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate
import java.time.temporal.ChronoUnit

@Service
class RentalServiceImpl(
    private val carRepository: CarRepository,
    private val clientProfileRepository: ClientProfileRepository,
    private val tariffRepository: TariffRepository,
    private val maintenanceWindowRepository: MaintenanceWindowRepository,
    private val rentalOrderRepository: RentalOrderRepository,
    private val rentalStatusHistoryRepository: RentalStatusHistoryRepository
) : RentalService {

    private val activeStatuses = setOf(RentalStatus.CREATED, RentalStatus.CONFIRMED, RentalStatus.ISSUED)

    @Transactional(readOnly = true)
    override fun findAvailableCars(from: LocalDate, to: LocalDate, location: String?, carClass: String?): List<AvailableCarResultResponse> {
        validateDateRange(from, to)
        return carRepository.findAll()
            .asSequence()
            .filter { car -> location.isNullOrBlank() || car.location == location }
            .filter { car -> carClass.isNullOrBlank() || car.carClass.name == carClass }
            .map { car ->
                val reasons = mutableListOf<String>()
                val carId = car.id ?: throw IllegalStateException("Car id is null")

                if (car.status == CarStatus.INACTIVE) {
                    reasons += "Автомобиль временно выведен из автопарка."
                }

                val hasRentalOverlap = rentalOrderRepository
                    .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusIn(carId, to, from, activeStatuses)
                if (hasRentalOverlap) {
                    reasons += "Автомобиль уже забронирован на выбранный период."
                }

                val hasMaintenanceOverlap = maintenanceWindowRepository
                    .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(carId, to, from)
                if (hasMaintenanceOverlap) {
                    reasons += "На выбранные даты запланировано обслуживание."
                }

                AvailableCarResultResponse(
                    car = car.toFrontendResponse(),
                    tariffs = tariffRepository.findAll().filter { it.carClass == car.carClass }.map { it.toFrontendResponse() },
                    available = reasons.isEmpty(),
                    reasons = reasons
                )
            }
            .sortedByDescending { it.available }
            .toList()
    }

    @Transactional(readOnly = true)
    override fun findAll(): List<RentalResponse> =
        rentalOrderRepository.findAll()
            .sortedByDescending { it.createdAt }
            .map { toResponse(it) }

    @Transactional
    override fun create(request: RentalCreateRequest): RentalResponse {
        validateDateRange(request.startDate, request.endDate)

        val car = carRepository.findById(request.carId).orElseThrow {
            ResourceNotFoundException("Car with id '${request.carId}' was not found")
        }
        if (car.status != CarStatus.AVAILABLE) {
            throw ConflictException("Car '${car.plateNumber}' is not available for booking")
        }

        val hasRentalOverlap = rentalOrderRepository
            .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusIn(
                request.carId,
                request.endDate,
                request.startDate,
                activeStatuses
            )
        if (hasRentalOverlap) {
            throw ConflictException("Selected car already has rental in requested period")
        }

        val hasMaintenanceOverlap = maintenanceWindowRepository
            .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                request.carId,
                request.endDate,
                request.startDate
            )
        if (hasMaintenanceOverlap) {
            throw ConflictException("Selected car is in maintenance in requested period")
        }

        val client = clientProfileRepository.findById(request.clientId).orElseThrow {
            ResourceNotFoundException("Client with id '${request.clientId}' was not found")
        }
        val tariff = tariffRepository.findById(request.tariffId).orElseThrow {
            ResourceNotFoundException("Tariff with id '${request.tariffId}' was not found")
        }
        if (tariff.carClass != null && tariff.carClass != car.carClass) {
            throw ConflictException("Selected tariff does not match the vehicle class")
        }

        val days = ChronoUnit.DAYS.between(request.startDate, request.endDate)
        if (days <= 0) {
            throw IllegalArgumentException("End date must be greater than start date")
        }
        if (days < (tariff.minimumDays ?: 1).toLong()) {
            throw ConflictException("Minimum rental length for tariff '${tariff.name}' is ${tariff.minimumDays ?: 1} day(s)")
        }
        val totalPrice = tariff.basePrice + tariff.dailyPrice.multiply(BigDecimal(days))

        val rental = rentalOrderRepository.save(
            RentalOrder(
                car = car,
                client = client,
                tariff = tariff,
                startDate = request.startDate,
                endDate = request.endDate,
                pickupLocation = request.pickupLocation?.trim()?.ifBlank { null } ?: car.location,
                returnLocation = request.returnLocation?.trim()?.ifBlank { null } ?: car.location,
                totalDays = days,
                basePrice = tariff.basePrice,
                dailyPrice = tariff.dailyPrice,
                totalPrice = totalPrice,
                status = RentalStatus.CREATED
            )
        )

        appendHistory(rental, RentalStatus.CREATED, UserRole.CLIENT, "Rental order created")
        return toResponse(rental)
    }

    @Transactional
    override fun issue(id: Long): RentalResponse {
        val rental = findRental(id)
        if (rental.status !in setOf(RentalStatus.CREATED, RentalStatus.CONFIRMED)) {
            throw ConflictException("Only CREATED or CONFIRMED rental can be issued")
        }
        rental.status = RentalStatus.ISSUED
        rental.issuedAt = Instant.now()
        rental.car.status = CarStatus.RENTED
        val saved = rentalOrderRepository.save(rental)
        appendHistory(saved, RentalStatus.ISSUED, UserRole.FLEET_MANAGER, "Vehicle issued to client")
        return toResponse(saved)
    }

    @Transactional
    override fun complete(id: Long): RentalResponse {
        val rental = findRental(id)
        if (rental.status != RentalStatus.ISSUED) {
            throw ConflictException("Only ISSUED rental can be completed")
        }
        rental.status = RentalStatus.COMPLETED
        rental.actualReturnAt = Instant.now()
        if (rental.car.status != CarStatus.INACTIVE) {
            rental.car.status = CarStatus.AVAILABLE
        }
        val saved = rentalOrderRepository.save(rental)
        appendHistory(saved, RentalStatus.COMPLETED, UserRole.FLEET_MANAGER, "Rental completed and vehicle returned")
        return toResponse(saved)
    }

    @Transactional
    override fun cancel(id: Long): RentalResponse {
        val rental = findRental(id)
        if (rental.status == RentalStatus.ISSUED || rental.status == RentalStatus.COMPLETED) {
            throw ConflictException("Cancellation is forbidden after vehicle issue")
        }
        if (rental.status == RentalStatus.CANCELLED) {
            return toResponse(rental)
        }
        rental.status = RentalStatus.CANCELLED
        if (rental.car.status != CarStatus.INACTIVE) {
            rental.car.status = CarStatus.AVAILABLE
        }
        val saved = rentalOrderRepository.save(rental)
        appendHistory(saved, RentalStatus.CANCELLED, UserRole.CLIENT, "Rental cancelled")
        return toResponse(saved)
    }

    @Transactional(readOnly = true)
    override fun findByClient(clientId: Long): List<RentalResponse> {
        if (!clientProfileRepository.existsById(clientId)) {
            throw ResourceNotFoundException("Client with id '$clientId' was not found")
        }
        return rentalOrderRepository.findAllByClientId(clientId)
            .sortedByDescending { it.createdAt }
            .map { toResponse(it) }
    }

    @Transactional(readOnly = true)
    override fun findById(id: Long): RentalResponse = toResponse(findRental(id))

    private fun findRental(id: Long): RentalOrder =
        rentalOrderRepository.findById(id).orElseThrow {
            ResourceNotFoundException("Rental with id '$id' was not found")
        }

    private fun appendHistory(rental: RentalOrder, status: RentalStatus, actorRole: UserRole, note: String) {
        rentalStatusHistoryRepository.save(
            RentalStatusHistory(
                rental = rental,
                status = status,
                changedAt = Instant.now(),
                actorRole = actorRole,
                note = note
            )
        )
    }

    private fun toResponse(rental: RentalOrder): RentalResponse {
        val history = rentalStatusHistoryRepository
            .findAllByRentalIdOrderByChangedAtAsc(rental.id ?: throw IllegalStateException("Rental id is null"))
            .map { it.toFrontendResponse() }

        return RentalResponse(
            id = rental.id ?: throw IllegalStateException("Rental id is null"),
            carId = rental.car.id ?: throw IllegalStateException("Car id is null"),
            clientId = rental.client.id ?: throw IllegalStateException("Client id is null"),
            tariffId = rental.tariff.id ?: throw IllegalStateException("Tariff id is null"),
            from = rental.startDate.toString(),
            to = rental.endDate.toString(),
            pickupLocation = rental.pickupLocation ?: rental.car.location.orEmpty(),
            returnLocation = rental.returnLocation ?: rental.car.location.orEmpty(),
            totalDays = rental.totalDays ?: ChronoUnit.DAYS.between(rental.startDate, rental.endDate),
            basePrice = rental.basePrice ?: rental.tariff.basePrice,
            dailyPrice = rental.dailyPrice ?: rental.tariff.dailyPrice,
            totalPrice = rental.totalPrice,
            status = rental.status,
            actualReturnAt = rental.actualReturnAt,
            createdAt = rental.createdAt,
            car = rental.car.toFrontendResponse(),
            client = rental.client.toFrontendResponse(),
            tariff = rental.tariff.toFrontendResponse(),
            statusHistory = history
        )
    }

    private fun validateDateRange(from: LocalDate, to: LocalDate) {
        if (!to.isAfter(from)) {
            throw IllegalArgumentException("End date must be greater than start date")
        }
    }
}

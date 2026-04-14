package com.cargo.backend.rental.service

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.client.repository.ClientProfileRepository
import com.cargo.backend.common.error.ConflictException
import com.cargo.backend.common.error.ResourceNotFoundException
import com.cargo.backend.maintenance.repository.MaintenanceWindowRepository
import com.cargo.backend.rental.api.dto.PriceBreakdownResponse
import com.cargo.backend.rental.api.dto.RentalCreateRequest
import com.cargo.backend.rental.api.dto.RentalResponse
import com.cargo.backend.rental.api.dto.RentalStatusHistoryResponse
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
    override fun findAvailableCars(from: LocalDate, to: LocalDate): List<CarResponse> {
        validateDateRange(from, to)
        return carRepository.findAllByStatus(CarStatus.AVAILABLE)
            .filter { car ->
                val hasRentalOverlap = rentalOrderRepository
                    .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusIn(
                        car.id ?: return@filter false,
                        to,
                        from,
                        activeStatuses
                    )
                val hasMaintenanceOverlap = maintenanceWindowRepository
                    .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
                        car.id ?: return@filter false,
                        to,
                        from
                    )
                !hasRentalOverlap && !hasMaintenanceOverlap
            }
            .map { car ->
                CarResponse(
                    id = car.id ?: throw IllegalStateException("Car id is null"),
                    vin = car.vin,
                    plateNumber = car.plateNumber,
                    carClass = car.carClass,
                    status = car.status,
                    createdAt = car.createdAt,
                    updatedAt = car.updatedAt
                )
            }
    }

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

        val days = ChronoUnit.DAYS.between(request.startDate, request.endDate)
        if (days <= 0) {
            throw IllegalArgumentException("End date must be greater than start date")
        }
        val totalPrice = tariff.basePrice + tariff.dailyPrice.multiply(BigDecimal(days))

        val rental = rentalOrderRepository.save(
            RentalOrder(
                car = car,
                client = client,
                tariff = tariff,
                startDate = request.startDate,
                endDate = request.endDate,
                totalPrice = totalPrice,
                status = RentalStatus.CREATED
            )
        )

        appendHistory(rental, RentalStatus.CREATED, "Rental order created")
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
        val saved = rentalOrderRepository.save(rental)
        appendHistory(saved, RentalStatus.ISSUED, "Vehicle issued to client")
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
        val saved = rentalOrderRepository.save(rental)
        appendHistory(saved, RentalStatus.COMPLETED, "Rental completed and vehicle returned")
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

    private fun appendHistory(rental: RentalOrder, status: RentalStatus, note: String) {
        rentalStatusHistoryRepository.save(
            RentalStatusHistory(
                rental = rental,
                status = status,
                changedAt = Instant.now(),
                note = note
            )
        )
    }

    private fun toResponse(rental: RentalOrder): RentalResponse {
        val days = ChronoUnit.DAYS.between(rental.startDate, rental.endDate)
        val history = rentalStatusHistoryRepository
            .findAllByRentalIdOrderByChangedAtAsc(rental.id ?: throw IllegalStateException("Rental id is null"))
            .map {
                RentalStatusHistoryResponse(
                    status = it.status,
                    changedAt = it.changedAt,
                    note = it.note
                )
            }

        return RentalResponse(
            id = rental.id ?: throw IllegalStateException("Rental id is null"),
            carId = rental.car.id ?: throw IllegalStateException("Car id is null"),
            carVin = rental.car.vin,
            carPlateNumber = rental.car.plateNumber,
            clientId = rental.client.id ?: throw IllegalStateException("Client id is null"),
            clientName = rental.client.fullName,
            tariffId = rental.tariff.id ?: throw IllegalStateException("Tariff id is null"),
            tariffName = rental.tariff.name,
            startDate = rental.startDate,
            endDate = rental.endDate,
            status = rental.status,
            price = PriceBreakdownResponse(
                basePrice = rental.tariff.basePrice,
                dailyPrice = rental.tariff.dailyPrice,
                days = days,
                totalPrice = rental.totalPrice
            ),
            issuedAt = rental.issuedAt,
            actualReturnAt = rental.actualReturnAt,
            createdAt = rental.createdAt,
            updatedAt = rental.updatedAt,
            history = history
        )
    }

    private fun validateDateRange(from: LocalDate, to: LocalDate) {
        if (!to.isAfter(from)) {
            throw IllegalArgumentException("End date must be greater than start date")
        }
    }
}

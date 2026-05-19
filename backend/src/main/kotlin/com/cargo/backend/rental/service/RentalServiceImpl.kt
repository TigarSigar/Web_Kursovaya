package com.cargo.backend.rental.service

import com.cargo.backend.car.domain.Car
import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.client.domain.ClientProfile
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
import com.cargo.backend.tariff.domain.Tariff
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
    private val rentalStatusHistoryRepository: RentalStatusHistoryRepository,
) : RentalService {
    private val activeRentalStatuses = setOf(RentalStatus.CREATED, RentalStatus.CONFIRMED, RentalStatus.ISSUED)
    private val issuableRentalStatuses = setOf(RentalStatus.CREATED, RentalStatus.CONFIRMED)

    @Transactional(readOnly = true)
    override fun findAvailableCars(
        from: LocalDate,
        to: LocalDate,
        location: String?,
        carClass: String?,
    ): List<AvailableCarResultResponse> {
        validateDateRange(from, to)

        val tariffsByClass = tariffRepository.findAll().groupBy { it.carClass }

        return carRepository
            .findAll()
            .asSequence()
            .filter { car -> location.isNullOrBlank() || car.location == location }
            .filter { car -> carClass.isNullOrBlank() || car.carClass.name == carClass }
            .map { car ->
                val carId = requireId(car.id, "Car")
                val blockingReasons = collectAvailabilityBlockingReasons(car, carId, from, to)

                AvailableCarResultResponse(
                    car = car.toFrontendResponse(),
                    tariffs = tariffsByClass[car.carClass].orEmpty().map { it.toFrontendResponse() },
                    available = blockingReasons.isEmpty(),
                    reasons = blockingReasons,
                )
            }.sortedByDescending { it.available }
            .toList()
    }

    @Transactional(readOnly = true)
    override fun findAll(): List<RentalResponse> =
        rentalOrderRepository
            .findAll()
            .sortedByDescending { it.createdAt }
            .map { toResponse(it) }

    @Transactional
    override fun create(request: RentalCreateRequest): RentalResponse {
        validateDateRange(request.startDate, request.endDate)

        val car = findCar(request.carId)
        ensureCarCanBeBooked(car)
        ensureRentalAndMaintenanceAvailability(carId = request.carId, from = request.startDate, to = request.endDate)

        val client = findClient(request.clientId)
        val tariff = findTariff(request.tariffId)
        ensureTariffMatchesCarClass(tariff, car)

        val totalDays = calculateRentalDays(request.startDate, request.endDate)
        ensureMinimumTariffDays(totalDays, tariff)

        val rental =
            rentalOrderRepository.save(
                RentalOrder(
                    car = car,
                    client = client,
                    tariff = tariff,
                    startDate = request.startDate,
                    endDate = request.endDate,
                    pickupLocation = normalizeLocation(request.pickupLocation, car.location),
                    returnLocation = normalizeLocation(request.returnLocation, car.location),
                    totalDays = totalDays,
                    basePrice = tariff.basePrice,
                    dailyPrice = tariff.dailyPrice,
                    totalPrice = calculateTotalPrice(tariff, totalDays),
                    status = RentalStatus.CREATED,
                ),
            )

        appendHistory(rental, RentalStatus.CREATED, UserRole.CLIENT, "Rental order created")
        return toResponse(rental)
    }

    @Transactional
    override fun issue(id: Long): RentalResponse {
        val rental = findRental(id)
        ensureRentalCanBeIssued(rental)

        rental.status = RentalStatus.ISSUED
        rental.issuedAt = Instant.now()
        rental.car.status = CarStatus.RENTED

        val savedRental = rentalOrderRepository.save(rental)
        appendHistory(savedRental, RentalStatus.ISSUED, UserRole.FLEET_MANAGER, "Vehicle issued to client")
        return toResponse(savedRental)
    }

    @Transactional
    override fun complete(id: Long): RentalResponse {
        val rental = findRental(id)
        ensureRentalCanBeCompleted(rental)

        rental.status = RentalStatus.COMPLETED
        rental.actualReturnAt = Instant.now()

        if (rental.car.status != CarStatus.INACTIVE) {
            rental.car.status = CarStatus.AVAILABLE
        }

        val savedRental = rentalOrderRepository.save(rental)
        appendHistory(savedRental, RentalStatus.COMPLETED, UserRole.FLEET_MANAGER, "Rental completed and vehicle returned")
        return toResponse(savedRental)
    }

    @Transactional
    override fun cancel(id: Long): RentalResponse {
        val rental = findRental(id)
        ensureRentalCanBeCancelled(rental)

        if (rental.status == RentalStatus.CANCELLED) {
            return toResponse(rental)
        }

        rental.status = RentalStatus.CANCELLED

        if (rental.car.status != CarStatus.INACTIVE) {
            rental.car.status = CarStatus.AVAILABLE
        }

        val savedRental = rentalOrderRepository.save(rental)
        appendHistory(savedRental, RentalStatus.CANCELLED, UserRole.CLIENT, "Rental cancelled")
        return toResponse(savedRental)
    }

    @Transactional(readOnly = true)
    override fun findByClient(clientId: Long): List<RentalResponse> {
        if (!clientProfileRepository.existsById(clientId)) {
            throw ResourceNotFoundException("Client with id '$clientId' was not found")
        }

        return rentalOrderRepository
            .findAllByClientId(clientId)
            .sortedByDescending { it.createdAt }
            .map { toResponse(it) }
    }

    @Transactional(readOnly = true)
    override fun findById(id: Long): RentalResponse = toResponse(findRental(id))

    private fun findCar(carId: Long): Car =
        carRepository.findById(carId).orElseThrow {
            ResourceNotFoundException("Car with id '$carId' was not found")
        }

    private fun findClient(clientId: Long): ClientProfile =
        clientProfileRepository.findById(clientId).orElseThrow {
            ResourceNotFoundException("Client with id '$clientId' was not found")
        }

    private fun findTariff(tariffId: Long): Tariff =
        tariffRepository.findById(tariffId).orElseThrow {
            ResourceNotFoundException("Tariff with id '$tariffId' was not found")
        }

    private fun findRental(rentalId: Long): RentalOrder =
        rentalOrderRepository.findById(rentalId).orElseThrow {
            ResourceNotFoundException("Rental with id '$rentalId' was not found")
        }

    private fun collectAvailabilityBlockingReasons(
        car: Car,
        carId: Long,
        from: LocalDate,
        to: LocalDate,
    ): List<String> =
        buildList {
            if (car.status == CarStatus.INACTIVE) {
                add("Автомобиль временно выведен из автопарка.")
            }

            if (hasRentalOverlap(carId, from, to)) {
                add("Автомобиль уже забронирован на выбранный период.")
            }

            if (hasMaintenanceOverlap(carId, from, to)) {
                add("На выбранные даты запланировано обслуживание.")
            }
        }

    private fun hasRentalOverlap(
        carId: Long,
        from: LocalDate,
        to: LocalDate,
    ): Boolean =
        rentalOrderRepository.existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusIn(
            carId,
            to,
            from,
            activeRentalStatuses,
        )

    private fun hasMaintenanceOverlap(
        carId: Long,
        from: LocalDate,
        to: LocalDate,
    ): Boolean =
        maintenanceWindowRepository.existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
            carId,
            to,
            from,
        )

    private fun ensureCarCanBeBooked(car: Car) {
        if (car.status != CarStatus.AVAILABLE) {
            throw ConflictException("Car '${car.plateNumber}' is not available for booking")
        }
    }

    private fun ensureRentalAndMaintenanceAvailability(
        carId: Long,
        from: LocalDate,
        to: LocalDate,
    ) {
        if (hasRentalOverlap(carId, from, to)) {
            throw ConflictException("Selected car already has rental in requested period")
        }

        if (hasMaintenanceOverlap(carId, from, to)) {
            throw ConflictException("Selected car is in maintenance in requested period")
        }
    }

    private fun ensureTariffMatchesCarClass(
        tariff: Tariff,
        car: Car,
    ) {
        if (tariff.carClass != null && tariff.carClass != car.carClass) {
            throw ConflictException("Selected tariff does not match the vehicle class")
        }
    }

    private fun calculateRentalDays(
        from: LocalDate,
        to: LocalDate,
    ): Long {
        val totalDays = ChronoUnit.DAYS.between(from, to)
        if (totalDays <= 0) {
            throw IllegalArgumentException("End date must be greater than start date")
        }

        return totalDays
    }

    private fun ensureMinimumTariffDays(
        totalDays: Long,
        tariff: Tariff,
    ) {
        val minimumDays = (tariff.minimumDays ?: 1).toLong()
        if (totalDays < minimumDays) {
            throw ConflictException("Minimum rental length for tariff '${tariff.name}' is ${tariff.minimumDays ?: 1} day(s)")
        }
    }

    private fun calculateTotalPrice(
        tariff: Tariff,
        totalDays: Long,
    ): BigDecimal = tariff.basePrice + tariff.dailyPrice.multiply(BigDecimal(totalDays))

    private fun normalizeLocation(
        requestedLocation: String?,
        fallbackLocation: String?,
    ): String? = requestedLocation?.trim()?.ifBlank { null } ?: fallbackLocation

    private fun ensureRentalCanBeIssued(rental: RentalOrder) {
        if (rental.status !in issuableRentalStatuses) {
            throw ConflictException("Only CREATED or CONFIRMED rental can be issued")
        }
    }

    private fun ensureRentalCanBeCompleted(rental: RentalOrder) {
        if (rental.status != RentalStatus.ISSUED) {
            throw ConflictException("Only ISSUED rental can be completed")
        }
    }

    private fun ensureRentalCanBeCancelled(rental: RentalOrder) {
        if (rental.status == RentalStatus.ISSUED || rental.status == RentalStatus.COMPLETED) {
            throw ConflictException("Cancellation is forbidden after vehicle issue")
        }
    }

    private fun appendHistory(
        rental: RentalOrder,
        status: RentalStatus,
        actorRole: UserRole,
        note: String,
    ) {
        rentalStatusHistoryRepository.save(
            RentalStatusHistory(
                rental = rental,
                status = status,
                changedAt = Instant.now(),
                actorRole = actorRole,
                note = note,
            ),
        )
    }

    private fun toResponse(rental: RentalOrder): RentalResponse {
        val rentalId = requireId(rental.id, "Rental")
        val carId = requireId(rental.car.id, "Car")
        val clientId = requireId(rental.client.id, "Client")
        val tariffId = requireId(rental.tariff.id, "Tariff")

        val history =
            rentalStatusHistoryRepository
                .findAllByRentalIdOrderByChangedAtAsc(rentalId)
                .map { it.toFrontendResponse() }

        return RentalResponse(
            id = rentalId,
            carId = carId,
            clientId = clientId,
            tariffId = tariffId,
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
            statusHistory = history,
        )
    }

    private fun validateDateRange(
        from: LocalDate,
        to: LocalDate,
    ) {
        if (!to.isAfter(from)) {
            throw IllegalArgumentException("End date must be greater than start date")
        }
    }

    private fun requireId(
        id: Long?,
        entityName: String,
    ): Long = id ?: throw IllegalStateException("$entityName id is null")
}

package com.cargo.backend.common.mapping

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.car.domain.Car
import com.cargo.backend.car.domain.FuelType
import com.cargo.backend.car.domain.TransmissionType
import com.cargo.backend.client.api.dto.ClientResponse
import com.cargo.backend.client.domain.ClientProfile
import com.cargo.backend.maintenance.domain.MaintenanceStatus
import com.cargo.backend.rental.api.dto.RentalStatusHistoryResponse
import com.cargo.backend.rental.domain.RentalStatusHistory
import com.cargo.backend.tariff.api.dto.TariffResponse
import com.cargo.backend.tariff.domain.Tariff
import java.math.BigDecimal
import java.time.LocalDate

fun List<String>.toStoredMultiline(): String =
    map { it.trim() }
        .filter { it.isNotEmpty() }
        .joinToString("\n")

fun String?.toMultilineList(): List<String> =
    this.orEmpty()
        .split('\n')
        .map { it.trim() }
        .filter { it.isNotEmpty() }

fun Car.toFrontendResponse() = CarResponse(
    id = id ?: throw IllegalStateException("Car id is null"),
    vin = vin,
    plateNumber = plateNumber,
    make = make.orEmpty(),
    model = model.orEmpty(),
    year = year ?: 2024,
    carClass = carClass,
    status = status,
    seats = seats ?: 5,
    transmission = transmission ?: TransmissionType.AUTOMATIC,
    fuelType = fuelType ?: FuelType.PETROL,
    location = location.orEmpty(),
    odometerKm = odometerKm ?: 0,
    imageUrls = imageUrls.toMultilineList(),
    notes = notes,
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun Tariff.toFrontendResponse() = TariffResponse(
    id = id ?: throw IllegalStateException("Tariff id is null"),
    name = name,
    carClass = carClass ?: com.cargo.backend.car.domain.CarClass.ECONOMY,
    basePrice = basePrice,
    dailyPrice = dailyPrice,
    minimumDays = minimumDays ?: 1,
    mileageLimitKm = mileageLimitKm ?: 0,
    depositAmount = depositAmount ?: BigDecimal.ZERO,
    insuranceIncluded = insuranceIncluded ?: true,
    restrictions = restrictions.toMultilineList(),
    description = description.orEmpty(),
    createdAt = createdAt,
    updatedAt = updatedAt
)

fun ClientProfile.toFrontendResponse(): ClientResponse {
    val parts = fullName.trim().split(' ').filter { it.isNotBlank() }
    return ClientResponse(
        id = id ?: throw IllegalStateException("Client id is null"),
        firstName = parts.firstOrNull().orEmpty(),
        lastName = parts.drop(1).joinToString(" "),
        email = email,
        phone = phone,
        driverLicenseNumber = driverLicenseNumber.orEmpty(),
        driverLicenseExpiry = driverLicenseExpiry.orEmpty(),
        memberSince = memberSince ?: LocalDate.now().toString(),
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

fun RentalStatusHistory.toFrontendResponse() = RentalStatusHistoryResponse(
    id = id ?: throw IllegalStateException("Rental history id is null"),
    rentalId = rental.id ?: throw IllegalStateException("Rental id is null"),
    status = status,
    changedAt = changedAt,
    actorRole = actorRole ?: com.cargo.backend.common.domain.UserRole.CLIENT,
    note = note
)

fun MaintenanceStatus?.orDefault(): MaintenanceStatus = this ?: MaintenanceStatus.SCHEDULED

package com.cargo.backend.rental.api.dto

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.client.api.dto.ClientResponse
import com.cargo.backend.rental.domain.RentalStatus
import com.cargo.backend.tariff.api.dto.TariffResponse
import java.time.Instant

data class RentalResponse(
    val id: Long,
    val carId: Long,
    val clientId: Long,
    val tariffId: Long,
    val from: String,
    val to: String,
    val pickupLocation: String,
    val returnLocation: String,
    val totalDays: Long,
    val basePrice: java.math.BigDecimal,
    val dailyPrice: java.math.BigDecimal,
    val totalPrice: java.math.BigDecimal,
    val status: RentalStatus,
    val actualReturnAt: Instant?,
    val createdAt: Instant?,
    val car: CarResponse?,
    val client: ClientResponse?,
    val tariff: TariffResponse?,
    val statusHistory: List<RentalStatusHistoryResponse>,
)

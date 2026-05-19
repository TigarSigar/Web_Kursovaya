package com.cargo.backend.tariff.api.dto

import com.cargo.backend.car.domain.CarClass
import java.math.BigDecimal
import java.time.Instant

data class TariffResponse(
    val id: Long,
    val name: String,
    val carClass: CarClass,
    val basePrice: BigDecimal,
    val dailyPrice: BigDecimal,
    val minimumDays: Int,
    val mileageLimitKm: Int,
    val depositAmount: BigDecimal,
    val insuranceIncluded: Boolean,
    val restrictions: List<String>,
    val description: String,
    val createdAt: Instant?,
    val updatedAt: Instant?,
)

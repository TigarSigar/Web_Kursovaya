package com.cargo.backend.tariff.api.dto

import java.math.BigDecimal
import java.time.Instant

data class TariffResponse(
    val id: Long,
    val name: String,
    val basePrice: BigDecimal,
    val dailyPrice: BigDecimal,
    val restrictions: String,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

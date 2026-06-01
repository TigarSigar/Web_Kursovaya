package com.cargo.backend.rental.api.dto

import java.math.BigDecimal

data class PriceBreakdownResponse(
    val basePrice: BigDecimal,
    val dailyPrice: BigDecimal,
    val days: Long,
    val totalPrice: BigDecimal
)

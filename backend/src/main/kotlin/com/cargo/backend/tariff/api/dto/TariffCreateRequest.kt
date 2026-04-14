package com.cargo.backend.tariff.api.dto

import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal

data class TariffCreateRequest(
    @field:NotBlank(message = "Tariff name is required")
    @field:Size(max = 80, message = "Tariff name must be at most 80 characters")
    val name: String,

    @field:NotNull(message = "Base price is required")
    @field:DecimalMin(value = "0.00", inclusive = true, message = "Base price must be non-negative")
    val basePrice: BigDecimal,

    @field:NotNull(message = "Daily price is required")
    @field:DecimalMin(value = "0.00", inclusive = true, message = "Daily price must be non-negative")
    val dailyPrice: BigDecimal,

    @field:NotBlank(message = "Restrictions are required")
    @field:Size(max = 500, message = "Restrictions must be at most 500 characters")
    val restrictions: String
)

package com.cargo.backend.tariff.api.dto

import com.cargo.backend.car.domain.CarClass
import jakarta.validation.constraints.DecimalMin
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal

data class TariffCreateRequest(
    @field:NotBlank(message = "Tariff name is required")
    @field:Size(max = 80, message = "Tariff name must be at most 80 characters")
    val name: String,
    @field:NotNull(message = "Car class is required")
    val carClass: CarClass,
    @field:NotNull(message = "Base price is required")
    @field:DecimalMin(value = "0.00", inclusive = true, message = "Base price must be non-negative")
    val basePrice: BigDecimal,
    @field:NotNull(message = "Daily price is required")
    @field:DecimalMin(value = "0.00", inclusive = true, message = "Daily price must be non-negative")
    val dailyPrice: BigDecimal,
    @field:NotNull(message = "Minimum days is required")
    val minimumDays: Int,
    @field:NotNull(message = "Mileage limit is required")
    val mileageLimitKm: Int,
    @field:NotNull(message = "Deposit amount is required")
    @field:DecimalMin(value = "0.00", inclusive = true, message = "Deposit amount must be non-negative")
    val depositAmount: BigDecimal,
    @field:NotNull(message = "Insurance flag is required")
    val insuranceIncluded: Boolean,
    @field:NotNull(message = "Restrictions are required")
    val restrictions: List<String>,
    @field:NotBlank(message = "Description is required")
    @field:Size(max = 2000, message = "Description must be at most 2000 characters")
    val description: String,
)

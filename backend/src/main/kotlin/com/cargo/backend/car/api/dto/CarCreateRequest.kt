package com.cargo.backend.car.api.dto

import com.cargo.backend.car.domain.CarClass
import com.cargo.backend.car.domain.CarStatus
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.Size

data class CarCreateRequest(
    @field:NotBlank(message = "VIN is required")
    @field:Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    @field:Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$", message = "VIN must contain valid uppercase symbols")
    val vin: String,

    @field:NotBlank(message = "Plate number is required")
    @field:Size(max = 20, message = "Plate number must be at most 20 characters")
    val plateNumber: String,

    @field:NotNull(message = "Car class is required")
    val carClass: CarClass,

    val status: CarStatus? = null
)

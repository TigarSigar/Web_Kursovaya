package com.cargo.backend.car.api.dto

import com.cargo.backend.car.domain.CarClass
import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.domain.FuelType
import com.cargo.backend.car.domain.TransmissionType
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotEmpty
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Pattern
import jakarta.validation.constraints.PositiveOrZero
import jakarta.validation.constraints.Size

data class CarCreateRequest(
    @field:NotBlank(message = "VIN is required")
    @field:Size(min = 17, max = 17, message = "VIN must be exactly 17 characters")
    @field:Pattern(regexp = "^[A-HJ-NPR-Z0-9]{17}$", message = "VIN must contain valid uppercase symbols")
    val vin: String,
    @field:NotBlank(message = "Plate number is required")
    @field:Size(max = 20, message = "Plate number must be at most 20 characters")
    val plateNumber: String,
    @field:NotBlank(message = "Make is required")
    @field:Size(max = 80, message = "Make must be at most 80 characters")
    val make: String,
    @field:NotBlank(message = "Model is required")
    @field:Size(max = 80, message = "Model must be at most 80 characters")
    val model: String,
    @field:NotNull(message = "Year is required")
    val year: Int,
    @field:NotNull(message = "Car class is required")
    val carClass: CarClass,
    @field:NotNull(message = "Seats count is required")
    val seats: Int,
    @field:NotNull(message = "Transmission is required")
    val transmission: TransmissionType,
    @field:NotNull(message = "Fuel type is required")
    val fuelType: FuelType,
    @field:NotBlank(message = "Location is required")
    @field:Size(max = 150, message = "Location must be at most 150 characters")
    val location: String,
    @field:NotNull(message = "Odometer is required")
    @field:PositiveOrZero(message = "Odometer must be non-negative")
    val odometerKm: Int,
    @field:NotEmpty(message = "At least one image is required")
    val imageUrls: List<String>,
    @field:Size(max = 2000, message = "Notes must be at most 2000 characters")
    val notes: String? = null,
    val status: CarStatus? = null,
)

package com.cargo.backend.rental.api.dto

import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDate

data class RentalCreateRequest(
    @field:NotNull(message = "Car id is required")
    val carId: Long,

    @field:NotNull(message = "Client id is required")
    val clientId: Long,

    @field:NotNull(message = "Tariff id is required")
    val tariffId: Long,

    @field:NotNull(message = "Start date is required")
    val startDate: LocalDate,

    @field:NotNull(message = "End date is required")
    val endDate: LocalDate,

    @field:Size(max = 150, message = "Pickup location must be at most 150 characters")
    val pickupLocation: String? = null,

    @field:Size(max = 150, message = "Return location must be at most 150 characters")
    val returnLocation: String? = null
)

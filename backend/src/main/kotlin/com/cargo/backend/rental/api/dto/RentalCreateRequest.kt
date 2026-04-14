package com.cargo.backend.rental.api.dto

import jakarta.validation.constraints.NotNull
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
    val endDate: LocalDate
)

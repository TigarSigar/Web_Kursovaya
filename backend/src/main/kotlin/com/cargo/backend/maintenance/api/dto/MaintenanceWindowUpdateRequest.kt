package com.cargo.backend.maintenance.api.dto

import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.time.LocalDate

data class MaintenanceWindowUpdateRequest(
    @field:NotNull(message = "Car id is required")
    val carId: Long,

    @field:NotNull(message = "Start date is required")
    val startDate: LocalDate,

    @field:NotNull(message = "End date is required")
    val endDate: LocalDate,

    @field:NotBlank(message = "Description is required")
    @field:Size(max = 300, message = "Description must be at most 300 characters")
    val description: String
)

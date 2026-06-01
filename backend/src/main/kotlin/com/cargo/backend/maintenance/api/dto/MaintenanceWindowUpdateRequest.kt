package com.cargo.backend.maintenance.api.dto

import com.cargo.backend.maintenance.domain.MaintenanceStatus
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.NotNull
import jakarta.validation.constraints.Size
import java.math.BigDecimal
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
    val description: String,

    @field:NotBlank(message = "Service type is required")
    @field:Size(max = 120, message = "Service type must be at most 120 characters")
    val serviceType: String,

    @field:Size(max = 2000, message = "Comment must be at most 2000 characters")
    val comment: String? = null,

    @field:NotNull(message = "Status is required")
    val status: MaintenanceStatus,

    val estimatedCost: BigDecimal? = null
)

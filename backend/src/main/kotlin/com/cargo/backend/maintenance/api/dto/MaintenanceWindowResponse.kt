package com.cargo.backend.maintenance.api.dto

import java.time.Instant
import java.time.LocalDate

data class MaintenanceWindowResponse(
    val id: Long,
    val carId: Long,
    val carVin: String,
    val carPlateNumber: String,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val description: String,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

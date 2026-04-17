package com.cargo.backend.maintenance.api.dto

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.maintenance.domain.MaintenanceStatus
import java.math.BigDecimal
import java.time.Instant

data class MaintenanceWindowResponse(
    val id: Long,
    val carId: Long,
    val from: String,
    val to: String,
    val serviceType: String,
    val comment: String,
    val status: MaintenanceStatus,
    val estimatedCost: BigDecimal?,
    val car: CarResponse?,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

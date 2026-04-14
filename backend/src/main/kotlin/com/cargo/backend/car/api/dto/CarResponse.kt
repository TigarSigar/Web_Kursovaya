package com.cargo.backend.car.api.dto

import com.cargo.backend.car.domain.CarClass
import com.cargo.backend.car.domain.CarStatus
import java.time.Instant

data class CarResponse(
    val id: Long,
    val vin: String,
    val plateNumber: String,
    val carClass: CarClass,
    val status: CarStatus,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

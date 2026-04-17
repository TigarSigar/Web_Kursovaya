package com.cargo.backend.car.api.dto

import com.cargo.backend.car.domain.CarClass
import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.domain.FuelType
import com.cargo.backend.car.domain.TransmissionType
import java.time.Instant

data class CarResponse(
    val id: Long,
    val vin: String,
    val plateNumber: String,
    val make: String,
    val model: String,
    val year: Int,
    val carClass: CarClass,
    val status: CarStatus,
    val seats: Int,
    val transmission: TransmissionType,
    val fuelType: FuelType,
    val location: String,
    val odometerKm: Int,
    val imageUrls: List<String>,
    val notes: String?,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

package com.cargo.backend.rental.api.dto

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.tariff.api.dto.TariffResponse

data class AvailableCarResultResponse(
    val car: CarResponse,
    val tariffs: List<TariffResponse>,
    val available: Boolean,
    val reasons: List<String>,
)

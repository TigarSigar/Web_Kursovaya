package com.cargo.backend.tariff.service

import com.cargo.backend.tariff.api.dto.TariffCreateRequest
import com.cargo.backend.tariff.api.dto.TariffResponse
import com.cargo.backend.tariff.api.dto.TariffUpdateRequest

interface TariffService {
    fun findAll(): List<TariffResponse>

    fun findById(id: Long): TariffResponse

    fun create(request: TariffCreateRequest): TariffResponse

    fun update(
        id: Long,
        request: TariffUpdateRequest,
    ): TariffResponse

    fun delete(id: Long)
}

package com.cargo.backend.tariff.service

import com.cargo.backend.common.error.ConflictException
import com.cargo.backend.common.error.ResourceNotFoundException
import com.cargo.backend.common.mapping.toFrontendResponse
import com.cargo.backend.common.mapping.toStoredMultiline
import com.cargo.backend.tariff.api.dto.TariffCreateRequest
import com.cargo.backend.tariff.api.dto.TariffResponse
import com.cargo.backend.tariff.api.dto.TariffUpdateRequest
import com.cargo.backend.tariff.domain.Tariff
import com.cargo.backend.tariff.repository.TariffRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class TariffServiceImpl(
    private val tariffRepository: TariffRepository,
) : TariffService {
    @Transactional(readOnly = true)
    override fun findAll(): List<TariffResponse> = tariffRepository.findAll().map { it.toFrontendResponse() }

    @Transactional(readOnly = true)
    override fun findById(id: Long): TariffResponse = findEntity(id).toFrontendResponse()

    @Transactional
    override fun create(request: TariffCreateRequest): TariffResponse {
        val normalizedName = request.name.trim()
        if (tariffRepository.existsByName(normalizedName)) {
            throw ConflictException("Tariff '$normalizedName' already exists")
        }
        val entity =
            Tariff(
                name = normalizedName,
                carClass = request.carClass,
                basePrice = request.basePrice,
                dailyPrice = request.dailyPrice,
                minimumDays = request.minimumDays,
                mileageLimitKm = request.mileageLimitKm,
                depositAmount = request.depositAmount,
                insuranceIncluded = request.insuranceIncluded,
                restrictions = request.restrictions.toStoredMultiline(),
                description = request.description.trim(),
            )
        return tariffRepository.save(entity).toFrontendResponse()
    }

    @Transactional
    override fun update(
        id: Long,
        request: TariffUpdateRequest,
    ): TariffResponse {
        val normalizedName = request.name.trim()
        if (tariffRepository.existsByNameAndIdNot(normalizedName, id)) {
            throw ConflictException("Tariff '$normalizedName' already exists")
        }

        val entity = findEntity(id)
        entity.name = normalizedName
        entity.carClass = request.carClass
        entity.basePrice = request.basePrice
        entity.dailyPrice = request.dailyPrice
        entity.minimumDays = request.minimumDays
        entity.mileageLimitKm = request.mileageLimitKm
        entity.depositAmount = request.depositAmount
        entity.insuranceIncluded = request.insuranceIncluded
        entity.restrictions = request.restrictions.toStoredMultiline()
        entity.description = request.description.trim()
        return tariffRepository.save(entity).toFrontendResponse()
    }

    @Transactional
    override fun delete(id: Long) {
        tariffRepository.delete(findEntity(id))
    }

    private fun findEntity(id: Long): Tariff =
        tariffRepository.findById(id).orElseThrow {
            ResourceNotFoundException("Tariff with id '$id' was not found")
        }
}

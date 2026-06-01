package com.cargo.backend.client.service

import com.cargo.backend.client.api.dto.ClientCreateRequest
import com.cargo.backend.client.api.dto.ClientResponse
import com.cargo.backend.client.api.dto.ClientUpdateRequest
import com.cargo.backend.client.domain.ClientProfile
import com.cargo.backend.client.repository.ClientProfileRepository
import com.cargo.backend.common.error.ConflictException
import com.cargo.backend.common.error.ResourceNotFoundException
import com.cargo.backend.common.mapping.toFrontendResponse
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class ClientProfileServiceImpl(
    private val clientProfileRepository: ClientProfileRepository
) : ClientProfileService {

    @Transactional(readOnly = true)
    override fun findAll(): List<ClientResponse> =
        clientProfileRepository.findAll().map { it.toFrontendResponse() }

    @Transactional(readOnly = true)
    override fun findById(id: Long): ClientResponse =
        findEntity(id).toFrontendResponse()

    @Transactional
    override fun create(request: ClientCreateRequest): ClientResponse {
        val normalizedEmail = request.email.trim().lowercase()
        if (clientProfileRepository.existsByEmail(normalizedEmail)) {
            throw ConflictException("Client with email '$normalizedEmail' already exists")
        }

        val entity = ClientProfile(
            fullName = request.fullName.trim(),
            email = normalizedEmail,
            phone = request.phone.trim(),
            driverLicenseNumber = request.driverLicenseNumber?.trim()?.ifBlank { null },
            driverLicenseExpiry = request.driverLicenseExpiry?.trim()?.ifBlank { null },
            memberSince = java.time.Instant.now()
        )
        return clientProfileRepository.save(entity).toFrontendResponse()
    }

    @Transactional
    override fun update(id: Long, request: ClientUpdateRequest): ClientResponse {
        val normalizedEmail = request.email.trim().lowercase()
        if (clientProfileRepository.existsByEmailAndIdNot(normalizedEmail, id)) {
            throw ConflictException("Client with email '$normalizedEmail' already exists")
        }

        val entity = findEntity(id)
        entity.fullName = request.fullName.trim()
        entity.email = normalizedEmail
        entity.phone = request.phone.trim()
        entity.driverLicenseNumber = request.driverLicenseNumber?.trim()?.ifBlank { null }
        entity.driverLicenseExpiry = request.driverLicenseExpiry?.trim()?.ifBlank { null }
        if (request.avatarBase64 != null) {
            entity.avatarBase64 = request.avatarBase64
        }
        return clientProfileRepository.save(entity).toFrontendResponse()
    }

    @Transactional
    override fun delete(id: Long) {
        clientProfileRepository.delete(findEntity(id))
    }

    private fun findEntity(id: Long): ClientProfile =
        clientProfileRepository.findById(id).orElseThrow {
            ResourceNotFoundException("Client with id '$id' was not found")
        }
}

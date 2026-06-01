package com.cargo.backend.client.service

import com.cargo.backend.client.api.dto.ClientCreateRequest
import com.cargo.backend.client.api.dto.ClientResponse
import com.cargo.backend.client.api.dto.ClientUpdateRequest

interface ClientProfileService {
    fun findAll(): List<ClientResponse>
    fun findById(id: Long): ClientResponse
    fun create(request: ClientCreateRequest): ClientResponse
    fun update(id: Long, request: ClientUpdateRequest): ClientResponse
    fun delete(id: Long)
}

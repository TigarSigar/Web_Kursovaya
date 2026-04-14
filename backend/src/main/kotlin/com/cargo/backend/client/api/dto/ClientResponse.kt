package com.cargo.backend.client.api.dto

import java.time.Instant

data class ClientResponse(
    val id: Long,
    val fullName: String,
    val email: String,
    val phone: String,
    val createdAt: Instant?,
    val updatedAt: Instant?
)

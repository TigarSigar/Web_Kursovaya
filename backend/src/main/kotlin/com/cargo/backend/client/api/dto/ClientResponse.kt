package com.cargo.backend.client.api.dto

import java.time.Instant

data class ClientResponse(
    val id: Long,
    val firstName: String,
    val lastName: String,
    val email: String,
    val phone: String,
    val driverLicenseNumber: String,
    val driverLicenseExpiry: String,
    val memberSince: String,
    val createdAt: Instant?,
    val updatedAt: Instant?,
)

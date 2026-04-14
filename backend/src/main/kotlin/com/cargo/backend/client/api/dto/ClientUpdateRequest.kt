package com.cargo.backend.client.api.dto

import jakarta.validation.constraints.Email
import jakarta.validation.constraints.NotBlank
import jakarta.validation.constraints.Size

data class ClientUpdateRequest(
    @field:NotBlank(message = "Full name is required")
    @field:Size(max = 120, message = "Full name must be at most 120 characters")
    val fullName: String,

    @field:NotBlank(message = "Email is required")
    @field:Email(message = "Email must be valid")
    @field:Size(max = 120, message = "Email must be at most 120 characters")
    val email: String,

    @field:NotBlank(message = "Phone is required")
    @field:Size(max = 30, message = "Phone must be at most 30 characters")
    val phone: String
)

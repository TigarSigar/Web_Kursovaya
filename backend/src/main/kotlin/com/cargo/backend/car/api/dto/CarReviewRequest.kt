package com.cargo.backend.car.api.dto

import jakarta.validation.constraints.Max
import jakarta.validation.constraints.Min
import jakarta.validation.constraints.NotBlank

data class CarReviewRequest(
    @field:NotBlank(message = "Review content cannot be blank")
    val content: String,

    @field:Min(1, message = "Rating must be at least 1")
    @field:Max(5, message = "Rating must be at most 5")
    val rating: Int
)

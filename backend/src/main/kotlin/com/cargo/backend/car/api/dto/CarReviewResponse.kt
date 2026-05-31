package com.cargo.backend.car.api.dto

import java.time.Instant

data class CarReviewResponse(
    val id: Long,
    val authorName: String,
    val authorAvatarBase64: String?,
    val content: String,
    val rating: Int,
    val createdAt: Instant?
)

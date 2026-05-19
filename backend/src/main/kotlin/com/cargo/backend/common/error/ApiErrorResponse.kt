package com.cargo.backend.common.error

import java.time.Instant

data class ApiErrorResponse(
    val timestamp: Instant = Instant.now(),
    val status: Int,
    val code: ErrorCode,
    val message: String,
    val path: String,
    val details: Map<String, String> = emptyMap(),
)

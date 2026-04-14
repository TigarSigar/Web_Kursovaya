package com.cargo.backend.rental.api.dto

import com.cargo.backend.rental.domain.RentalStatus
import java.time.Instant

data class RentalStatusHistoryResponse(
    val status: RentalStatus,
    val changedAt: Instant,
    val note: String
)

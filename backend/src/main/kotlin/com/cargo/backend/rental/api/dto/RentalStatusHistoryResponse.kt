package com.cargo.backend.rental.api.dto

import com.cargo.backend.common.domain.UserRole
import com.cargo.backend.rental.domain.RentalStatus
import java.time.Instant

data class RentalStatusHistoryResponse(
    val id: Long,
    val rentalId: Long,
    val status: RentalStatus,
    val changedAt: Instant,
    val actorRole: UserRole,
    val note: String,
)

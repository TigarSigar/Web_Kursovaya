package com.cargo.backend.rental.api.dto

import com.cargo.backend.rental.domain.RentalStatus
import java.time.Instant
import java.time.LocalDate

data class RentalResponse(
    val id: Long,
    val carId: Long,
    val carVin: String,
    val carPlateNumber: String,
    val clientId: Long,
    val clientName: String,
    val tariffId: Long,
    val tariffName: String,
    val startDate: LocalDate,
    val endDate: LocalDate,
    val status: RentalStatus,
    val price: PriceBreakdownResponse,
    val issuedAt: Instant?,
    val actualReturnAt: Instant?,
    val createdAt: Instant?,
    val updatedAt: Instant?,
    val history: List<RentalStatusHistoryResponse>
)

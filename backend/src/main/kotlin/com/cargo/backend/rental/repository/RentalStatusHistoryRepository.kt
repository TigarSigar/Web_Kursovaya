package com.cargo.backend.rental.repository

import com.cargo.backend.rental.domain.RentalStatusHistory
import org.springframework.data.jpa.repository.JpaRepository

interface RentalStatusHistoryRepository : JpaRepository<RentalStatusHistory, Long> {
    fun findAllByRentalIdOrderByChangedAtAsc(rentalId: Long): List<RentalStatusHistory>
}

package com.cargo.backend.rental.repository

import com.cargo.backend.rental.domain.RentalOrder
import com.cargo.backend.rental.domain.RentalStatus
import org.springframework.data.jpa.repository.JpaRepository

interface RentalOrderRepository : JpaRepository<RentalOrder, Long> {
    fun existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndStatusIn(
        carId: Long,
        endDate: java.time.LocalDate,
        startDate: java.time.LocalDate,
        statuses: Collection<RentalStatus>
    ): Boolean

    fun findAllByClientId(clientId: Long): List<RentalOrder>
}

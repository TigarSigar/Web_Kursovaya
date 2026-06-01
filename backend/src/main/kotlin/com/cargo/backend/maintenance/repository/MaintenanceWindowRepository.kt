package com.cargo.backend.maintenance.repository

import com.cargo.backend.maintenance.domain.MaintenanceWindow
import org.springframework.data.jpa.repository.JpaRepository

interface MaintenanceWindowRepository : JpaRepository<MaintenanceWindow, Long> {
    fun existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(
        carId: Long,
        endDate: java.time.LocalDate,
        startDate: java.time.LocalDate
    ): Boolean

    fun existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndIdNot(
        carId: Long,
        endDate: java.time.LocalDate,
        startDate: java.time.LocalDate,
        id: Long
    ): Boolean
}

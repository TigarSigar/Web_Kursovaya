package com.cargo.backend.car.repository

import com.cargo.backend.car.domain.Car
import com.cargo.backend.car.domain.CarStatus
import org.springframework.data.jpa.repository.JpaRepository

interface CarRepository : JpaRepository<Car, Long> {
    fun existsByVin(vin: String): Boolean
    fun existsByPlateNumber(plateNumber: String): Boolean
    fun existsByVinAndIdNot(vin: String, id: Long): Boolean
    fun existsByPlateNumberAndIdNot(plateNumber: String, id: Long): Boolean
    fun findAllByStatus(status: CarStatus): List<Car>
}

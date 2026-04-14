package com.cargo.backend.rental.service

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.rental.api.dto.RentalCreateRequest
import com.cargo.backend.rental.api.dto.RentalResponse
import java.time.LocalDate

interface RentalService {
    fun findAvailableCars(from: LocalDate, to: LocalDate): List<CarResponse>
    fun create(request: RentalCreateRequest): RentalResponse
    fun issue(id: Long): RentalResponse
    fun complete(id: Long): RentalResponse
    fun findByClient(clientId: Long): List<RentalResponse>
    fun findById(id: Long): RentalResponse
}

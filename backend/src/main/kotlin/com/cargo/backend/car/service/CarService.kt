package com.cargo.backend.car.service

import com.cargo.backend.car.api.dto.CarCreateRequest
import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.car.api.dto.CarUpdateRequest

interface CarService {
    fun findAll(): List<CarResponse>
    fun findById(id: Long): CarResponse
    fun create(request: CarCreateRequest): CarResponse
    fun update(id: Long, request: CarUpdateRequest): CarResponse
    fun delete(id: Long)
}

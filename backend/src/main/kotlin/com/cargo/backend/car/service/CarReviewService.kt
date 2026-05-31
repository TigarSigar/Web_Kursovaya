package com.cargo.backend.car.service

import com.cargo.backend.car.api.dto.CarReviewRequest
import com.cargo.backend.car.api.dto.CarReviewResponse
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable

interface CarReviewService {
    fun getReviewsForCar(carId: Long, pageable: Pageable): Page<CarReviewResponse>
    fun addReview(carId: Long, clientId: Long, request: CarReviewRequest): CarReviewResponse
}

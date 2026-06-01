package com.cargo.backend.car.api

import com.cargo.backend.car.api.dto.CarReviewRequest
import com.cargo.backend.car.api.dto.CarReviewResponse
import com.cargo.backend.car.service.CarReviewService
import jakarta.validation.Valid
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.web.PageableDefault
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.*

@RestController
@RequestMapping("/api/v1/cars/{carId}/reviews")
class CarReviewController(
    private val carReviewService: CarReviewService
) {

    @GetMapping
    fun getReviews(
        @PathVariable carId: Long,
        @PageableDefault(size = 20) pageable: Pageable
    ): Page<CarReviewResponse> {
        return carReviewService.getReviewsForCar(carId, pageable)
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun addReview(
        @PathVariable carId: Long,
        @RequestHeader("X-Client-Id") clientId: Long,
        @Valid @RequestBody request: CarReviewRequest
    ): CarReviewResponse {
        return carReviewService.addReview(carId, clientId, request)
    }
}

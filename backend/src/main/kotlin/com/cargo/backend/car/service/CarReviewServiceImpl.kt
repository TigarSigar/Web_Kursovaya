package com.cargo.backend.car.service

import com.cargo.backend.car.api.dto.CarReviewRequest
import com.cargo.backend.car.api.dto.CarReviewResponse
import com.cargo.backend.car.domain.CarReview
import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.car.repository.CarReviewRepository
import com.cargo.backend.client.repository.ClientProfileRepository
import com.cargo.backend.common.error.ResourceNotFoundException
import com.cargo.backend.common.mapping.toFrontendResponse
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CarReviewServiceImpl(
    private val carReviewRepository: CarReviewRepository,
    private val carRepository: CarRepository,
    private val clientProfileRepository: ClientProfileRepository
) : CarReviewService {

    @Transactional(readOnly = true)
    override fun getReviewsForCar(carId: Long, pageable: Pageable): Page<CarReviewResponse> {
        return carReviewRepository.findByCarIdOrderByCreatedAtDesc(carId, pageable)
            .map { it.toFrontendResponse() }
    }

    @Transactional
    override fun addReview(carId: Long, clientId: Long, request: CarReviewRequest): CarReviewResponse {
        val car = carRepository.findById(carId).orElseThrow {
            ResourceNotFoundException("Car with id '$carId' not found")
        }
        val client = clientProfileRepository.findById(clientId).orElseThrow {
            ResourceNotFoundException("Client with id '$clientId' not found")
        }

        val review = CarReview(
            car = car,
            author = client,
            content = request.content.trim(),
            rating = request.rating
        )

        return carReviewRepository.save(review).toFrontendResponse()
    }
}

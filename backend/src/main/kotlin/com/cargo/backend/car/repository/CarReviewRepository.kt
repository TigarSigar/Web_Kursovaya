package com.cargo.backend.car.repository

import com.cargo.backend.car.domain.CarReview
import org.springframework.data.domain.Page
import org.springframework.data.domain.Pageable
import org.springframework.data.jpa.repository.JpaRepository

interface CarReviewRepository : JpaRepository<CarReview, Long> {
    fun findByCarIdOrderByCreatedAtDesc(carId: Long, pageable: Pageable): Page<CarReview>
}

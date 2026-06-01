package com.cargo.backend.car.domain

import com.cargo.backend.client.domain.ClientProfile
import jakarta.persistence.*
import java.time.Instant

@Entity
@Table(name = "car_reviews")
class CarReview(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "car_id", nullable = false)
    val car: Car,

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "client_profile_id", nullable = false)
    val author: ClientProfile,

    @Column(name = "content_text", nullable = false, columnDefinition = "TEXT")
    var content: String,

    @Column(name = "rating", nullable = false)
    var rating: Int,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant? = null
) {
    @PrePersist
    fun onCreate() {
        if (createdAt == null) {
            createdAt = Instant.now()
        }
    }
}

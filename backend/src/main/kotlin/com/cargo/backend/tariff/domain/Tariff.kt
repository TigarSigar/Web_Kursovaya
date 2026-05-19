package com.cargo.backend.tariff.domain

import com.cargo.backend.car.domain.CarClass
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.math.BigDecimal
import java.time.Instant

@Entity
@Table(name = "tariffs")
class Tariff(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,
    @Column(name = "name", nullable = false, unique = true, length = 80)
    var name: String,
    @Column(name = "base_price", nullable = false, precision = 12, scale = 2)
    var basePrice: BigDecimal,
    @Column(name = "daily_price", nullable = false, precision = 12, scale = 2)
    var dailyPrice: BigDecimal,
    @Enumerated(EnumType.STRING)
    @Column(name = "car_class", length = 20)
    var carClass: CarClass? = null,
    @Column(name = "minimum_days")
    var minimumDays: Int? = null,
    @Column(name = "mileage_limit_km")
    var mileageLimitKm: Int? = null,
    @Column(name = "deposit_amount", precision = 12, scale = 2)
    var depositAmount: BigDecimal? = null,
    @Column(name = "insurance_included")
    var insuranceIncluded: Boolean? = null,
    @Column(name = "restrictions", nullable = false, length = 500)
    var restrictions: String,
    @Column(name = "description", length = 2000)
    var description: String? = null,
    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant? = null,
    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant? = null,
) {
    @PrePersist
    fun onCreate() {
        val now = Instant.now()
        createdAt = now
        updatedAt = now
    }

    @PreUpdate
    fun onUpdate() {
        updatedAt = Instant.now()
    }
}

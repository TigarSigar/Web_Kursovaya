package com.cargo.backend.car.domain

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
@Table(name = "cars")
class Car(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "vin", nullable = false, unique = true, length = 17)
    var vin: String,

    @Column(name = "plate_number", nullable = false, unique = true, length = 20)
    var plateNumber: String,

    @Column(name = "make", length = 80)
    var make: String? = null,

    @Column(name = "model", length = 80)
    var model: String? = null,

    @Column(name = "year_of_manufacture")
    var year: Int? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "car_class", nullable = false, length = 20)
    var carClass: CarClass,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    var status: CarStatus = CarStatus.AVAILABLE,

    @Column(name = "seats_count")
    var seats: Int? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "transmission", length = 20)
    var transmission: TransmissionType? = null,

    @Enumerated(EnumType.STRING)
    @Column(name = "fuel_type", length = 20)
    var fuelType: FuelType? = null,

    @Column(name = "location_name", length = 150)
    var location: String? = null,

    @Column(name = "odometer_km")
    var odometerKm: Int? = null,

    @Column(name = "image_urls", columnDefinition = "TEXT")
    var imageUrls: String? = null,

    @Column(name = "price_per_day", precision = 10, scale = 2)
    var pricePerDay: BigDecimal? = null,

    @Column(name = "notes", length = 2000)
    var notes: String? = null,

    @Column(name = "created_at", nullable = false, updatable = false)
    var createdAt: Instant? = null,

    @Column(name = "updated_at", nullable = false)
    var updatedAt: Instant? = null
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

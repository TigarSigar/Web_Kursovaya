package com.cargo.backend.client.domain

import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.PrePersist
import jakarta.persistence.PreUpdate
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "client_profiles")
class ClientProfile(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @Column(name = "full_name", nullable = false, length = 120)
    var fullName: String,

    @Column(name = "email", nullable = false, unique = true, length = 120)
    var email: String,

    @Column(name = "phone", nullable = false, length = 30)
    var phone: String,

    @Column(name = "driver_license_number", length = 40)
    var driverLicenseNumber: String? = null,

    @Column(name = "driver_license_expiry", length = 20)
    var driverLicenseExpiry: String? = null,

    @Column(name = "member_since", length = 20)
    var memberSince: String? = null,

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

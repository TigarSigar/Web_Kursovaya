package com.cargo.backend.rental.domain

import com.cargo.backend.common.domain.UserRole
import jakarta.persistence.Column
import jakarta.persistence.Entity
import jakarta.persistence.EnumType
import jakarta.persistence.Enumerated
import jakarta.persistence.FetchType
import jakarta.persistence.GeneratedValue
import jakarta.persistence.GenerationType
import jakarta.persistence.Id
import jakarta.persistence.JoinColumn
import jakarta.persistence.ManyToOne
import jakarta.persistence.Table
import java.time.Instant

@Entity
@Table(name = "rental_status_history")
class RentalStatusHistory(
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    val id: Long? = null,

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rental_id", nullable = false)
    val rental: RentalOrder,

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false, length = 20)
    val status: RentalStatus,

    @Column(name = "changed_at", nullable = false)
    val changedAt: Instant,

    @Enumerated(EnumType.STRING)
    @Column(name = "actor_role", length = 20)
    val actorRole: UserRole? = null,

    @Column(name = "note", nullable = false, length = 300)
    val note: String
)

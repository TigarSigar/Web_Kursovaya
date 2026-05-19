package com.cargo.backend.client.repository

import com.cargo.backend.client.domain.ClientProfile
import org.springframework.data.jpa.repository.JpaRepository

interface ClientProfileRepository : JpaRepository<ClientProfile, Long> {
    fun existsByEmail(email: String): Boolean

    fun existsByEmailAndIdNot(
        email: String,
        id: Long,
    ): Boolean
}

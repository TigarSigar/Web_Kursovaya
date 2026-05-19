package com.cargo.backend.tariff.repository

import com.cargo.backend.tariff.domain.Tariff
import org.springframework.data.jpa.repository.JpaRepository

interface TariffRepository : JpaRepository<Tariff, Long> {
    fun existsByName(name: String): Boolean

    fun existsByNameAndIdNot(
        name: String,
        id: Long,
    ): Boolean
}

package com.cargo.backend.maintenance.service

import com.cargo.backend.maintenance.api.dto.MaintenanceWindowCreateRequest
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowResponse
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowUpdateRequest

interface MaintenanceWindowService {
    fun findAll(): List<MaintenanceWindowResponse>

    fun findById(id: Long): MaintenanceWindowResponse

    fun create(request: MaintenanceWindowCreateRequest): MaintenanceWindowResponse

    fun update(
        id: Long,
        request: MaintenanceWindowUpdateRequest,
    ): MaintenanceWindowResponse

    fun delete(id: Long)
}

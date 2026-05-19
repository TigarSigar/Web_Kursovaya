package com.cargo.backend.maintenance.api

import com.cargo.backend.maintenance.api.dto.MaintenanceWindowCreateRequest
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowResponse
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowUpdateRequest
import com.cargo.backend.maintenance.service.MaintenanceWindowService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.DeleteMapping
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.PutMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/maintenance-windows")
class MaintenanceWindowController(
    private val maintenanceWindowService: MaintenanceWindowService,
) {
    @GetMapping
    fun getWindows(): List<MaintenanceWindowResponse> = maintenanceWindowService.findAll()

    @GetMapping("/{id}")
    fun getWindowById(
        @PathVariable id: Long,
    ): MaintenanceWindowResponse = maintenanceWindowService.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createWindow(
        @Valid @RequestBody request: MaintenanceWindowCreateRequest,
    ): MaintenanceWindowResponse = maintenanceWindowService.create(request)

    @PutMapping("/{id}")
    fun updateWindow(
        @PathVariable id: Long,
        @Valid @RequestBody request: MaintenanceWindowUpdateRequest,
    ): MaintenanceWindowResponse = maintenanceWindowService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteWindow(
        @PathVariable id: Long,
    ) {
        maintenanceWindowService.delete(id)
    }
}

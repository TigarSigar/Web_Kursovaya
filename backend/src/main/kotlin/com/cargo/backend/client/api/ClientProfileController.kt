package com.cargo.backend.client.api

import com.cargo.backend.client.api.dto.ClientCreateRequest
import com.cargo.backend.client.api.dto.ClientResponse
import com.cargo.backend.client.api.dto.ClientUpdateRequest
import com.cargo.backend.client.service.ClientProfileService
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
@RequestMapping("/api/v1/clients")
class ClientProfileController(
    private val clientProfileService: ClientProfileService,
) {
    @GetMapping
    fun getClients(): List<ClientResponse> = clientProfileService.findAll()

    @GetMapping("/{id}")
    fun getClientById(
        @PathVariable id: Long,
    ): ClientResponse = clientProfileService.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createClient(
        @Valid @RequestBody request: ClientCreateRequest,
    ): ClientResponse = clientProfileService.create(request)

    @PutMapping("/{id}")
    fun updateClient(
        @PathVariable id: Long,
        @Valid @RequestBody request: ClientUpdateRequest,
    ): ClientResponse = clientProfileService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteClient(
        @PathVariable id: Long,
    ) {
        clientProfileService.delete(id)
    }
}

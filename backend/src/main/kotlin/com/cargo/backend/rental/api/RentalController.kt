package com.cargo.backend.rental.api

import com.cargo.backend.rental.api.dto.RentalCreateRequest
import com.cargo.backend.rental.api.dto.RentalResponse
import com.cargo.backend.rental.service.RentalService
import jakarta.validation.Valid
import org.springframework.http.HttpStatus
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PatchMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.PostMapping
import org.springframework.web.bind.annotation.RequestBody
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.ResponseStatus
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/rentals")
class RentalController(
    private val rentalService: RentalService
) {

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createRental(@Valid @RequestBody request: RentalCreateRequest): RentalResponse =
        rentalService.create(request)

    @PatchMapping("/{id}/issue")
    fun issueRental(@PathVariable id: Long): RentalResponse = rentalService.issue(id)

    @PatchMapping("/{id}/complete")
    fun completeRental(@PathVariable id: Long): RentalResponse = rentalService.complete(id)

    @GetMapping("/{id}")
    fun getRentalById(@PathVariable id: Long): RentalResponse = rentalService.findById(id)
}

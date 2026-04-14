package com.cargo.backend.rental.api

import com.cargo.backend.rental.api.dto.RentalResponse
import com.cargo.backend.rental.service.RentalService
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.PathVariable
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RestController

@RestController
@RequestMapping("/api/v1/clients")
class ClientRentalController(
    private val rentalService: RentalService
) {

    @GetMapping("/{id}/rentals")
    fun getClientRentals(@PathVariable id: Long): List<RentalResponse> =
        rentalService.findByClient(id)
}

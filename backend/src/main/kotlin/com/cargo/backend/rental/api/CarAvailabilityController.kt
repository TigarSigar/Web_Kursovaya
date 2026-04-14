package com.cargo.backend.rental.api

import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.rental.service.RentalService
import org.springframework.format.annotation.DateTimeFormat
import org.springframework.web.bind.annotation.GetMapping
import org.springframework.web.bind.annotation.RequestMapping
import org.springframework.web.bind.annotation.RequestParam
import org.springframework.web.bind.annotation.RestController
import java.time.LocalDate

@RestController
@RequestMapping("/api/v1/cars")
class CarAvailabilityController(
    private val rentalService: RentalService
) {

    @GetMapping("/available")
    fun getAvailableCars(
        @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate
    ): List<CarResponse> = rentalService.findAvailableCars(from, to)
}

package com.cargo.backend.rental.api

import com.cargo.backend.car.domain.CarClass
import com.cargo.backend.rental.api.dto.AvailableCarResultResponse
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
    private val rentalService: RentalService,
) {
    @GetMapping("/available")
    fun getAvailableCars(
        @RequestParam("from") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) from: LocalDate,
        @RequestParam("to") @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) to: LocalDate,
        @RequestParam("location", required = false) location: String?,
        @RequestParam("carClass", required = false) carClass: CarClass?,
    ): List<AvailableCarResultResponse> = rentalService.findAvailableCars(from, to, location, carClass?.name)
}

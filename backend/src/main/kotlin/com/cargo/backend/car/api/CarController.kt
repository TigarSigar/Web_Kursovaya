package com.cargo.backend.car.api

import com.cargo.backend.car.api.dto.CarCreateRequest
import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.car.api.dto.CarUpdateRequest
import com.cargo.backend.car.service.CarService
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
@RequestMapping("/api/v1/cars")
class CarController(
    private val carService: CarService
) {

    @GetMapping
    fun getCars(): List<CarResponse> = carService.findAll()

    @GetMapping("/{id}")
    fun getCarById(@PathVariable id: Long): CarResponse = carService.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createCar(@Valid @RequestBody request: CarCreateRequest): CarResponse =
        carService.create(request)

    @PutMapping("/{id}")
    fun updateCar(
        @PathVariable id: Long,
        @Valid @RequestBody request: CarUpdateRequest
    ): CarResponse = carService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteCar(@PathVariable id: Long) {
        carService.delete(id)
    }
}

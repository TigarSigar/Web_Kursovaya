package com.cargo.backend.tariff.api

import com.cargo.backend.tariff.api.dto.TariffCreateRequest
import com.cargo.backend.tariff.api.dto.TariffResponse
import com.cargo.backend.tariff.api.dto.TariffUpdateRequest
import com.cargo.backend.tariff.service.TariffService
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
@RequestMapping("/api/v1/tariffs")
class TariffController(
    private val tariffService: TariffService
) {

    @GetMapping
    fun getTariffs(): List<TariffResponse> = tariffService.findAll()

    @GetMapping("/{id}")
    fun getTariffById(@PathVariable id: Long): TariffResponse = tariffService.findById(id)

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    fun createTariff(@Valid @RequestBody request: TariffCreateRequest): TariffResponse =
        tariffService.create(request)

    @PutMapping("/{id}")
    fun updateTariff(
        @PathVariable id: Long,
        @Valid @RequestBody request: TariffUpdateRequest
    ): TariffResponse = tariffService.update(id, request)

    @DeleteMapping("/{id}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    fun deleteTariff(@PathVariable id: Long) {
        tariffService.delete(id)
    }
}

package com.cargo.backend.car.service

import com.cargo.backend.car.api.dto.CarCreateRequest
import com.cargo.backend.car.api.dto.CarResponse
import com.cargo.backend.car.api.dto.CarUpdateRequest
import com.cargo.backend.car.domain.Car
import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.common.error.ConflictException
import com.cargo.backend.common.error.ResourceNotFoundException
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class CarServiceImpl(
    private val carRepository: CarRepository
) : CarService {

    @Transactional(readOnly = true)
    override fun findAll(): List<CarResponse> =
        carRepository.findAll().map { it.toResponse() }

    @Transactional(readOnly = true)
    override fun findById(id: Long): CarResponse =
        findEntity(id).toResponse()

    @Transactional
    override fun create(request: CarCreateRequest): CarResponse {
        validateUniquenessForCreate(request.vin, request.plateNumber)
        val entity = Car(
            vin = request.vin.trim().uppercase(),
            plateNumber = request.plateNumber.trim().uppercase(),
            carClass = request.carClass,
            status = request.status ?: CarStatus.AVAILABLE
        )
        return carRepository.save(entity).toResponse()
    }

    @Transactional
    override fun update(id: Long, request: CarUpdateRequest): CarResponse {
        validateUniquenessForUpdate(id, request.vin, request.plateNumber)
        val entity = findEntity(id)
        entity.vin = request.vin.trim().uppercase()
        entity.plateNumber = request.plateNumber.trim().uppercase()
        entity.carClass = request.carClass
        entity.status = request.status
        return carRepository.save(entity).toResponse()
    }

    @Transactional
    override fun delete(id: Long) {
        val entity = findEntity(id)
        carRepository.delete(entity)
    }

    private fun validateUniquenessForCreate(vin: String, plateNumber: String) {
        val normalizedVin = vin.trim().uppercase()
        val normalizedPlate = plateNumber.trim().uppercase()
        if (carRepository.existsByVin(normalizedVin)) {
            throw ConflictException("Car with VIN '$normalizedVin' already exists")
        }
        if (carRepository.existsByPlateNumber(normalizedPlate)) {
            throw ConflictException("Car with plate '$normalizedPlate' already exists")
        }
    }

    private fun validateUniquenessForUpdate(id: Long, vin: String, plateNumber: String) {
        val normalizedVin = vin.trim().uppercase()
        val normalizedPlate = plateNumber.trim().uppercase()
        if (carRepository.existsByVinAndIdNot(normalizedVin, id)) {
            throw ConflictException("Car with VIN '$normalizedVin' already exists")
        }
        if (carRepository.existsByPlateNumberAndIdNot(normalizedPlate, id)) {
            throw ConflictException("Car with plate '$normalizedPlate' already exists")
        }
    }

    private fun findEntity(id: Long): Car =
        carRepository.findById(id).orElseThrow {
            ResourceNotFoundException("Car with id '$id' was not found")
        }

    private fun Car.toResponse() = CarResponse(
        id = id ?: throw IllegalStateException("Car id is null"),
        vin = vin,
        plateNumber = plateNumber,
        carClass = carClass,
        status = status,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

package com.cargo.backend.maintenance.service

import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.common.error.ConflictException
import com.cargo.backend.common.error.ResourceNotFoundException
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowCreateRequest
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowResponse
import com.cargo.backend.maintenance.api.dto.MaintenanceWindowUpdateRequest
import com.cargo.backend.maintenance.domain.MaintenanceWindow
import com.cargo.backend.maintenance.repository.MaintenanceWindowRepository
import org.springframework.stereotype.Service
import org.springframework.transaction.annotation.Transactional

@Service
class MaintenanceWindowServiceImpl(
    private val maintenanceWindowRepository: MaintenanceWindowRepository,
    private val carRepository: CarRepository
) : MaintenanceWindowService {

    @Transactional(readOnly = true)
    override fun findAll(): List<MaintenanceWindowResponse> =
        maintenanceWindowRepository.findAll().map { it.toResponse() }

    @Transactional(readOnly = true)
    override fun findById(id: Long): MaintenanceWindowResponse =
        findEntity(id).toResponse()

    @Transactional
    override fun create(request: MaintenanceWindowCreateRequest): MaintenanceWindowResponse {
        validateDateRange(request.startDate, request.endDate)
        validateOverlapForCreate(request.carId, request.startDate, request.endDate)

        val car = findCar(request.carId)
        val entity = MaintenanceWindow(
            car = car,
            startDate = request.startDate,
            endDate = request.endDate,
            description = request.description.trim()
        )
        return maintenanceWindowRepository.save(entity).toResponse()
    }

    @Transactional
    override fun update(id: Long, request: MaintenanceWindowUpdateRequest): MaintenanceWindowResponse {
        validateDateRange(request.startDate, request.endDate)
        validateOverlapForUpdate(id, request.carId, request.startDate, request.endDate)

        val entity = findEntity(id)
        val car = findCar(request.carId)
        entity.car = car
        entity.startDate = request.startDate
        entity.endDate = request.endDate
        entity.description = request.description.trim()
        return maintenanceWindowRepository.save(entity).toResponse()
    }

    @Transactional
    override fun delete(id: Long) {
        maintenanceWindowRepository.delete(findEntity(id))
    }

    private fun validateDateRange(startDate: java.time.LocalDate, endDate: java.time.LocalDate) {
        if (endDate.isBefore(startDate)) {
            throw IllegalArgumentException("End date must be greater than or equal to start date")
        }
    }

    private fun validateOverlapForCreate(carId: Long, startDate: java.time.LocalDate, endDate: java.time.LocalDate) {
        val hasOverlap = maintenanceWindowRepository
            .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqual(carId, endDate, startDate)
        if (hasOverlap) {
            throw ConflictException("Maintenance window overlaps with existing window for this car")
        }
    }

    private fun validateOverlapForUpdate(id: Long, carId: Long, startDate: java.time.LocalDate, endDate: java.time.LocalDate) {
        val hasOverlap = maintenanceWindowRepository
            .existsByCarIdAndStartDateLessThanEqualAndEndDateGreaterThanEqualAndIdNot(carId, endDate, startDate, id)
        if (hasOverlap) {
            throw ConflictException("Maintenance window overlaps with existing window for this car")
        }
    }

    private fun findCar(carId: Long) =
        carRepository.findById(carId).orElseThrow {
            ResourceNotFoundException("Car with id '$carId' was not found")
        }

    private fun findEntity(id: Long): MaintenanceWindow =
        maintenanceWindowRepository.findById(id).orElseThrow {
            ResourceNotFoundException("Maintenance window with id '$id' was not found")
        }

    private fun MaintenanceWindow.toResponse() = MaintenanceWindowResponse(
        id = id ?: throw IllegalStateException("Maintenance window id is null"),
        carId = car.id ?: throw IllegalStateException("Car id is null"),
        carVin = car.vin,
        carPlateNumber = car.plateNumber,
        startDate = startDate,
        endDate = endDate,
        description = description,
        createdAt = createdAt,
        updatedAt = updatedAt
    )
}

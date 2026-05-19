package com.cargo.backend.common.config

import com.cargo.backend.car.domain.Car
import com.cargo.backend.car.domain.CarClass
import com.cargo.backend.car.domain.CarStatus
import com.cargo.backend.car.domain.FuelType
import com.cargo.backend.car.domain.TransmissionType
import com.cargo.backend.car.repository.CarRepository
import com.cargo.backend.client.domain.ClientProfile
import com.cargo.backend.client.repository.ClientProfileRepository
import com.cargo.backend.common.domain.UserRole
import com.cargo.backend.common.mapping.toStoredMultiline
import com.cargo.backend.maintenance.domain.MaintenanceStatus
import com.cargo.backend.maintenance.domain.MaintenanceWindow
import com.cargo.backend.maintenance.repository.MaintenanceWindowRepository
import com.cargo.backend.rental.domain.RentalOrder
import com.cargo.backend.rental.domain.RentalStatus
import com.cargo.backend.rental.domain.RentalStatusHistory
import com.cargo.backend.rental.repository.RentalOrderRepository
import com.cargo.backend.rental.repository.RentalStatusHistoryRepository
import com.cargo.backend.tariff.domain.Tariff
import com.cargo.backend.tariff.repository.TariffRepository
import org.springframework.boot.CommandLineRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import java.math.BigDecimal
import java.time.Instant
import java.time.LocalDate

@Configuration
class DemoDataInitializer {
    @Bean
    fun demoDataRunner(
        carRepository: CarRepository,
        tariffRepository: TariffRepository,
        clientProfileRepository: ClientProfileRepository,
        maintenanceWindowRepository: MaintenanceWindowRepository,
        rentalOrderRepository: RentalOrderRepository,
        rentalStatusHistoryRepository: RentalStatusHistoryRepository,
    ) = CommandLineRunner {
        if (carRepository.count() > 0L) {
            return@CommandLineRunner
        }

        val today = LocalDate.now()
        val now = Instant.now()

        val cars = carRepository.saveAll(buildDemoCars())
        val carsByVin = cars.associateBy { it.vin }

        val tariffs = tariffRepository.saveAll(buildDemoTariffs())
        val tariffsByName = tariffs.associateBy { it.name }

        val clients = clientProfileRepository.saveAll(buildDemoClients())
        val clientsByEmail = clients.associateBy { it.email }

        maintenanceWindowRepository.saveAll(buildMaintenanceWindows(carsByVin, today))

        val activeRental =
            rentalOrderRepository.save(
                buildActiveRental(
                    carsByVin = carsByVin,
                    tariffsByName = tariffsByName,
                    clientsByEmail = clientsByEmail,
                    today = today,
                    now = now,
                ),
            )

        rentalStatusHistoryRepository.saveAll(buildActiveRentalHistory(activeRental, now))
    }

    private fun buildDemoCars(): List<Car> =
        listOf(
            Car(
                vin = VIN_SKODA,
                plateNumber = "А123ВС154",
                make = "Skoda",
                model = "Octavia",
                year = 2024,
                carClass = CarClass.COMFORT,
                status = CarStatus.AVAILABLE,
                seats = 5,
                transmission = TransmissionType.AUTOMATIC,
                fuelType = FuelType.PETROL,
                location = "Новосибирск, Центр",
                odometerKm = 21500,
                imageUrls = emptyGallery(),
                notes = "Основной городской автомобиль для коротких и средних поездок.",
            ),
            Car(
                vin = VIN_KIA,
                plateNumber = "В456ОР154",
                make = "Kia",
                model = "Rio",
                year = 2023,
                carClass = CarClass.ECONOMY,
                status = CarStatus.AVAILABLE,
                seats = 5,
                transmission = TransmissionType.AUTOMATIC,
                fuelType = FuelType.PETROL,
                location = "Аэропорт Толмачево",
                odometerKm = 38210,
                imageUrls = emptyGallery(),
                notes = "Экономичный вариант для аренды от 1 суток.",
            ),
            Car(
                vin = VIN_CAMRY,
                plateNumber = "Е789КР154",
                make = "Toyota",
                model = "Camry",
                year = 2024,
                carClass = CarClass.BUSINESS,
                status = CarStatus.RENTED,
                seats = 5,
                transmission = TransmissionType.AUTOMATIC,
                fuelType = FuelType.HYBRID,
                location = "Новосибирск, Центр",
                odometerKm = 14120,
                imageUrls = emptyGallery(),
                notes = "Часто используется для корпоративных клиентов.",
            ),
            Car(
                vin = VIN_HAVAL,
                plateNumber = "М101ТА154",
                make = "Haval",
                model = "Jolion",
                year = 2025,
                carClass = CarClass.SUV,
                status = CarStatus.AVAILABLE,
                seats = 5,
                transmission = TransmissionType.AUTOMATIC,
                fuelType = FuelType.PETROL,
                location = "Академгородок",
                odometerKm = 8600,
                imageUrls = emptyGallery(),
                notes = "Подходит для поездок за город и семейных маршрутов.",
            ),
            Car(
                vin = VIN_BMW,
                plateNumber = "С202НН154",
                make = "BMW",
                model = "530i",
                year = 2022,
                carClass = CarClass.PREMIUM,
                status = CarStatus.INACTIVE,
                seats = 5,
                transmission = TransmissionType.AUTOMATIC,
                fuelType = FuelType.PETROL,
                location = "Новосибирск, Центр",
                odometerKm = 55200,
                imageUrls = emptyGallery(),
                notes = "Снят с выдачи до решения по капитальному ремонту.",
            ),
            Car(
                vin = VIN_SOLARIS,
                plateNumber = "К333РМ154",
                make = "Hyundai",
                model = "Solaris",
                year = 2023,
                carClass = CarClass.ECONOMY,
                status = CarStatus.MAINTENANCE,
                seats = 5,
                transmission = TransmissionType.AUTOMATIC,
                fuelType = FuelType.PETROL,
                location = "ЖД вокзал",
                odometerKm = 47400,
                imageUrls = emptyGallery(),
                notes = "Сейчас проходит плановое обслуживание.",
            ),
        )

    private fun buildDemoTariffs(): List<Tariff> =
        listOf(
            Tariff(
                name = "Economy Start",
                carClass = CarClass.ECONOMY,
                basePrice = BigDecimal("1200"),
                dailyPrice = BigDecimal("2200"),
                minimumDays = 1,
                mileageLimitKm = 250,
                depositAmount = BigDecimal("5000"),
                insuranceIncluded = true,
                restrictions = listOf("Только по РФ", "Возраст водителя от 21 года").toStoredMultiline(),
                description = "Базовый тариф для коротких городских поездок.",
            ),
            Tariff(
                name = "Comfort Flex",
                carClass = CarClass.COMFORT,
                basePrice = BigDecimal("1800"),
                dailyPrice = BigDecimal("3200"),
                minimumDays = 1,
                mileageLimitKm = 300,
                depositAmount = BigDecimal("7000"),
                insuranceIncluded = true,
                restrictions = listOf("Не более 2 водителей", "Без выезда за пределы РФ").toStoredMultiline(),
                description = "Сбалансированный тариф для поездок на 2-5 дней.",
            ),
            Tariff(
                name = TARIFF_BUSINESS_TRIP,
                carClass = CarClass.BUSINESS,
                basePrice = BigDecimal("2600"),
                dailyPrice = BigDecimal("4700"),
                minimumDays = 2,
                mileageLimitKm = 350,
                depositAmount = BigDecimal("10000"),
                insuranceIncluded = true,
                restrictions = listOf("Минимум 2 суток", "Только один водитель").toStoredMultiline(),
                description = "Тариф для деловых поездок и длительной аренды.",
            ),
            Tariff(
                name = "Premium Select",
                carClass = CarClass.PREMIUM,
                basePrice = BigDecimal("4000"),
                dailyPrice = BigDecimal("6500"),
                minimumDays = 2,
                mileageLimitKm = 400,
                depositAmount = BigDecimal("15000"),
                insuranceIncluded = true,
                restrictions = listOf("Стаж водителя от 3 лет", "Минимум 2 суток").toStoredMultiline(),
                description = "Премиальный тариф с повышенным депозитом.",
            ),
            Tariff(
                name = "SUV Family",
                carClass = CarClass.SUV,
                basePrice = BigDecimal("2300"),
                dailyPrice = BigDecimal("4200"),
                minimumDays = 1,
                mileageLimitKm = 350,
                depositAmount = BigDecimal("9000"),
                insuranceIncluded = true,
                restrictions = listOf("Без буксировки", "Только асфальтовые дороги").toStoredMultiline(),
                description = "Тариф для семейных поездок и аренды на выходные.",
            ),
        )

    private fun buildDemoClients(): List<ClientProfile> =
        listOf(
            ClientProfile(
                fullName = "Анна Иванова",
                email = EMAIL_PRIMARY_CLIENT,
                phone = "+7 (913) 555-00-11",
                driverLicenseNumber = "54 11 123456",
                driverLicenseExpiry = "2028-11-01",
                memberSince = "2024-02-18",
            ),
            ClientProfile(
                fullName = "Игорь Петров",
                email = EMAIL_SECONDARY_CLIENT,
                phone = "+7 (983) 555-22-44",
                driverLicenseNumber = "54 22 654321",
                driverLicenseExpiry = "2027-05-14",
                memberSince = "2023-09-10",
            ),
        )

    private fun buildMaintenanceWindows(
        carsByVin: Map<String, Car>,
        today: LocalDate,
    ): List<MaintenanceWindow> =
        listOf(
            MaintenanceWindow(
                car = carsByVin.getValue(VIN_SOLARIS),
                startDate = today.minusDays(1),
                endDate = today.plusDays(2),
                description = "Плановое обслуживание",
                serviceType = "Плановое ТО",
                comment = "Проверка тормозной системы и замена расходников.",
                status = MaintenanceStatus.IN_PROGRESS,
                estimatedCost = BigDecimal("18000"),
            ),
            MaintenanceWindow(
                car = carsByVin.getValue(VIN_HAVAL),
                startDate = today.plusDays(7),
                endDate = today.plusDays(9),
                description = "Подготовка к сезону",
                serviceType = "Диагностика",
                comment = "Проверка перед длинными семейными маршрутами.",
                status = MaintenanceStatus.SCHEDULED,
                estimatedCost = BigDecimal("9000"),
            ),
        )

    private fun buildActiveRental(
        carsByVin: Map<String, Car>,
        tariffsByName: Map<String, Tariff>,
        clientsByEmail: Map<String, ClientProfile>,
        today: LocalDate,
        now: Instant,
    ): RentalOrder =
        RentalOrder(
            car = carsByVin.getValue(VIN_CAMRY),
            client = clientsByEmail.getValue(EMAIL_PRIMARY_CLIENT),
            tariff = tariffsByName.getValue(TARIFF_BUSINESS_TRIP),
            startDate = today.minusDays(3),
            endDate = today.plusDays(1),
            pickupLocation = "Новосибирск, Центр",
            returnLocation = "Новосибирск, Центр",
            totalDays = 4,
            basePrice = BigDecimal("2600"),
            dailyPrice = BigDecimal("4700"),
            totalPrice = BigDecimal("21400"),
            status = RentalStatus.ISSUED,
            issuedAt = now.minusSeconds(ONE_DAY_SECONDS),
        )

    private fun buildActiveRentalHistory(
        rental: RentalOrder,
        now: Instant,
    ): List<RentalStatusHistory> =
        listOf(
            RentalStatusHistory(
                rental = rental,
                status = RentalStatus.CREATED,
                changedAt = now.minusSeconds(TWO_DAYS_SECONDS),
                actorRole = UserRole.CLIENT,
                note = "Заказ создан на период аренды.",
            ),
            RentalStatusHistory(
                rental = rental,
                status = RentalStatus.ISSUED,
                changedAt = now.minusSeconds(ONE_DAY_SECONDS),
                actorRole = UserRole.FLEET_MANAGER,
                note = "Автомобиль выдан клиенту.",
            ),
        )

    private fun emptyGallery(): String = emptyList<String>().toStoredMultiline()

    private companion object {
        const val VIN_SKODA = "XW8ZZZ3CZHG000101"
        const val VIN_KIA = "XTA219010P0000202"
        const val VIN_CAMRY = "JTNBE46K973012303"
        const val VIN_HAVAL = "LGWEE4A56RF000404"
        const val VIN_BMW = "WBAFR9C54CC000505"
        const val VIN_SOLARIS = "Z94CB41AACR000606"

        const val EMAIL_PRIMARY_CLIENT = "client@carrent.local"
        const val EMAIL_SECONDARY_CLIENT = "client2@carrent.local"
        const val TARIFF_BUSINESS_TRIP = "Business Trip"

        const val ONE_DAY_SECONDS = 86_400L
        const val TWO_DAYS_SECONDS = 172_800L
    }
}

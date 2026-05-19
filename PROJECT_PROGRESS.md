# Прогресс по проекту

Дата фиксации статуса: 5 мая 2026.

Проведена сверка проекта с ТЗ из `readme.md`: тема 5 "Сервис аренды автомобилей" и общий обязательный стек/чеклист дисциплины.

## Статус на сейчас

По предметному ТЗ темы "Сервис аренды автомобилей" проект почти закрыт: функционально он готов для демонстрации MVP.

По общему чеклисту дисциплины закрыта базовая часть, но остаются обязательные блоки: security, миграции, Redis/async, CI и полноценная Docker-инфраструктура.

## Что уже готово

- Реализованы обязательные сущности темы 5:
  - `Car`
  - `Tariff`
  - `ClientProfile`
  - `RentalOrder`
  - `MaintenanceWindow`
  - `RentalStatusHistory`

  См. `Car.kt`, `Tariff.kt`, `ClientProfile.kt`, `RentalOrder.kt`, `MaintenanceWindow.kt`, `RentalStatusHistory.kt`.

- Реализован минимальный API-контур темы 5:
  - `CRUD /cars`
  - `CRUD /tariffs`
  - `CRUD /maintenance-windows`
  - `GET /cars/available`
  - `POST /rentals`
  - `PATCH /rentals/{id}/issue`
  - `PATCH /rentals/{id}/complete`
  - `GET /clients/{id}/rentals`

  См. `CarController.kt`, `TariffController.kt`, `MaintenanceWindowController.kt`, `CarAvailabilityController.kt`, `RentalController.kt`, `ClientRentalController.kt`.

- Реализованы ключевые бизнес-правила темы 5 на backend:
  - запрет пересечения периодов аренды одного автомобиля;
  - блокировка бронирования на время maintenance-window;
  - серверный расчёт цены по тарифу и длительности;
  - фиксация фактического времени возврата;
  - запрет отмены после выдачи автомобиля.

  См. `RentalServiceImpl.kt`.

- Frontend закрывает MVP-сценарии клиента и менеджера:
  - публичный вход в приложение;
  - сценарии клиента;
  - сценарии менеджера автопарка;
  - разделение ролей;
  - route guards.

  См. `frontend/src/router/index.ts`, `frontend/src/store/auth.ts`, `frontend/README.md`.

- Выполнен архитектурный backend-baseline:
  - слойность `api -> service -> repository -> domain`;
  - DTO и валидация;
  - единый обработчик ошибок;
  - OpenAPI/Swagger.

  См. `backend/build.gradle.kts`, `GlobalExceptionHandler.kt`, `OpenApiConfig.kt`.

- Подключён Actuator:
  - `health`;
  - `info`;
  - `metrics`.

  См. `backend/build.gradle.kts`, `backend/src/main/resources/application.yml`.

- Frontend-сборка проходит успешно:

```bash
npm run build
```

## Что ещё нужно сделать

Обязательные блоки по общему стеку/чеклисту курса:

- Spring Security + JWT + backend role protection не реализованы.
- Миграции Flyway/Liquibase отсутствуют; сейчас используется `ddl-auto: update`.

  См. `backend/src/main/resources/application-dev.yml`.

- Backend-тесты пока минимальные: есть только `contextLoads`, нет unit-тестов и Testcontainers.

  См. `BackendApplicationTests.kt`.

- Полная контейнеризация не завершена:
  - в `docker-compose.yml` сейчас есть только frontend;
  - backend Dockerfile отсутствует;
  - full stack `backend + postgres + redis` отсутствует.

  См. `docker-compose.yml`, `frontend/Dockerfile`.

- Redis + `@Cacheable` не реализованы.
- `@Async` / `@Scheduled` сценарий не реализован.
- CI через GitHub Actions не настроен.
- Локализация частичная:
  - i18n подключён;
  - часть страниц всё ещё содержит локальный copy без единого словаря.

  См. `frontend/src/i18n/index.ts`, `RentalCreatePage.vue`, `PublicHomePage.vue`.

- Документация частично разошлась с кодом:
  - в `stages.md` и `SETUP.md` не отражены некоторые уже выполненные вещи;
  - пример: cancel endpoint и связанные правила.

  См. `stages.md`, `SETUP.md`.

## Отдельная техническая проблема

Backend-тесты локально не запустились из-за версии Java:

- локально обнаружена `openjdk 25.0.2`;
- проект настроен под Java 21 toolchain.

Перед демонстрацией и проверкой backend-тестов нужно привести Java на машине показа к версии 21.

## План презентации

План был подготовлен под показ на 23 апреля 2026.

1. 1 минута: тема, цель, роли и требования по ТЗ.
   - Показать блок темы 5 из `readme.md`.

2. 2 минуты: архитектура проекта.
   - Frontend-слои.
   - Backend-цепочка `Controller -> Service -> Repository`.

3. 4-5 минут: live demo MVP по ролям.
   - Сценарий клиента.
   - Сценарий менеджера автопарка.

4. 2 минуты: backend API в Swagger.
   - `/swagger-ui.html`
   - подтверждение бизнес-правил: доступность, цена, история статусов.

5. 1-2 минуты: честный статус по общему чеклисту курса.
   - Что сделано.
   - Что ещё в работе.

6. 1 минута: ближайший roadmap.
   - Security.
   - Migrations.
   - Tests/CI.
   - Redis/Async.
   - Full Docker.

## Рекомендации перед показом

- Привести Java на машине показа к версии 21.
- Обновить `stages.md` и `SETUP.md`, чтобы убрать расхождения с текущим кодом.
- Подготовить короткий сценарий кликов для двух ролей, чтобы уложиться в тайминг.

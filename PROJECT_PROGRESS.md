# Прогресс по проекту

Дата фиксации статуса: 5 мая 2026.

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

- Реализованы ключевые бизнес-правила темы на backend:
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


## Процент выполнения поставленной задачи:
- Front: 85% MVP-сценарии, роли, страницы, guards и сборка готовы. Остались в основном локализация, полировка и синхронизация документации.
- Back: 70% предметная логика аренды почти готова, API и бизнес-правила реализованы. Но не закрыты обязательные блоки курса: Security/JWT, миграции, нормальные тесты, Redis/async, CI и full Docker.
- Общий: 72% проект уже можно показывать как функциональный MVP, но по формальному чеклисту дисциплины ещё есть значимые технические долги.

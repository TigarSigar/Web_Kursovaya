# Stages Plan (Car Rental Course Project)

This document is the execution roadmap from the current state (frontend mostly complete) to full compliance with `readme.md`.

## Stage 0 - Baseline and Freeze
- [x] Confirm project structure and current frontend status.
- [x] Create handoff docs (`AGENTS.md`).
- [ ] Freeze current frontend as milestone tag/branch (recommended before backend integration).

Deliverable:
- Stable frontend baseline ready for integration.

## Stage 1 - Frontend Product Readiness
- [x] Role-based pages and routing (`CLIENT`, `FLEET_MANAGER`).
- [x] Domain entities in TypeScript and mock API abstraction.
- [x] Business rules reflected in UI and mock backend.
- [x] Reusable component system and dark v0-like visual style.
- [x] Public-first entry flow (`/` first, then login/register).
- [x] Localization switcher (`Ru` / `En`) and partial localization.
- [ ] Full localization pass for all texts (optional but recommended before defense).
- [ ] Final UI polish pass across all manager tables/forms.

Deliverable:
- Frontend ready for demo and backend swap.

## Stage 2 - Frontend Dockerization (start now)
- [x] Add `frontend/Dockerfile` (multi-stage: build + nginx runtime).
- [x] Add `frontend/nginx.conf` with SPA fallback to `index.html`.
- [x] Add `frontend/.dockerignore`.
- [x] Add root `docker-compose.yml` with frontend service.
- [x] Verify local run via Docker.

Deliverable:
- Frontend starts from Docker independently.

## Stage 3 - Backend Foundation (required by course README)
- [x] Initialize Kotlin + Spring Boot backend project.
- [x] Layered architecture (`Controller -> Service -> Repository`) + DTO + validation.
- [x] Centralized error handling (`@ControllerAdvice`).
- [x] Add OpenAPI/Swagger (SpringDoc).
- [x] Add PostgreSQL config and environments.

Deliverable:
- Backend skeleton matching architecture requirements.

## Stage 4 - Domain and Business Backend
- [x] Implement entities/tables for car rental domain.
- [x] Implement CRUD for `Car`, `Tariff`, `MaintenanceWindow`.
  - [x] `Car` CRUD implemented (`/api/v1/cars`)
  - [x] `Tariff` CRUD (`/api/v1/tariffs`)
  - [x] `MaintenanceWindow` CRUD (`/api/v1/maintenance-windows`)
- [x] Implement key endpoints:
  - [x] `GET /cars/available?from=&to=`
  - [x] `POST /rentals`
  - [x] `PATCH /rentals/{id}/issue`
  - [x] `PATCH /rentals/{id}/complete`
  - [x] `GET /clients/{id}/rentals`
- [ ] Enforce business rules at backend level (not only UI).
  - [x] no overlapping rentals for one car
  - [x] maintenance windows block booking
  - [x] price is computed server-side from tariff and duration
  - [x] completion captures actual return time
  - [ ] explicit cancel endpoint with "forbidden after issue" rule

Deliverable:
- Functional domain backend with real API.

## Stage 5 - Security and Access Control
- [ ] Spring Security + JWT.
- [ ] Role model and access restrictions for endpoints.
- [ ] Auth endpoints and token flow.
- [ ] Align frontend auth flow with real backend tokens.

Deliverable:
- End-to-end role-secured system.

## Stage 6 - Data Migrations and Persistence Quality
- [ ] Add Flyway or Liquibase (one tool only).
- [ ] Create versioned migrations for full schema.
- [ ] Seed minimal demo data strategy.
- [ ] Review relations and loading strategy to avoid key N+1 issues.

Deliverable:
- Reproducible DB schema lifecycle.

## Stage 7 - Redis and Async/Scheduled Scenarios
- [ ] Add Redis and configure cache strategy.
- [ ] Implement at least one justified `@Cacheable` read scenario.
- [ ] Implement at least one `@Async` or `@Scheduled` scenario.
- [ ] Expose/validate behavior in API + docs.

Deliverable:
- Compliance with cache/async requirements.

## Stage 8 - Testing and CI
- [ ] Unit tests for core service logic.
- [ ] Integration tests with Testcontainers (PostgreSQL).
- [ ] Add GitHub Actions:
  - [ ] backend build + tests
  - [ ] frontend build + checks

Deliverable:
- Automated quality gate for both parts.

## Stage 9 - Full Containerization and Compose
- [ ] Backend Dockerfile.
- [ ] Frontend Dockerfile (from Stage 2).
- [ ] Root `docker-compose.yml` for:
  - [ ] frontend
  - [ ] backend
  - [ ] postgres
  - [ ] redis
- [ ] Verify `docker-compose up` boots full stack.

Deliverable:
- One-command local startup per course requirements.

## Stage 10 - Observability and Final Audit
- [ ] Spring Actuator (`/actuator/health`, `/actuator/metrics`).
- [ ] Final requirements mapping table (`Requirement -> Where implemented -> Endpoint/Scenario`).
- [ ] Final UX/API consistency check and defense prep.

Deliverable:
- Submission-ready project with traceable requirement coverage.

---

## Execution Notes
- Current repository now includes production-style frontend plus initialized backend skeleton.
- Stage 2 verification result:
  - `docker compose build frontend` passed
  - `docker compose up -d` started container successfully
  - `docker compose ps` shows `car-rental-frontend` in `Up` state on `0.0.0.0:8080->80`
  - `curl -I http://localhost:8080` returned `HTTP/1.1 200 OK`
- Stage 3 implemented in `backend/`:
  - Kotlin + Spring Boot 3.5.13 + Gradle
  - Layered modules (`api/service/repository/domain`)
  - DTO validation + global exception handling
  - Swagger/OpenAPI via SpringDoc
  - Profile-based PostgreSQL config (`application-dev.yml`, `application-docker.yml`)
  - Backend test status: `./gradlew test` passed
- Stage 4 current progress:
  - Added entities: `ClientProfile`, `RentalOrder`, `RentalStatusHistory`, `Tariff`, `MaintenanceWindow`
  - Added APIs: cars available, rental create, issue, complete, rentals-by-client
  - Added overlap validations for rental periods and maintenance windows
  - Added server-side price calculation from tariff + rental days
  - Added status history persistence for rental lifecycle transitions
  - `./gradlew test` still passes after changes
- Next execution focus: Stage 5 (JWT auth + role-based endpoint protection).

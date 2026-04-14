# AGENTS.md

## Project Snapshot

Commercial-style car rental web system with:

- `frontend`: Vue 3 + TypeScript + Pinia + Vue Router + Vite
- `backend`: Kotlin + Spring Boot 3.5 + JPA + Validation + PostgreSQL + SpringDoc OpenAPI

Workspace root:

- `C:\Users\Egor\Desktop\Web_Kursovaya`

## Current Repository Structure

- `frontend/` - UI application (v0-inspired visual style, dark SaaS look)
- `backend/` - REST backend skeleton with domain APIs
- `v0 example/` - original visual reference
- `stages.md` - staged implementation roadmap
- `docker-compose.yml` - currently frontend service

## What Is Implemented

### Frontend

- Public-first entry (site opens immediately, login/register optional)
- Role-separated app areas (`CLIENT`, `FLEET_MANAGER`)
- Route guards by auth and role
- Reusable UI components and design system adapted from v0
- Language switcher (`Ru` / `En`)
- Rental-focused pages and manager CRUD views
- Mock API abstraction layer and stores

Main frontend paths:

- `frontend/src/pages`
- `frontend/src/components`
- `frontend/src/router/index.ts`
- `frontend/src/store`
- `frontend/src/api`
- `frontend/src/mock`

### Backend

Implemented modules:

- `Car` CRUD: `/api/v1/cars`
- `Tariff` CRUD: `/api/v1/tariffs`
- `MaintenanceWindow` CRUD: `/api/v1/maintenance-windows`
- Availability and rental flow:
  - `GET /api/v1/cars/available?from=&to=`
  - `POST /api/v1/rentals`
  - `PATCH /api/v1/rentals/{id}/issue`
  - `PATCH /api/v1/rentals/{id}/complete`
  - `GET /api/v1/clients/{id}/rentals`

Implemented backend rules:

- No overlapping rental periods for one car
- Maintenance windows block booking
- Price is calculated server-side from tariff and duration
- Completion stores actual return time
- Status history is persisted for rental transitions

Backend technical baseline:

- Layered architecture: `api -> service -> repository -> domain`
- DTO validation (`jakarta.validation`)
- Global error handler (`@RestControllerAdvice`)
- OpenAPI/Swagger (`/swagger-ui.html`, `/api-docs`)
- Profile configs: `application.yml`, `application-dev.yml`, `application-docker.yml`

## What Is Still Pending

- Rental cancel endpoint with explicit rule "forbidden after issue"
- Spring Security + JWT + role protection on backend endpoints
- DB migrations (Flyway/Liquibase)
- Redis + async/scheduled scenario
- Testcontainers integration tests
- Full-stack docker compose (frontend + backend + postgres + redis)
- CI workflows

Use `stages.md` as the source of truth for remaining steps.

## Run Commands

### Frontend local

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya\frontend
npm.cmd install
npm.cmd run dev
```

### Frontend Docker

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya
docker compose build frontend
docker compose up -d
```

### Backend local

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya\backend
.\gradlew.bat bootRun
```

### Backend tests

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya\backend
.\gradlew.bat test
```

## Handoff Notes For Next Agent

1. Keep v0-like visual identity; do not revert to generic light admin styling.
2. Do not remove frontend API abstraction or flatten architecture.
3. Keep domain language consistent: Car / Tariff / Rental / Maintenance / Client.
4. Before adding new features, sync progress in `stages.md`.
5. Prioritize Stage 5 security tasks next.

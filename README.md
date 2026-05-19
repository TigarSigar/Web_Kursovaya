# CarGO — Car Rental System

CarGO is a coursework-style web system for car rental with two role-based areas:
- `CLIENT`: search, booking, rental tracking
- `FLEET_MANAGER`: fleet, tariffs, maintenance, rental processing

## Stack

- Frontend: Vue 3, TypeScript, Pinia, Vue Router, Vite
- Backend: Kotlin, Spring Boot, Spring Data JPA, Validation, PostgreSQL, SpringDoc OpenAPI

## Repository Structure

- `frontend/` — SPA application
- `backend/` — REST API
- `docker-compose.yml` — container entrypoint (currently frontend service)
- `stages.md` — implementation roadmap

## Prerequisites

- Node.js 20+
- npm 10+
- JDK 21
- PostgreSQL 14+

## Environment Variables

### Frontend (`frontend/.env`, optional)

| Variable | Default | Description |
| --- | --- | --- |
| `VITE_USE_MOCK_API` | `false` | Use mock data instead of backend API |
| `VITE_API_BASE_URL` | `/api/v1` | Backend API base path |

### Backend (`backend`, optional)

| Variable | Default | Description |
| --- | --- | --- |
| `SERVER_PORT` | `8081` | Backend HTTP port |
| `DB_URL` | `jdbc:postgresql://localhost:5432/car_rental` | PostgreSQL JDBC URL |
| `DB_USERNAME` | `postgres` | Database user |
| `DB_PASSWORD` | `postgres` | Database password |

## Local Run

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Frontend URL: `http://localhost:5173`

### Backend

```bash
cd backend
./gradlew bootRun
```

Backend URL: `http://localhost:8081`

Swagger UI: `http://localhost:8081/swagger-ui.html`

## Quality Commands

### Frontend

```bash
cd frontend
npm run typecheck
npm run lint
npm run format:check
npm run build
```

### Backend

```bash
cd backend
./gradlew spotlessCheck
./gradlew test
```

## Docker (Frontend)

```bash
docker compose build frontend
docker compose up -d
```

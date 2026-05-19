# SETUP.md

## Quick Start

Project root:

`C:\Users\Egor\Desktop\Web_Kursovaya`

## 1) Frontend (local dev)

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya\frontend
npm.cmd install
npm.cmd run dev
```

Frontend URL:

- `http://localhost:5173`

## 2) Frontend (Docker)

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya
docker compose build frontend
docker compose up -d
docker compose ps
```

Frontend URL:

- `http://localhost:8080`

Stop:

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya
docker compose down
```

## 3) Backend (local dev)

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya\backend
.\gradlew.bat bootRun
```

Backend default port:

- `http://localhost:8081`

Swagger UI:

- `http://localhost:8081/swagger-ui.html`

OpenAPI JSON:

- `http://localhost:8081/api-docs`

## 4) Backend tests

```powershell
cd C:\Users\Egor\Desktop\Web_Kursovaya\backend
.\gradlew.bat test
```

## Current API Surface

Cars:

- `GET /api/v1/cars`
- `GET /api/v1/cars/{id}`
- `POST /api/v1/cars`
- `PUT /api/v1/cars/{id}`
- `DELETE /api/v1/cars/{id}`
- `GET /api/v1/cars/available?from=YYYY-MM-DD&to=YYYY-MM-DD`

Tariffs:

- `GET /api/v1/tariffs`
- `GET /api/v1/tariffs/{id}`
- `POST /api/v1/tariffs`
- `PUT /api/v1/tariffs/{id}`
- `DELETE /api/v1/tariffs/{id}`

Maintenance windows:

- `GET /api/v1/maintenance-windows`
- `GET /api/v1/maintenance-windows/{id}`
- `POST /api/v1/maintenance-windows`
- `PUT /api/v1/maintenance-windows/{id}`
- `DELETE /api/v1/maintenance-windows/{id}`

Clients:

- `GET /api/v1/clients`
- `GET /api/v1/clients/{id}`
- `POST /api/v1/clients`
- `PUT /api/v1/clients/{id}`
- `DELETE /api/v1/clients/{id}`
- `GET /api/v1/clients/{id}/rentals`

Rentals:

- `POST /api/v1/rentals`
- `GET /api/v1/rentals/{id}`
- `PATCH /api/v1/rentals/{id}/issue`
- `PATCH /api/v1/rentals/{id}/complete`

## Notes

- Backend auth is not enabled yet (planned in Stage 5).
- Backend DB migrations are not enabled yet (planned in Stage 6).
- Full stack compose (frontend + backend + postgres + redis) is planned in Stage 9.

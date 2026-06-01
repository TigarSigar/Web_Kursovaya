# CarGO

CarGO, или "КарГО", — веб-приложение для управления автопарком и оформления аренды автомобилей по периодам.

Система позволяет клиентам искать доступные автомобили на заданные даты и оформлять заказы на аренду, а менеджерам автопарка (FLEET_MANAGER) управлять автомобилями, тарифами, окнами технического обслуживания и переводить заказы по этапам жизненного цикла.

## Стек

**Backend**: Kotlin, Spring Boot, Gradle, Spring Security, Spring Data JPA, PostgreSQL, Flyway, JWT, REST API, springdoc OpenAPI, Redis, Actuator, Testcontainers.

**Frontend**: Vue 3, TypeScript, Vite, Vue Router, Pinia, Tailwind CSS.

**Infrastructure**: Docker Compose, GitHub Actions.

## Роли

- `CLIENT` — клиент сервиса.
- `FLEET_MANAGER` — менеджер автопарка.

Один пользователь может иметь несколько ролей. После входа пользователь выбирает активную роль, если ролей больше одной. Frontend передает ее в заголовке `X-Active-Role`, backend обязан проверить, что эта роль действительно есть у пользователя.

## Модули backend

- `auth` — регистрация, вход, JWT, текущий пользователь.
- `user` — пользователи, роли, связи пользователь-роль.
- `car` — автомобили, их параметры и статусы.
- `tariff` — тарифные сетки (базовая стоимость, суточные цены, ограничения).
- `rental` — заказы на аренду и логика проверок непересекающихся интервалов.
- `maintenance` — окна технического обслуживания (MaintenanceWindow).
- `history` — история статусов заказов (RentalStatusHistory).
- `common` — обработка ошибок, глобальный валидатор и общие DTO.
- `config` — настройки Security, JWT, CORS и OpenAPI/Swagger.

## Документация

- `docs/coursework-compliance.md` — соответствие требованиям курсовой работы.
- `docs/Курсовая_v3.2.docx` — пояснительная записка (отчет) по курсовой работе.
- `docs/презентация_аренда_авто.pptx` — презентация для защиты курсовой работы.

## Локальный запуск

### Через Docker Compose

Полный стек приложения поднимается одной командой:

```bash
docker compose up --build
```

После запуска доступны:

- frontend: http://localhost:3000
- backend API: http://localhost:8080/api
- Swagger UI: http://localhost:8080/swagger-ui.html
- Actuator health: http://localhost:8080/actuator/health
- Actuator metrics: http://localhost:8080/actuator/metrics

Переменные окружения для Docker Compose находятся в `.env`. Пример заполнения хранится в `.env.example`.

### Локальный запуск backend

Для запуска backend из IDE или терминала нужны PostgreSQL и Redis:

```bash
docker compose up -d postgres redis
```

Backend использует переменные из `backend/.env`.

Команда запуска тестов:

```bash
cd backend
./gradlew test
```

Интеграционные тесты используют Testcontainers и не требуют локальной PostgreSQL.

### Локальный запуск frontend

```bash
cd frontend
npm install
npm run dev
```

Команда production-сборки:

```bash
cd frontend
npm run build
```

Frontend использует `frontend/.env`:

```env
VITE_API_BASE_URL=/api
```

## Инфраструктура

- PostgreSQL используется как основная база данных.
- Flyway автоматически применяет миграции при запуске backend.
- Redis используется для кэширования часто читаемых данных (например, списка активных тарифов).
- Spring Actuator открывает health/metrics эндпоинты.
- Docker Compose поднимает PostgreSQL, Redis, backend и frontend.
- GitHub Actions проверяет backend-тесты и frontend-сборку.

## Ключевые backend-сценарии

- Регистрация и вход пользователя через JWT.
- Выбор активной роли через заголовок `X-Active-Role`.
- Поиск свободных автомобилей на выбранные даты с транзакционной проверкой пересечений бронирований и окон обслуживания.
- Оформление заказа клиентом и расчет стоимости на основе выбранного тарифа.
- Управление жизненным циклом заказа менеджером (выдача, завершение) с ведением истории статусов.
- Планирование технического обслуживания автомобиля с блокировкой его бронирования.
- Кэширование списка активных тарифов через Redis.
- Автоматический перевод прошедших аренд в статус завершенных через `@Scheduled`.

## Проверка требований курсовой

Подробная таблица соответствия требованиям находится в:

- `docs/coursework-compliance.md`

## CI

В проекте настроены два workflow:

- `.github/workflows/backend.yml` запускает `./gradlew test`.
- `.github/workflows/frontend.yml` запускает `npm ci` и `npm run build`.
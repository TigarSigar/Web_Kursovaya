# Car Rental Frontend

Vue 3 + TypeScript frontend для курсовой работы по теме "Сервис аренды автомобилей".

## Что реализовано

- роли `CLIENT` и `FLEET_MANAGER`
- route guards и mock auth
- pages/components/store/api архитектура
- mock API с бизнес-правилами по арендам и обслуживанию
- клиентские сценарии поиска, создания аренды, просмотра списка и деталей
- manager-сценарии управления автопарком, тарифами, окнами обслуживания и статусами аренд

## Запуск

```bash
npm install
npm run dev
```

## Сборка

```bash
npm run build
```

## Замена mock API на backend

По умолчанию используется mock layer. Для переключения на реальный backend добавьте переменную:

```bash
VITE_USE_MOCK_API=false
```

И настройте:

```bash
VITE_API_BASE_URL=http://localhost:8080
```

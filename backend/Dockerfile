FROM eclipse-temurin:17-jdk-alpine AS build
WORKDIR /app

# Копируем Gradle Wrapper и файлы настроек для кэширования зависимостей
COPY gradlew .
COPY gradle gradle
COPY build.gradle.kts .
COPY settings.gradle.kts .

# Скачиваем зависимости (кешируемый шаг)
RUN chmod +x gradlew && ./gradlew --no-daemon dependencies || true

# Копируем исходники приложения
COPY src src

# Собираем JAR без тестов для ускорения билда
RUN ./gradlew bootJar --no-daemon -x test

FROM eclipse-temurin:17-jre-alpine AS runtime
WORKDIR /app

# Копируем fat JAR из этапа сборки
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8081

# Запуск с профилем docker
ENTRYPOINT ["java", "-Dspring.profiles.active=docker", "-jar", "app.jar"]

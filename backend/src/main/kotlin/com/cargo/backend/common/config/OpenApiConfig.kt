package com.cargo.backend.common.config

import io.swagger.v3.oas.models.OpenAPI
import io.swagger.v3.oas.models.info.Info
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration

@Configuration
class OpenApiConfig {

    @Bean
    fun openApi(): OpenAPI =
        OpenAPI().info(
            Info()
                .title("Car Rental Service API")
                .version("v1")
                .description("REST API for car rental operations")
        )
}

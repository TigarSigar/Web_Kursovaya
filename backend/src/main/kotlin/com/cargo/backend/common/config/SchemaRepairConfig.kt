package com.cargo.backend.common.config

import org.slf4j.LoggerFactory
import org.springframework.boot.ApplicationRunner
import org.springframework.context.annotation.Bean
import org.springframework.context.annotation.Configuration
import org.springframework.context.annotation.Profile
import org.springframework.jdbc.core.JdbcTemplate
import javax.sql.DataSource

@Configuration
class SchemaRepairConfig {

    @Bean
    @Profile("!test")
    fun repairCarsImageUrlsColumn(
        dataSource: DataSource,
        jdbcTemplate: JdbcTemplate
    ) = ApplicationRunner {
        val productName = dataSource.connection.use { connection ->
            connection.metaData.databaseProductName
        }

        if (!productName.contains("PostgreSQL", ignoreCase = true)) {
            return@ApplicationRunner
        }

        val columnInfo = jdbcTemplate.queryForList(
            """
            select data_type, character_maximum_length
            from information_schema.columns
            where table_schema = current_schema()
              and table_name = 'cars'
              and column_name = 'image_urls'
            """.trimIndent()
        )

        val currentColumn = columnInfo.firstOrNull() ?: return@ApplicationRunner
        val dataType = currentColumn["data_type"]?.toString().orEmpty()
        val maxLength = (currentColumn["character_maximum_length"] as? Number)?.toInt()

        if (dataType.equals("text", ignoreCase = true) || (dataType.equals("character varying", ignoreCase = true) && maxLength == null)) {
            return@ApplicationRunner
        }

        jdbcTemplate.execute("alter table cars alter column image_urls type text")
        logger.info("Updated cars.image_urls column to TEXT to support multiple uploaded images.")
    }

    companion object {
        private val logger = LoggerFactory.getLogger(SchemaRepairConfig::class.java)
    }
}

package com.cargo.backend.common.error

import jakarta.servlet.http.HttpServletRequest
import org.springframework.http.HttpStatus
import org.springframework.http.ResponseEntity
import org.springframework.validation.FieldError
import org.springframework.web.bind.MethodArgumentNotValidException
import org.springframework.web.bind.annotation.ExceptionHandler
import org.springframework.web.bind.annotation.RestControllerAdvice

@RestControllerAdvice
class GlobalExceptionHandler {
    @ExceptionHandler(MethodArgumentNotValidException::class)
    fun handleValidation(
        exception: MethodArgumentNotValidException,
        request: HttpServletRequest,
    ): ResponseEntity<ApiErrorResponse> {
        val details =
            exception.bindingResult
                .allErrors
                .filterIsInstance<FieldError>()
                .associate { it.field to (it.defaultMessage ?: "Invalid value") }

        val body =
            ApiErrorResponse(
                status = HttpStatus.BAD_REQUEST.value(),
                code = ErrorCode.VALIDATION_ERROR,
                message = "Validation failed",
                path = request.requestURI,
                details = details,
            )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(ResourceNotFoundException::class)
    fun handleNotFound(
        exception: ResourceNotFoundException,
        request: HttpServletRequest,
    ): ResponseEntity<ApiErrorResponse> {
        val body =
            ApiErrorResponse(
                status = HttpStatus.NOT_FOUND.value(),
                code = ErrorCode.RESOURCE_NOT_FOUND,
                message = exception.message ?: "Resource not found",
                path = request.requestURI,
            )
        return ResponseEntity.status(HttpStatus.NOT_FOUND).body(body)
    }

    @ExceptionHandler(ConflictException::class)
    fun handleConflict(
        exception: ConflictException,
        request: HttpServletRequest,
    ): ResponseEntity<ApiErrorResponse> {
        val body =
            ApiErrorResponse(
                status = HttpStatus.CONFLICT.value(),
                code = ErrorCode.CONFLICT,
                message = exception.message ?: "Conflict",
                path = request.requestURI,
            )
        return ResponseEntity.status(HttpStatus.CONFLICT).body(body)
    }

    @ExceptionHandler(IllegalArgumentException::class)
    fun handleIllegalArgument(
        exception: IllegalArgumentException,
        request: HttpServletRequest,
    ): ResponseEntity<ApiErrorResponse> {
        val body =
            ApiErrorResponse(
                status = HttpStatus.BAD_REQUEST.value(),
                code = ErrorCode.VALIDATION_ERROR,
                message = exception.message ?: "Invalid argument",
                path = request.requestURI,
            )
        return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(body)
    }

    @ExceptionHandler(Exception::class)
    fun handleUnexpected(
        exception: Exception,
        request: HttpServletRequest,
    ): ResponseEntity<ApiErrorResponse> {
        val body =
            ApiErrorResponse(
                status = HttpStatus.INTERNAL_SERVER_ERROR.value(),
                code = ErrorCode.INTERNAL_ERROR,
                message = exception.message ?: "Unexpected error",
                path = request.requestURI,
            )
        return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body(body)
    }
}

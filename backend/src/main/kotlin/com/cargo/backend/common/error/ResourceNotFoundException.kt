package com.cargo.backend.common.error

class ResourceNotFoundException(
    message: String,
) : RuntimeException(message)

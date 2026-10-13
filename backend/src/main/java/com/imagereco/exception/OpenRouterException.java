package com.imagereco.exception;

public class OpenRouterException extends RuntimeException {
    private final int statusCode;

    public OpenRouterException(String message) {
        super(message);
        this.statusCode = 500;
    }

    public OpenRouterException(String message, int statusCode) {
        super(message);
        this.statusCode = statusCode;
    }

    public OpenRouterException(String message, Throwable cause) {
        super(message, cause);
        this.statusCode = 500;
    }

    public int getStatusCode() {
        return statusCode;
    }
}

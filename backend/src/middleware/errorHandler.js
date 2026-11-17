/**
 * Global Centralized Express Error-Handling Middleware
 */
const errorHandler = (err, req, res, next) => {
    let statusCode = res.statusCode && res.statusCode !== 200 ? res.statusCode : 500;
    let message = err.message || "Internal Server Error";

    // 1. Mongoose Bad ObjectId (CastError)
    if (err.name === "CastError") {
        statusCode = 400;
        message = `Resource not found with invalid ID: ${err.value}`;
    }

    // 2. Mongoose Duplicate Key Error (code 11000)
    else if (err.code === 11000) {
        statusCode = 400;
        const field = Object.keys(err.keyValue || {})[0] || "field";
        message = `Duplicate value entered for ${field}. Please use another value.`;
    }

    // 3. Mongoose Validation Error
    else if (err.name === "ValidationError") {
        statusCode = 400;
        const messages = Object.values(err.errors || {}).map((e) => e.message);
        message = messages.join(", ") || "Validation failed";
    }

    // 4. JWT Authentication Errors
    else if (err.name === "JsonWebTokenError") {
        statusCode = 401;
        message = "Invalid authentication token";
    } else if (err.name === "TokenExpiredError") {
        statusCode = 401;
        message = "Authentication token expired. Please login again.";
    }

    const response = {
        success: false,
        message
    };

    // Include stack trace only in development, never in production or tests
    if (process.env.NODE_ENV === "development") {
        response.stack = err.stack;
    }

    res.status(statusCode).json(response);
};

module.exports = errorHandler;

/**
 * Centralized 404 Handler for Undefined API Routes
 */
const notFoundHandler = (req, res, next) => {
    res.status(404).json({
        success: false,
        message: `Route ${req.method} ${req.originalUrl} not found`
    });
};

module.exports = notFoundHandler;

const superadminMiddleware = (req, res, next) => {
    if (!req.user || req.user.role !== "superadmin") {
        return res.status(403).json({
            success: false,
            message: "Access denied. Super Admin privileges required."
        });
    }

    next();
};

module.exports = superadminMiddleware;

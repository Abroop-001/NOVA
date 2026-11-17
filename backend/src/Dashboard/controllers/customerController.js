const User = require("../../Auth/models/authModel");

// GET /api/dashboard/customers
const getRegisteredCustomers = async (req, res) => {
    try {
        const { search, page = 1, limit = 10 } = req.query;

        const filter = {
            role: "customer"
        };

        if (search && search.trim()) {
            const regex = new RegExp(search.trim(), "i");
            filter.$or = [
                { username: regex },
                { email: regex },
                { phone: regex }
            ];
        }

        const currentPage = Math.max(1, parseInt(page, 10) || 1);
        const perPage = Math.min(100, Math.max(1, parseInt(limit, 10) || 10));
        const skip = (currentPage - 1) * perPage;

        const totalCustomers = await User.countDocuments(filter);

        const customers = await User.find(filter)
            .select("-password")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(perPage);

        res.status(200).json({
            success: true,
            totalCustomers,
            currentPage,
            totalPages: Math.ceil(totalCustomers / perPage),
            customers: customers.map((c) => ({
                id: c._id,
                _id: c._id,
                username: c.username,
                email: c.email,
                phone: c.phone || "N/A",
                role: c.role,
                isEmailVerified: c.isEmailVerified,
                createdAt: c.createdAt
            }))
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};

module.exports = {
    getRegisteredCustomers
};

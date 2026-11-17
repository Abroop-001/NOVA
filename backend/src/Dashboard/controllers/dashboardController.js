const Product = require("../../Product/models/productModel");
const User = require("../../Auth/models/authModel");
const Order = require("../../Order/models/orderModel");
const { getRevenueOrderFilter, MONTH_NAMES } = require("../utils/dashboardUtils");

// GET /api/dashboard/stats - Overview metrics from real MongoDB collections
const getDashboardStats = async (req, res) => {
    try {
        const totalProducts = await Product.countDocuments();
        const totalCustomers = await User.countDocuments({
            role: { $nin: ["admin", "superadmin"] }
        });

        // Non-failed orders count
        const totalOrders = await Order.countDocuments({
            paymentStatus: { $ne: "FAILED" }
        });

        const pendingOrders = await Order.countDocuments({
            status: "Processing",
            paymentStatus: { $ne: "FAILED" }
        });

        const deliveredOrders = await Order.countDocuments({
            status: "Delivered"
        });

        const cancelledOrders = await Order.countDocuments({
            status: "Cancelled"
        });

        // Total lifetime revenue from legitimate orders
        const revenueResult = await Order.aggregate([
            { $match: getRevenueOrderFilter() },
            { $group: { _id: null, totalRevenue: { $sum: "$totalAmount" } } }
        ]);
        const totalRevenue = revenueResult.length > 0 ? revenueResult[0].totalRevenue : 0;

        // Current Month vs Last Month comparison for dynamic trend badge
        const now = new Date();
        const startCurrentMonth = new Date(now.getFullYear(), now.getMonth(), 1);
        const startLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1);
        const endLastMonth = new Date(now.getFullYear(), now.getMonth(), 0, 23, 59, 59, 999);

        const [currMonthRes, lastMonthRes] = await Promise.all([
            Order.aggregate([
                { $match: getRevenueOrderFilter({ createdAt: { $gte: startCurrentMonth } }) },
                { $group: { _id: null, rev: { $sum: "$totalAmount" } } }
            ]),
            Order.aggregate([
                { $match: getRevenueOrderFilter({ createdAt: { $gte: startLastMonth, $lte: endLastMonth } }) },
                { $group: { _id: null, rev: { $sum: "$totalAmount" } } }
            ])
        ]);

        const currentMonthRevenue = currMonthRes[0]?.rev || 0;
        const lastMonthRevenue = lastMonthRes[0]?.rev || 0;
        let revenueTrendPercent = 0;
        if (lastMonthRevenue > 0) {
            revenueTrendPercent = Math.round(((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue) * 100);
        } else if (currentMonthRevenue > 0) {
            revenueTrendPercent = 100;
        }

        res.status(200).json({
            success: true,
            stats: {
                totalProducts,
                totalCustomers,
                totalOrders,
                totalRevenue,
                pendingOrders,
                deliveredOrders,
                cancelledOrders,
                currentMonthRevenue,
                revenueTrendPercent
            }
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/dashboard/recent-orders - Latest 5 active orders
const getRecentOrders = async (req, res) => {
    try {
        const rawOrders = await Order.find({ paymentStatus: { $ne: "FAILED" } })
            .populate("user", "username email")
            .sort({ createdAt: -1 })
            .limit(5)
            .select("_id orderNumber user totalAmount status paymentMethod paymentStatus createdAt deliveryAddress");

        const orders = rawOrders.map((order) => {
            const o = order.toObject ? order.toObject() : { ...order };
            return {
                _id: o._id,
                orderNumber: o.orderNumber || `NOVA-${String(o._id).slice(-6).toUpperCase()}`,
                user: {
                    username: o.user?.username || o.deliveryAddress?.fullName || "Customer",
                    email: o.user?.email || "N/A"
                },
                totalAmount: o.totalAmount || 0,
                status: o.status || "Processing",
                paymentMethod: o.paymentMethod || "COD",
                paymentStatus: o.paymentStatus || "PENDING",
                createdAt: o.createdAt
            };
        });

        res.status(200).json({ success: true, orders });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/dashboard/sales-overview - Annual monthly sales overview
const getSalesOverview = async (req, res) => {
    try {
        const currentYear = parseInt(req.query.year, 10) || new Date().getFullYear();

        const salesData = await Order.aggregate([
            {
                $match: getRevenueOrderFilter({
                    createdAt: {
                        $gte: new Date(currentYear, 0, 1),
                        $lt: new Date(currentYear + 1, 0, 1)
                    }
                })
            },
            {
                $group: {
                    _id: { $month: "$createdAt" },
                    totalRevenue: { $sum: "$totalAmount" },
                    ordersCount: { $sum: 1 }
                }
            }
        ]);

        const monthlySales = MONTH_NAMES.map((month, index) => {
            const found = salesData.find((item) => item._id === index + 1);
            return {
                month,
                label: month.slice(0, 3),
                totalRevenue: found ? found.totalRevenue : 0,
                ordersCount: found ? found.ordersCount : 0
            };
        });

        res.status(200).json({
            success: true,
            year: currentYear,
            monthlySales,
            salesData: monthlySales
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getDashboardStats,
    getRecentOrders,
    getSalesOverview
};

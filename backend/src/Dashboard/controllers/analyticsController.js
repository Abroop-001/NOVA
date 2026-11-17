const Order = require("../../Order/models/orderModel");
const { getRevenueOrderFilter, parseDateRange, MONTH_NAMES, formatDateLabel } = require("../utils/dashboardUtils");

// GET /api/dashboard/sales-analytics - Flexible timeline (daily, weekly, monthly, yearly, custom)
const getSalesAnalytics = async (req, res) => {
    try {
        const period = req.query.period || "monthly";
        const { start, end } = parseDateRange(req.query);
        const match = getRevenueOrderFilter({ createdAt: { $gte: start, $lte: end } });
        let timeline = [];

        if (period === "daily" || period === "7d" || period === "30d") {
            const raw = await Order.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { $dateToString: { format: "%Y-%m-%d", date: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                        ordersCount: { $sum: 1 },
                        unitsSold: { $sum: { $sum: "$items.quantity" } }
                    }
                }
            ]);
            const map = new Map(raw.map((r) => [r._id, r]));
            const curr = new Date(start);
            while (curr <= end) {
                const key = curr.toISOString().slice(0, 10);
                const found = map.get(key);
                timeline.push({
                    date: key,
                    label: formatDateLabel(curr),
                    totalRevenue: found ? found.revenue : 0,
                    ordersCount: found ? found.ordersCount : 0,
                    unitsSold: found ? found.unitsSold : 0
                });
                curr.setDate(curr.getDate() + 1);
            }
        } else if (period === "weekly" || period === "12w") {
            const raw = await Order.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { year: { $isoWeekYear: "$createdAt" }, week: { $isoWeek: "$createdAt" } },
                        revenue: { $sum: "$totalAmount" },
                        ordersCount: { $sum: 1 },
                        unitsSold: { $sum: { $sum: "$items.quantity" } }
                    }
                },
                { $sort: { "_id.year": 1, "_id.week": 1 } }
            ]);
            timeline = raw.map((r) => ({
                label: `W${r._id.week}`,
                week: r._id.week,
                totalRevenue: r.revenue,
                ordersCount: r.ordersCount,
                unitsSold: r.unitsSold
            }));
        } else {
            const raw = await Order.aggregate([
                { $match: match },
                {
                    $group: {
                        _id: { $month: "$createdAt" },
                        revenue: { $sum: "$totalAmount" },
                        ordersCount: { $sum: 1 },
                        unitsSold: { $sum: { $sum: "$items.quantity" } }
                    }
                }
            ]);
            timeline = MONTH_NAMES.map((m, idx) => {
                const found = raw.find((r) => r._id === idx + 1);
                return {
                    month: m,
                    label: m.slice(0, 3),
                    totalRevenue: found ? found.revenue : 0,
                    ordersCount: found ? found.ordersCount : 0,
                    unitsSold: found ? found.unitsSold : 0
                };
            });
        }

        const totalRevenue = timeline.reduce((acc, t) => acc + (t.totalRevenue || 0), 0);
        const totalOrders = timeline.reduce((acc, t) => acc + (t.ordersCount || 0), 0);
        const totalUnits = timeline.reduce((acc, t) => acc + (t.unitsSold || 0), 0);
        const averageOrderValue = totalOrders > 0 ? Math.round(totalRevenue / totalOrders) : 0;

        res.status(200).json({
            success: true,
            period,
            dateRange: { start, end },
            summary: { totalRevenue, totalOrders, totalUnits, averageOrderValue },
            timeline
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/dashboard/best-sellers
const getBestSellingProducts = async (req, res) => {
    try {
        const limit = Math.min(50, Math.max(1, parseInt(req.query.limit, 10) || 5));
        const bestSellers = await Order.aggregate([
            { $match: getRevenueOrderFilter() },
            { $unwind: "$items" },
            {
                $group: {
                    _id: "$items.product",
                    name: { $first: "$items.name" },
                    image: { $first: "$items.image" },
                    unitsSold: { $sum: "$items.quantity" },
                    revenue: { $sum: { $multiply: ["$items.price", "$items.quantity"] } }
                }
            },
            {
                $lookup: { from: "products", localField: "_id", foreignField: "_id", as: "productDoc" }
            },
            {
                $project: {
                    _id: 1, productId: "$_id", name: 1, image: 1,
                    brand: { $ifNull: [{ $arrayElemAt: ["$productDoc.brand", 0] }, "NOVA"] },
                    category: { $ifNull: [{ $arrayElemAt: ["$productDoc.category", 0] }, "General"] },
                    unitsSold: 1, revenue: 1
                }
            },
            { $sort: { unitsSold: -1, revenue: -1 } },
            { $limit: limit }
        ]);
        res.status(200).json({ success: true, count: bestSellers.length, bestSellers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// GET /api/dashboard/brand-sales
const getBrandWiseSales = async (req, res) => {
    try {
        const aggregatedSales = await Order.aggregate([
            { $match: getRevenueOrderFilter() },
            { $unwind: "$items" },
            {
                $lookup: { from: "products", localField: "items.product", foreignField: "_id", as: "productDoc" }
            },
            {
                $project: {
                    brand: { $ifNull: [{ $arrayElemAt: ["$productDoc.brand", 0] }, "Other"] },
                    quantity: "$items.quantity",
                    revenue: { $multiply: ["$items.price", "$items.quantity"] }
                }
            },
            {
                $group: { _id: "$brand", unitsSold: { $sum: "$quantity" }, totalRevenue: { $sum: "$revenue" } }
            }
        ]);

        const targetBrands = ["Nike", "Adidas", "Puma"];
        const brandSales = targetBrands.map((brandName) => {
            const found = aggregatedSales.find((item) => String(item._id).toLowerCase() === brandName.toLowerCase());
            return {
                brand: brandName,
                unitsSold: found ? found.unitsSold : 0,
                revenue: found ? found.totalRevenue : 0
            };
        });
        res.status(200).json({ success: true, brandSales });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = {
    getSalesAnalytics,
    getBestSellingProducts,
    getBrandWiseSales
};

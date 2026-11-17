/**
 * Dashboard & Analytics Shared Utilities
 * Enforces consistent revenue matching and date range handling across NOVA Admin.
 */

// Filter matching legitimate revenue-generating orders (COD active lifecycle & successfully paid Razorpay)
const getRevenueOrderFilter = (extra = {}) => ({
    status: { $ne: "Cancelled" },
    paymentStatus: { $nin: ["FAILED", "REFUNDED"] },
    $or: [
        { paymentMethod: { $in: ["RAZORPAY", "Online"] }, paymentStatus: "PAID" },
        { paymentMethod: "COD" },
        { paymentMethod: { $exists: false } },
        { paymentMethod: null }
    ],
    ...extra
});

// Month names list
const MONTH_NAMES = [
    "January", "February", "March", "April",
    "May", "June", "July", "August",
    "September", "October", "November", "December"
];

// Parse date range with presets (daily/7d, 30d, weekly/12w, monthly, yearly, custom)
const parseDateRange = (query = {}) => {
    const { startDate, endDate, period } = query;
    const now = new Date();
    let start;
    let end = new Date(now);

    if (startDate) {
        start = new Date(startDate);
        if (endDate) {
            end = new Date(endDate);
            if (endDate.length <= 10) end.setHours(23, 59, 59, 999);
        }
    } else if (period === "daily" || period === "7d") {
        start = new Date(now);
        start.setDate(now.getDate() - 6);
        start.setHours(0, 0, 0, 0);
    } else if (period === "30d") {
        start = new Date(now);
        start.setDate(now.getDate() - 29);
        start.setHours(0, 0, 0, 0);
    } else if (period === "weekly" || period === "12w") {
        start = new Date(now);
        start.setDate(now.getDate() - 83); // ~12 weeks
        start.setHours(0, 0, 0, 0);
    } else if (period === "yearly") {
        start = new Date(now.getFullYear() - 4, 0, 1);
        end = new Date(now.getFullYear(), 11, 31, 23, 59, 59, 999);
    } else {
        const year = parseInt(query.year, 10) || now.getFullYear();
        start = new Date(year, 0, 1);
        end = new Date(year, 11, 31, 23, 59, 59, 999);
    }

    return { start, end };
};

const formatDateLabel = (d) => {
    const days = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
    const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
    return `${days[d.getDay()]}, ${d.getDate()} ${months[d.getMonth()]}`;
};

module.exports = {
    getRevenueOrderFilter,
    MONTH_NAMES,
    parseDateRange,
    formatDateLabel
};

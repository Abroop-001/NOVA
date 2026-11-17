const { placeOrder } = require("./placeOrderController");
const { getMyOrders, getOrderDetails, getAllOrders } = require("./orderQueryController");
const { updateOrderStatus } = require("./orderStatusController");
const { cancelOrder } = require("./cancelOrderController");
const { createRazorpayOrder } = require("./razorpayOrderController");
const { verifyRazorpayPayment } = require("./razorpayVerifyController");
const { razorpayWebhook } = require("./razorpayWebhookController");

module.exports = {
    placeOrder,
    getMyOrders,
    getOrderDetails,
    getAllOrders,
    updateOrderStatus,
    cancelOrder,
    createRazorpayOrder,
    verifyRazorpayPayment,
    razorpayWebhook
};

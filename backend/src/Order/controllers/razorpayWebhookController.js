const crypto = require("crypto");
const Order = require("../models/orderModel");

/**
 * Handle incoming Razorpay webhook events (payment.captured, payment.failed)
 */
const razorpayWebhook = async (req, res) => {
    try {
        const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;
        const webhookSignature = req.headers["x-razorpay-signature"];

        if (!webhookSecret) {
            console.warn("Razorpay Webhook Notice: RAZORPAY_WEBHOOK_SECRET is not configured");
            return res.status(200).json({ status: "ignored_no_secret" });
        }

        if (!webhookSignature) {
            return res.status(400).json({ success: false, message: "Missing webhook signature" });
        }

        // Validate webhook signature using raw body or JSON string
        const bodyPayload = req.rawBody ? req.rawBody.toString() : JSON.stringify(req.body);
        const expectedSignature = crypto
            .createHmac("sha256", webhookSecret)
            .update(bodyPayload)
            .digest("hex");

        if (expectedSignature !== webhookSignature) {
            return res.status(400).json({ success: false, message: "Invalid webhook signature" });
        }

        const event = req.body.event;
        const payment = req.body.payload?.payment?.entity;

        if (!payment) {
            return res.status(200).json({ status: "ignored_no_payment_entity" });
        }

        const razorpayOrderId = payment.order_id;
        const razorpayPaymentId = payment.id;

        if (event === "payment.captured") {
            const order = await Order.findOne({
                $or: [{ razorpayOrderId }, { razorpayPaymentId }]
            });

            if (order && order.paymentStatus !== "PAID") {
                order.paymentStatus = "PAID";
                order.razorpayPaymentId = razorpayPaymentId;
                order.paymentDetails = payment;
                await order.save();
                console.log(`Webhook: Order ${order.orderNumber} marked as PAID via payment.captured`);
            }
        } else if (event === "payment.failed") {
            const order = await Order.findOne({
                $or: [{ razorpayOrderId }, { razorpayPaymentId }]
            });

            if (order && order.paymentStatus !== "PAID") {
                order.paymentStatus = "FAILED";
                order.paymentDetails = payment;
                await order.save();
                console.log(`Webhook: Order ${order.orderNumber} marked as FAILED via payment.failed`);
            }
        }

        return res.status(200).json({ status: "ok" });

    } catch (error) {
        console.error("Razorpay Webhook Error:", error);
        return res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { razorpayWebhook };

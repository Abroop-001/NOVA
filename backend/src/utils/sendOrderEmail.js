const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS
    }
});

// Order Confirmation Email
const sendOrderConfirmation = async (email, order) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: "NOVA - Order Confirmed",
        text: `
Thank you for shopping with NOVA!

Your order has been placed successfully.

Order Number: ${order.orderNumber}
Total Amount: ₹${order.totalAmount}
Payment Method: ${order.paymentMethod}

We'll notify you when your order status changes.

Thank you,
Team NOVA
        `
    });
};

// Order Status Update Email
const sendOrderStatusUpdate = async (email, order) => {
    await transporter.sendMail({
        from: process.env.EMAIL_USER,
        to: email,
        subject: `NOVA - Order ${order.status}`,
        text: `
Hello!

Your NOVA order status has been updated.

Order Number: ${order.orderNumber}
New Status: ${order.status}

Thank you for shopping with NOVA.
Team NOVA
        `
    });
};

module.exports = {
    sendOrderConfirmation,
    sendOrderStatusUpdate
};
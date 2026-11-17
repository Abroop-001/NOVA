const mongoose = require("mongoose");

const productSchema = new mongoose.Schema({


name: { type: String, required: true, trim: true},

brand: { type: String, required: true, enum: ["Nike", "Adidas", "Puma"]},

description: {  type: String, required: true},

price: { type: Number, required: true},

discountPrice: { type: Number, default: null},

images: [{ type: String, required: true}],

sizes: [{ type: Number,  required: true}],

colors: [{type: String}],

stock: { type: Number,required: true, default: 0},

category: { type: String, required: true},

isFeatured: { type: Boolean, default: false}

}, {
timestamps: true
});

const Product = mongoose.model("Product", productSchema);

module.exports = Product;

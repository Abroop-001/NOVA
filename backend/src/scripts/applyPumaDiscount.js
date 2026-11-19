const dns = require("node:dns");
dns.setServers(["8.8.8.8", "1.1.1.1"]);

const mongoose = require("mongoose");
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../../.env") });

const Product = require("../Product/models/productModel");

async function applyPumaDiscount() {
  try {
    const mongoUri = process.env.MONGO_URI;
    if (!mongoUri) {
      throw new Error("MONGO_URI is missing from environment");
    }

    console.log("Connecting to MongoDB...");
    await mongoose.connect(mongoUri);
    console.log("Connected successfully to MongoDB.");

    // Fetch only Puma products
    const pumaProducts = await Product.find({ brand: "Puma" });
    console.log(`Found ${pumaProducts.length} Puma products in database.`);

    const updates = [];

    for (const product of pumaProducts) {
      // 50% discount strictly derived from the original price
      const originalPrice = product.price;
      const newDiscountPrice = Math.round(originalPrice * 0.5);

      product.discountPrice = newDiscountPrice;
      await product.save();

      updates.push({
        id: product._id,
        name: product.name,
        brand: product.brand,
        originalPrice,
        newDiscountPrice,
        discountPercent: `${Math.round(((originalPrice - newDiscountPrice) / originalPrice) * 100)}%`
      });
    }

    console.log("Puma products updated with 50% discount:");
    console.table(updates);

    // Verify non-Puma products were not touched
    const nonPumaCount = await Product.countDocuments({ brand: { $ne: "Puma" } });
    console.log(`Verified: ${nonPumaCount} non-Puma products remain untouched.`);

    await mongoose.disconnect();
    console.log("Disconnected from MongoDB. Migration complete.");
  } catch (error) {
    console.error("Failed to apply Puma discount:", error);
    process.exit(1);
  }
}

applyPumaDiscount();

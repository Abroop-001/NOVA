const express = require("express");
const router = express.Router();

const {
addProduct,
getAllProducts,
getSingleProduct,
updateProduct,
deleteProduct,
uploadImages} = require("../controllers/productController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");
const adminMiddleware = require("../../Auth/middleware/adminMiddleware");
const upload = require("../../config/multer");

// Upload product images (Admin only)
router.post("/upload", authMiddleware, adminMiddleware, upload.array("images", 5), uploadImages);

// Add product (Admin only)
router.post("/add", authMiddleware, adminMiddleware, addProduct);

// Get all products (Everyone)
router.get("/", getAllProducts);

// Get single product (Everyone)
router.get("/:id", getSingleProduct);

// Update product (Admin only)
router.put("/:id", authMiddleware, adminMiddleware, updateProduct);

// Delete product (Admin only)
router.delete("/:id", authMiddleware, adminMiddleware, deleteProduct);

module.exports = router;

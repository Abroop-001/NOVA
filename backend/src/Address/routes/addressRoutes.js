const express = require("express");
const router = express.Router();

const {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
} = require("../controllers/addressController");

const authMiddleware = require("../../Auth/middleware/authMiddleware");

// Add new address
router.post("/add", authMiddleware, addAddress);

// Get all saved addresses
router.get("/", authMiddleware, getAddresses);

// Update address
router.put("/update/:addressId", authMiddleware, updateAddress);

// Delete address
router.delete("/delete/:addressId", authMiddleware, deleteAddress);

// Set default address
router.put("/default/:addressId", authMiddleware, setDefaultAddress);

module.exports = router;

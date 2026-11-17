const Address = require("../models/addressModel");

// Add new address
const addAddress = async (req, res) => {
    try {
        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country } = req.body;

        const addressCount = await Address.countDocuments({ user: req.user._id });

        const address = await Address.create({
            user: req.user._id,
            fullName,
            phone,
            addressLine1,
            addressLine2,
            city,
            state,
            pincode,
            country,
            isDefault: addressCount === 0
        });

        res.status(201).json({
            success: true,
            message: "Address added successfully",
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get all addresses
const getAddresses = async (req, res) => {
    try {
        const addresses = await Address.find({
            user: req.user._id
        }).sort({ isDefault: -1, createdAt: -1 });

        res.status(200).json({
            success: true,
            addresses
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update address
const updateAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        const { fullName, phone, addressLine1, addressLine2, city, state, pincode, country } = req.body;

        address.fullName = fullName || address.fullName;
        address.phone = phone || address.phone;
        address.addressLine1 = addressLine1 || address.addressLine1;
        address.addressLine2 = addressLine2 !== undefined ? addressLine2 : address.addressLine2;
        address.city = city || address.city;
        address.state = state || address.state;
        address.pincode = pincode || address.pincode;
        address.country = country || address.country;

        await address.save();

        res.status(200).json({
            success: true,
            message: "Address updated successfully",
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete address
const deleteAddress = async (req, res) => {
    try {
        const address = await Address.findOneAndDelete({
            _id: req.params.addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        if (address.isDefault) {
            const nextAddress = await Address.findOne({ user: req.user._id });
            if (nextAddress) {
                nextAddress.isDefault = true;
                await nextAddress.save();
            }
        }

        res.status(200).json({
            success: true,
            message: "Address deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Set default address
const setDefaultAddress = async (req, res) => {
    try {
        const address = await Address.findOne({
            _id: req.params.addressId,
            user: req.user._id
        });

        if (!address) {
            return res.status(404).json({
                success: false,
                message: "Address not found"
            });
        }

        await Address.updateMany(
            { user: req.user._id },
            { isDefault: false }
        );

        address.isDefault = true;

        await address.save();

        res.status(200).json({
            success: true,
            message: "Default address updated",
            address
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addAddress,
    getAddresses,
    updateAddress,
    deleteAddress,
    setDefaultAddress
};

const Wishlist = require("../models/wishlistModel");
const Product = require("../../Product/models/productModel");

// Add product to wishlist
const addToWishlist = async (req, res) => {
    try {
        const { productId } = req.body;

        const product = await Product.findById(productId);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        let wishlist = await Wishlist.findOne({ user: req.user._id });

        if (!wishlist) {
            wishlist = await Wishlist.create({
                user: req.user._id,
                products: []
            });
        }

        const alreadyExists = wishlist.products.some(
            id => id.toString() === productId
        );

        if (alreadyExists) {
            return res.status(400).json({
                success: false,
                message: "Product already in wishlist"
            });
        }

        wishlist.products.push(productId);

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Product added to wishlist",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get user's wishlist
const getWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        }).populate("products");

        const normalizedWishlist = wishlist || {
            user: req.user._id,
            products: []
        };

        res.status(200).json({
            success: true,
            wishlist: normalizedWishlist,
            products: normalizedWishlist.products || []
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Remove product from wishlist
const removeFromWishlist = async (req, res) => {
    try {
        const wishlist = await Wishlist.findOne({
            user: req.user._id
        });

        if (!wishlist) {
            return res.status(404).json({
                success: false,
                message: "Wishlist not found"
            });
        }

        const productIndex = wishlist.products.findIndex(
            id => id.toString() === req.params.productId
        );

        if (productIndex === -1) {
            return res.status(404).json({
                success: false,
                message: "Product not found in wishlist"
            });
        }

        wishlist.products.splice(productIndex, 1);

        await wishlist.save();

        res.status(200).json({
            success: true,
            message: "Product removed from wishlist",
            wishlist
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    addToWishlist,
    getWishlist,
    removeFromWishlist
};

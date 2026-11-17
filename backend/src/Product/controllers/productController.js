const Product = require("../models/productModel");
const cloudinary = require("../../config/cloudinary");


// Upload product images
const uploadImages = async (req, res) => {
    try {
        if (!req.files || req.files.length === 0) {
            return res.status(400).json({
                success: false,
                message: "Please upload at least one image"
            });
        }

        const uploadPromises = req.files.map((file) => {
            return new Promise((resolve, reject) => {
                const stream = cloudinary.uploader.upload_stream(
                    { folder: "nova-products" },
                    (error, result) => {
                        if (error) reject(error);
                        else resolve(result.secure_url);
                    }
                );
                stream.end(file.buffer);
            });
        });

        const imageUrls = await Promise.all(uploadPromises);

        res.status(200).json({
            success: true,
            message: "Images uploaded successfully",
            imageUrls
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Add Product
const addProduct = async (req, res) => {
    try {
        const product = await Product.create(req.body);

        res.status(201).json({
            success: true,
            message: "Product added successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get All Products
const getAllProducts = async (req, res) => {
    try {
        const {
            search,
            brand,
            category,
            minPrice,
            maxPrice,
            size,
            isFeatured,
            sort,
            page,
            limit
        } = req.query;

        const filter = {};

        // Search by name
        if (search) {
            filter.name = { $regex: search, $options: "i" };
        }

        // Filter by brand
        if (brand) {
            filter.brand = brand;
        }

        // Filter by category
        if (category) {
            filter.category = category;
        }

        // Filter by available size
        if (size) {
            filter.sizes = Number(size);
        }

        // Filter by featured status
        if (isFeatured !== undefined) {
            filter.isFeatured = isFeatured === "true" || isFeatured === true;
        }

        // Filter by actual selling price
        if (minPrice || maxPrice) {
            const min = minPrice ? Number(minPrice) : 0;
            const max = maxPrice ? Number(maxPrice) : Infinity;

            filter.$expr = {
                $and: [
                    {
                        $gte: [
                            { $ifNull: ["$discountPrice", "$price"] },
                            min
                        ]
                    },
                    {
                        $lte: [
                            { $ifNull: ["$discountPrice", "$price"] },
                            max
                        ]
                    }
                ]
            };
        }

        // Sorting
        let sortOption = { createdAt: -1 };

        if (sort === "newest") {
            sortOption = { createdAt: -1 };
        }

        // Pagination
        const currentPage = Math.max(Number(page) || 1, 1);
        const perPage = Math.min(Math.max(Number(limit) || 10, 1), 50);

        const skip = (currentPage - 1) * perPage;

        const totalProducts = await Product.countDocuments(filter);

        let products;
        if (sort === "price_low" || sort === "price_high") {
            const sortDirection = sort === "price_low" ? 1 : -1;
            products = await Product.aggregate([
                { $match: filter },
                {
                    $addFields: {
                        effectivePrice: { $ifNull: ["$discountPrice", "$price"] }
                    }
                },
                { $sort: { effectivePrice: sortDirection, createdAt: -1 } },
                { $skip: skip },
                { $limit: perPage },
                { $project: { effectivePrice: 0 } }
            ]);
        } else {
            products = await Product.find(filter)
                .sort(sortOption)
                .skip(skip)
                .limit(perPage);
        }

        res.status(200).json({
            success: true,
            totalProducts,
            currentPage,
            totalPages: Math.ceil(totalProducts / perPage),
            products
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Get Single Product
const getSingleProduct = async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Update Product
const updateProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product updated successfully",
            product
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


// Delete Product
const deleteProduct = async (req, res) => {
    try {
        const product = await Product.findByIdAndDelete(req.params.id);

        if (!product) {
            return res.status(404).json({
                success: false,
                message: "Product not found"
            });
        }

        res.status(200).json({
            success: true,
            message: "Product deleted successfully"
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: error.message
        });
    }
};


module.exports = {
    uploadImages,
    addProduct,
    getAllProducts,
    getSingleProduct,
    updateProduct,
    deleteProduct
};
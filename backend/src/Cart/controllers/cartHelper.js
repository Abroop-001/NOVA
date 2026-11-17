const mongoose = require("mongoose");

/**
 * Normalizes a color string for consistent case-insensitive comparison.
 */
const normalizeColor = (color) => {
    return (color || "").trim().toLowerCase();
};

/**
 * Compares two sizes numerically.
 */
const compareSizes = (a, b) => {
    return Number(a) === Number(b);
};

/**
 * Finds an item in cart items matching product ID, size, and color.
 */
const findMatchingCartItem = (items, productId, size, color) => {
    const targetProdId = productId.toString();
    const targetSize = Number(size);
    const targetColor = normalizeColor(color);

    return items.find((item) => {
        const itemProdId = (item.product?._id || item.product).toString();
        const itemSize = Number(item.size);
        const itemColor = normalizeColor(item.color);

        return itemProdId === targetProdId && itemSize === targetSize && itemColor === targetColor;
    });
};

/**
 * Validates product variants (size and color) against Product document.
 */
const validateProductVariant = (product, size, color) => {
    const numericSize = Number(size);

    if (Array.isArray(product.sizes) && product.sizes.length > 0) {
        const hasSize = product.sizes.some((s) => Number(s) === numericSize);
        if (!hasSize) {
            return {
                valid: false,
                message: `Size ${size} is not available for ${product.name}. Available sizes: ${product.sizes.join(", ")}`
            };
        }
    }

    const normalizedColor = normalizeColor(color);
    if (Array.isArray(product.colors) && product.colors.length > 0 && normalizedColor) {
        const hasColor = product.colors.some((c) => normalizeColor(c) === normalizedColor);
        if (!hasColor) {
            return {
                valid: false,
                message: `Color "${color}" is not available for ${product.name}.`
            };
        }
    }

    return { valid: true };
};

module.exports = {
    normalizeColor,
    compareSizes,
    findMatchingCartItem,
    validateProductVariant
};

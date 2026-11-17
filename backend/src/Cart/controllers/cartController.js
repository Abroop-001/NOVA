const { addToCart } = require("./addCartController");
const { getCart, updateCart, removeFromCart } = require("./cartQueryController");
const { mergeCart } = require("./cartMergeController");
const {
    normalizeColor,
    compareSizes,
    findMatchingCartItem,
    validateProductVariant
} = require("./cartHelper");

module.exports = {
    addToCart,
    getCart,
    updateCart,
    removeFromCart,
    mergeCart,
    normalizeColor,
    compareSizes,
    findMatchingCartItem,
    validateProductVariant
};

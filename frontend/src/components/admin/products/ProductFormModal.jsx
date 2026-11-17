import React, { useState, useEffect } from "react";
import { X, Check } from "lucide-react";
import ProductImageUpload from "./ProductImageUpload";

const INITIAL = {
  name: "",
  brand: "Nike",
  description: "",
  price: "",
  discountPrice: "",
  category: "Running",
  sizes: "7, 8, 9, 10, 11",
  colors: "White, Black",
  stock: "20",
  isFeatured: false,
};

const ProductFormModal = ({ isOpen, onClose, initialProduct, onSubmit, submitting }) => {
  const [formData, setFormData] = useState(INITIAL);
  const [images, setImages] = useState([]);

  useEffect(() => {
    if (initialProduct) {
      setFormData({
        name: initialProduct.name || "",
        brand: initialProduct.brand || "Nike",
        description: initialProduct.description || "",
        price: initialProduct.price || "",
        discountPrice: initialProduct.discountPrice || "",
        category: initialProduct.category || "Running",
        sizes: initialProduct.sizes ? initialProduct.sizes.join(", ") : "7, 8, 9, 10, 11",
        colors: initialProduct.colors ? initialProduct.colors.join(", ") : "White",
        stock: initialProduct.stock !== undefined ? initialProduct.stock : "20",
        isFeatured: Boolean(initialProduct.isFeatured),
      });
      setImages(initialProduct.images || (initialProduct.image ? [initialProduct.image] : []));
    } else {
      setFormData(INITIAL);
      setImages([]);
    }
  }, [initialProduct, isOpen]);

  if (!isOpen) return null;

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === "checkbox" ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const payload = {
      ...formData,
      price: Number(formData.price),
      discountPrice: formData.discountPrice ? Number(formData.discountPrice) : null,
      stock: Number(formData.stock) || 0,
      sizes: formData.sizes.split(",").map((s) => Number(s.trim())).filter((n) => !isNaN(n)),
      colors: formData.colors.split(",").map((c) => c.trim()).filter(Boolean),
      images: images.length > 0 ? images : ["/hero-shoe.png"],
    };
    onSubmit(payload);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-xs overflow-y-auto">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto border border-gray-200 shadow-xl p-6">
        <div className="flex items-center justify-between pb-4 border-b border-gray-100">
          <h3 className="text-base font-bold text-gray-900">
            {initialProduct ? "Edit Footwear Product" : "Add New Footwear"}
          </h3>
          <button type="button" onClick={onClose} className="p-1.5 text-gray-400 hover:text-gray-600 rounded-lg">
            <X size={18} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4 pt-4 text-xs">
          <ProductImageUpload images={images} setImages={setImages} />

          <div className="grid grid-cols-2 gap-3">
            <div className="col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Product Name</label>
              <input name="name" required value={formData.name} onChange={handleChange} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Brand</label>
              <select name="brand" value={formData.brand} onChange={handleChange} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600 bg-white">
                <option value="Nike">Nike</option>
                <option value="Adidas">Adidas</option>
                <option value="Puma">Puma</option>
              </select>
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Category</label>
              <input name="category" required value={formData.category} onChange={handleChange} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Price (₹)</label>
              <input type="number" name="price" required value={formData.price} onChange={handleChange} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Discount Price (₹)</label>
              <input type="number" name="discountPrice" value={formData.discountPrice} onChange={handleChange} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Available Sizes</label>
              <input name="sizes" value={formData.sizes} onChange={handleChange} placeholder="7, 8, 9, 10" className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div>
              <label className="font-bold text-gray-700 block mb-1">Inventory Stock</label>
              <input type="number" name="stock" required value={formData.stock} onChange={handleChange} className="w-full h-10 px-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div className="col-span-2">
              <label className="font-bold text-gray-700 block mb-1">Description</label>
              <textarea name="description" rows={3} required value={formData.description} onChange={handleChange} className="w-full p-3 border border-gray-200 rounded-xl outline-none focus:border-blue-600" />
            </div>

            <div className="col-span-2 flex items-center gap-2">
              <input type="checkbox" id="isFeatured" name="isFeatured" checked={formData.isFeatured} onChange={handleChange} className="rounded" />
              <label htmlFor="isFeatured" className="font-bold text-gray-700">Mark as Featured Product</label>
            </div>
          </div>

          <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
            <button type="button" onClick={onClose} className="px-5 py-2.5 border border-gray-200 rounded-xl font-bold text-gray-600 hover:bg-gray-50">Cancel</button>
            <button type="submit" disabled={submitting} className="px-6 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold shadow-xs disabled:opacity-50 flex items-center gap-1.5">
              <Check size={14} /> {submitting ? "Saving..." : "Save Product"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ProductFormModal;


import React, { useState } from "react";
import { Upload, X } from "lucide-react";
import { uploadImages } from "../../../services/admin/adminProductService";

const ProductImageUpload = ({ images = [], setImages }) => {
  const [uploading, setUploading] = useState(false);

  const handleFileChange = async (e) => {
    const files = e.target.files;
    if (!files || files.length === 0) return;

    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }

    setUploading(true);
    try {
      const data = await uploadImages(formData);
      if (data.imageUrls) {
        setImages((prev) => [...prev, ...data.imageUrls]);
      }
    } catch {
      alert("Image upload failed. Please try again or provide an image URL.");
    } finally {
      setUploading(false);
    }
  };

  const handleRemove = (index) => {
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  return (
    <div className="space-y-3">
      <label className="text-xs font-bold uppercase tracking-wider text-gray-700 block">
        Product Images
      </label>

      {/* Upload Zone */}
      <label className="border-2 border-dashed border-gray-200 hover:border-blue-500 rounded-xl p-4 flex flex-col items-center justify-center gap-2 cursor-pointer bg-gray-50/50 hover:bg-blue-50/20 transition">
        <Upload size={20} className="text-gray-400" />
        <span className="text-xs text-gray-600 font-medium">
          {uploading ? "Uploading to Cloudinary..." : "Click to upload product images"}
        </span>
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileChange}
          disabled={uploading}
          className="hidden"
        />
      </label>

      {/* Image Previews */}
      {images.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {images.map((url, idx) => (
            <div
              key={idx}
              className="relative w-16 h-16 rounded-lg bg-[#F5F5F2] p-1 border border-gray-200 group overflow-hidden"
            >
              <img src={url} alt="preview" className="w-full h-full object-contain" />
              <button
                type="button"
                onClick={() => handleRemove(idx)}
                className="absolute top-1 right-1 p-0.5 bg-black/70 text-white rounded-full hover:bg-red-600 transition"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageUpload;


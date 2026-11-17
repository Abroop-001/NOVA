import React, { useState, useEffect, useCallback } from "react";
import ProductFilterAdmin from "../../components/admin/products/ProductFilterAdmin";
import ProductCardAdmin from "../../components/admin/products/ProductCardAdmin";
import ProductFormModal from "../../components/admin/products/ProductFormModal";
import {
  getProducts,
  addProduct,
  updateProduct,
  deleteProduct,
} from "../../services/admin/adminProductService";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedBrand, setSelectedBrand] = useState("");
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [deletingId, setDeletingId] = useState(null);

  const fetchCatalog = useCallback(async () => {
    try {
      setLoading(true);
      const params = { page, limit: 9 };
      if (search) params.search = search;
      if (selectedBrand) params.brand = selectedBrand;
      const data = await getProducts(params);
      setProducts(data.products || []);
      setTotalPages(data.totalPages || 1);
    } finally {
      setLoading(false);
    }
  }, [page, search, selectedBrand]);

  useEffect(() => {
    fetchCatalog();
  }, [fetchCatalog]);

  const handleSave = async (payload) => {
    setSubmitting(true);
    try {
      if (editingProduct) {
        await updateProduct(editingProduct._id || editingProduct.id, payload);
      } else {
        await addProduct(payload);
      }
      setModalOpen(false);
      setEditingProduct(null);
      await fetchCatalog();
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this product?")) return;
    setDeletingId(id);
    try {
      await deleteProduct(id);
      await fetchCatalog();
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-6">
      <ProductFilterAdmin
        search={search}
        setSearch={setSearch}
        selectedBrand={selectedBrand}
        setSelectedBrand={(brand) => {
          setSelectedBrand(brand);
          setPage(1);
        }}
        onAddNew={() => {
          setEditingProduct(null);
          setModalOpen(true);
        }}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 animate-pulse">
          {[1, 2, 3, 4, 5, 6].map((i) => (
            <div key={i} className="h-80 bg-white rounded-2xl border border-gray-200" />
          ))}
        </div>
      ) : products.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-gray-200">
          <p className="text-gray-500 text-sm">No products found matching criteria.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {products.map((prod) => (
            <ProductCardAdmin
              key={prod._id || prod.id}
              product={prod}
              onEdit={(p) => {
                setEditingProduct(p);
                setModalOpen(true);
              }}
              onDelete={handleDelete}
              isDeleting={deletingId === (prod._id || prod.id)}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex justify-center items-center gap-2 pt-4">
          <button disabled={page <= 1} onClick={() => setPage((p) => p - 1)} className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40">Previous</button>
          <span className="text-xs font-semibold text-gray-600">Page {page} of {totalPages}</span>
          <button disabled={page >= totalPages} onClick={() => setPage((p) => p + 1)} className="px-3.5 py-1.5 bg-white border border-gray-200 rounded-lg text-xs font-bold disabled:opacity-40">Next</button>
        </div>
      )}

      <ProductFormModal
        isOpen={modalOpen}
        onClose={() => {
          setModalOpen(false);
          setEditingProduct(null);
        }}
        initialProduct={editingProduct}
        onSubmit={handleSave}
        submitting={submitting}
      />
    </div>
  );
};

export default AdminProducts;


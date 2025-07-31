import { useAppContext } from "../../context/AppContext.jsx";
import toast from "react-hot-toast";
import { useState } from "react";
import { FiEdit, FiTrash2 } from "react-icons/fi";

const ProductList = () => {
  const { products, currency, axios, fetchProducts } = useAppContext();
  const [editProduct, setEditProduct] = useState(null);
  const [deleteId, setDeleteId] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  const [confirmOpen, setConfirmOpen] = useState(false);

  const toggleStock = async (id, inStock) => {
    try {
      const { data } = await axios.post("/api/product/stock", { id, inStock });
      if (data.success) {
        fetchProducts();
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.message);
    }
  };

  const openEditModal = (product) => {
    setEditProduct({ ...product });
    setModalOpen(true);
  };

  const openDeleteModal = (id) => {
    setDeleteId(id);
    setConfirmOpen(true);
  };

  const handleDelete = async () => {
    try {
      const { data } = await axios.delete("/api/product/delete", {
        data: { id: deleteId },
      });
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    } finally {
      setConfirmOpen(false);
      setDeleteId(null);
    }
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.put("/api/product/update", {
        id: editProduct._id,
        updatedData: editProduct,
      });
      if (data.success) {
        toast.success(data.message);
        fetchProducts();
        setModalOpen(false);
      } else {
        toast.error(data.message);
      }
    } catch (err) {
      toast.error(err.message);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditProduct((prev) => ({ ...prev, [name]: value }));
  };

  return (
    <div className="no-scrollbar flex-1 h-[95vh] overflow-y-scroll flex flex-col justify-between">
      <div className="w-full md:p-10 p-4">
        <h2 className="pb-4 text-lg font-medium">All Products</h2>
        <div className="flex flex-col items-center max-w-4xl w-full overflow-hidden rounded-md bg-white border border-gray-500/20">
          <table className="md:table-auto table-fixed w-full overflow-hidden">
            <thead className="text-gray-900 text-sm text-left">
              <tr>
                <th className="px-4 py-3 font-semibold">Product</th>
                <th className="px-4 py-3 font-semibold">Category</th>
                <th className="px-4 py-3 font-semibold hidden md:block">
                  Selling Price
                </th>
                <th className="px-4 py-3 font-semibold">In Stock</th>
                <th className="px-4 py-3 font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody className="text-sm text-gray-500">
              {products.map((product) => (
                <tr key={product._id} className="border-t border-gray-500/20">
                  <td className="md:px-4 pl-2 md:pl-4 py-3 flex items-center space-x-3 truncate">
                    <div className="border border-gray-300 rounded overflow-hidden">
                      <img
                        src={product.image[0]}
                        alt="Product"
                        className="w-16"
                      />
                    </div>
                    <span className="truncate max-sm:hidden w-full">
                      {product.name}
                    </span>
                  </td>
                  <td className="px-4 py-3">{product.category}</td>
                  <td className="px-4 py-3 max-sm:hidden">
                    {currency}
                    {product.offerPrice}
                  </td>
                  <td className="px-4 py-3">
                    <label className="relative inline-flex items-center cursor-pointer text-gray-900 gap-3">
                      <input
                        onChange={() =>
                          toggleStock(product._id, !product.inStock)
                        }
                        checked={product.inStock}
                        type="checkbox"
                        className="sr-only peer"
                      />
                      <div className="w-12 h-7 bg-slate-300 rounded-full peer peer-checked:bg-blue-600 transition-colors duration-200"></div>
                      <span className="dot absolute left-1 top-1 w-5 h-5 bg-white rounded-full transition-transform duration-200 ease-in-out peer-checked:translate-x-5"></span>
                    </label>
                  </td>
                  <td className="px-4 py-3 flex items-center gap-3">
                    <button
                      onClick={() => openEditModal(product)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      <FiEdit />
                    </button>
                    <button
                      onClick={() => openDeleteModal(product._id)}
                      className="text-red-600 hover:text-red-800"
                    >
                      <FiTrash2 />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Edit Modal */}
      {modalOpen && editProduct && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <form
            onSubmit={handleEditSubmit}
            className="bg-white rounded-lg p-6 w-96 space-y-4 relative"
          >
            <h3 className="text-lg font-medium">Edit Product</h3>
            <div>
              <label className="block text-sm font-medium">Name</label>
              <input
                name="name"
                value={editProduct.name}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Category</label>
              <input
                name="category"
                value={editProduct.category}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium">Offer Price</label>
              <input
                name="offerPrice"
                type="number"
                value={editProduct.offerPrice}
                onChange={handleChange}
                className="w-full border p-2 rounded"
                required
              />
            </div>
            <div className="flex justify-between">
              <button
                type="button"
                onClick={() => setModalOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                type="submit"
                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {confirmOpen && (
        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">
          <div className="bg-white rounded-lg p-6 w-80 space-y-4">
            <h3 className="text-lg font-medium text-gray-800">
              Confirm Deletion
            </h3>
            <p className="text-gray-600 text-sm">
              Are you sure you want to delete this product?
            </p>
            <div className="flex justify-between">
              <button
                onClick={() => setConfirmOpen(false)}
                className="text-gray-600 hover:underline"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;

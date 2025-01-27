import React, { useState, useEffect } from "react";
import { backend } from "../..";
import axios from "axios";

const AdminProducts = () => {
  const [products, setProducts] = useState([]);
  const [editProduct, setEditProduct] = useState(null);
  const [editForm, setEditForm] = useState({
    productName: "",
    productPrice: "",
    productQuantity: "",
    productCategory: "",
    productImage: null, // Added to hold image file for editing
  });

  const [showAddProduct, setShowAddProduct] = useState(false); // To toggle add product modal
  const [addForm, setAddForm] = useState({
    productName: "",
    productCode: "",
    productPrice: "",
    productQuantity: "",
    productSoldQuantity: "",
    productImage: null, // Image for new product
    productCategory: "",
  });

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(`${backend}/api/admin/products`, {
          withCredentials: true,
        });
        setProducts(response.data.products);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Add event listener for ESC key
    const handleKeyDown = (e) => {
      if (e.key === "Escape") {
        if (editProduct) setEditProduct(null);
        if (showAddProduct) setShowAddProduct(false);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown); // Cleanup
  }, [editProduct, showAddProduct]);

  const deleteProduct = async (id) => {
    try {
      await axios.delete(`${backend}/api/admin/product/${id}`, {
        withCredentials: true,
      });
      setProducts((prevProducts) =>
        prevProducts.filter((product) => product._id !== id)
      );
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const handleEditClick = (product) => {
    setEditProduct(product);
    setEditForm({
      productName: product.productName,
      productPrice: product.productPrice,
      productQuantity: product.productQuantity,
      productCategory: product.productCategory.join(", "),
      productImage: null, // Clear previous image when editing
    });
  };

  const handleInputChange = (e, formSetter) => {
    formSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  // Handle image upload in Add Product form
  const handleAddProductImageChange = (e) => {
    try {
      setAddForm((prev) => ({ ...prev, productImage: e.target.files[0] }));
    } catch (error) {}
  };

  // Handle image upload in Edit Product form
  const handleEditProductImageChange = (e) => {
    setEditForm((prev) => ({ ...prev, productImage: e.target.files[0] }));
  };

  const handleAddProduct = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData();
      formData.append("productName", addForm.productName);
      formData.append("productCode", addForm.productCode);
      formData.append("productPrice", Number(addForm.productPrice));
      formData.append("productQuantity", Number(addForm.productQuantity));
      formData.append(
        "productSoldQuantity",
        Number(addForm.productSoldQuantity)
      );
      formData.append("productImage", addForm.productImage); // Append image as file
      formData.append(
        "productCategory",
        addForm.productCategory.split(",").map((cat) => cat.trim())
      );

      try {
        const response = await axios.post(
          `${backend}/api/product/add`,
          formData, // Send FormData instead of JSON
          {
            headers: { "Content-Type": "multipart/form-data" },
            withCredentials: true,
          }
        );
console.log(response)
        setProducts((prevProducts) => [
          ...prevProducts,
          response.data.newProduct,
        ]);
        setShowAddProduct(false);
      } catch (error) {
        console.error("Error adding product:", error);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpdateProduct = async () => {
    const formData = new FormData();
    formData.append("productName", editForm.productName);
    formData.append("productPrice", Number(editForm.productPrice));
    formData.append("productQuantity", Number(editForm.productQuantity));
    formData.append(
      "productCategory",
      editForm.productCategory.split(",").map((cat) => cat.trim())
    );

    if (editForm.productImage) {
      formData.append("productImage", editForm.productImage); // Append image if available
    }

    try {
      const response = await axios.put(
        `${backend}/api/admin/products/${editProduct._id}`,
        formData, // Send FormData instead of JSON
        {
          headers: { "Content-Type": "multipart/form-data" },
          withCredentials: true,
        }
      );

      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editProduct._id
            ? response.data.updatedProduct
            : product
        )
      );

      setEditProduct(null);
    } catch (error) {
      console.error("Error updating product:", error);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Products</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Product Box */}
        <div
          className="flex items-center justify-center bg-gray-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer p-6"
          onClick={() => setShowAddProduct(true)}
        >
          <span className="text-gray-600 font-bold">+ Add Product</span>
        </div>

        {products.map((product) => (
          <div
            key={product._id}
            className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow border"
          >
            {console.log(product)}
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">
                {product.productName}
              </h3>
              <p className="text-gray-600">
                <span className="font-semibold">Price:</span> $
                {product.productPrice}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Category:</span>{" "}
                {product.productCategory.join(", ")}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Stock:</span>{" "}
                {product.productQuantity}
              </p>
            </div>

            {/* Action Buttons */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity flex-col gap-1 -right-2/4">
              <button
                className="bg-red-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-red-600"
                onClick={() => deleteProduct(product._id)}
              >
                Delete
              </button>
              <button
                className="bg-orange-500 text-white font-bold py-2 px-4 rounded-lg hover:bg-orange-600"
                onClick={() => handleEditClick(product)}
              >
                Edit
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Product Modal */}
      {showAddProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <form
            encType="multipart/form-data"
            className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md"
          >
            <h2 className="text-lg font-semibold mb-4">Add New Product</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="productName"
                value={addForm.productName}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="productCode"
                value={addForm.productCode}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Product Code"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="productPrice"
                value={addForm.productPrice}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Product Price"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="productQuantity"
                value={addForm.productQuantity}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Product Quantity"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="productSoldQuantity"
                value={addForm.productSoldQuantity}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Sold Quantity"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="productImage"
                onChange={handleAddProductImageChange}
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="productCategory"
                value={addForm.productCategory}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Product Category (comma-separated)"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddProduct(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddProduct}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Product
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Edit Product Modal */}
      {editProduct && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Product</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="productName"
                value={editForm.productName}
                onChange={(e) => handleInputChange(e, setEditForm)}
                placeholder="Product Name"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="productPrice"
                value={editForm.productPrice}
                onChange={(e) => handleInputChange(e, setEditForm)}
                placeholder="Product Price"
                className="w-full p-2 border rounded"
              />
              <input
                type="number"
                name="productQuantity"
                value={editForm.productQuantity}
                onChange={(e) => handleInputChange(e, setEditForm)}
                placeholder="Product Quantity"
                className="w-full p-2 border rounded"
              />
              <input
                type="text"
                name="productCategory"
                value={editForm.productCategory}
                onChange={(e) => handleInputChange(e, setEditForm)}
                placeholder="Product Category (comma-separated)"
                className="w-full p-2 border rounded"
              />
              <input
                type="file"
                name="productImage"
                onChange={handleEditProductImageChange}
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setEditProduct(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateProduct}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminProducts;

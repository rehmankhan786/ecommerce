import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import { backend } from "../..";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashAlt, faPen } from "@fortawesome/free-solid-svg-icons"; // Import the necessary icons
import { gsap } from "gsap"; // Import GSAP for animations

const AdminCategories = () => {
  const [categories, setCategories] = useState([]);
  const [editCategory, setEditCategory] = useState(null);
  const [editForm, setEditForm] = useState({
    categoryName: "",
  });

  const [showAddCategory, setShowAddCategory] = useState(false); // To toggle add category modal
  const [addForm, setAddForm] = useState({
    categoryName: "",
  });

  // Create refs for the delete and edit buttons as arrays
  const deleteButtonRefs = useRef([]);
  const editButtonRefs = useRef([]);
  const categoryRefs = useRef([]); // Ref for the categories

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(`${backend}/api/category/`, {
          withCredentials: true,
        });
        setCategories(response.data);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const deleteCategory = async (id, index) => {
    // Animate the category to fade out
    gsap.to(categoryRefs.current[index], {
      opacity: 0,
      duration: 0.3,
      onComplete: async () => {
        try {
          // Now send the request to delete from the backend after fade-out animation
          await axios.delete(`${backend}/api/category/delete/${id}`, {
            withCredentials: true,
          });

          // Remove the category from the state
          setCategories((prevCategories) =>
            prevCategories.filter((category) => category._id !== id)
          );
        } catch (error) {
          console.error("Error deleting category:", error);
        }
      },
    });
  };

  const handleEditClick = (category) => {
    setEditCategory(category);
    setEditForm({
      categoryName: category.name,
    });
  };

  const handleInputChange = (e, formSetter) => {
    formSetter((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleUpdateCategory = async () => {
    try {
      const response = await axios.put(
        `${backend}/api/admin/category/${editCategory._id}`,
        {
          name: editForm.categoryName,
        },
        { withCredentials: true }
      );

      setCategories((prevCategories) =>
        prevCategories.map((category) =>
          category._id === editCategory._id ? response.data.updatedCategory : category
        )
      );

      setEditCategory(null);
    } catch (error) {
      console.error("Error updating category:", error);
    }
  };

  const handleAddCategory = async () => {
    try {
      const response = await axios.post(
        `${backend}/api/category/add`,
        {
          categoryName: addForm.categoryName,
        },
        { withCredentials: true }
      );
      setAddForm({categoryName :""})
// addForm.categoryName =""
      setCategories((prevCategories) => [
        ...prevCategories,
        response.data.newCategory,
      ]);
      setShowAddCategory(false);
    } catch (error) {
      console.error("Error adding category:", error);
    }
  };

  // Hover effect function for delete and edit buttons
  const onMouseEnter = (index) => {
    gsap.to(deleteButtonRefs.current[index], { x: 0, duration: 0.5, ease: "power3.out" });
    gsap.to(editButtonRefs.current[index], { x: 0, duration: 0.5, ease: "power3.out" });
  };

  const onMouseLeave = (index) => {
    gsap.to(deleteButtonRefs.current[index], { x: 100, duration: 0.5, ease: "power3.in" });
    gsap.to(editButtonRefs.current[index], { x: 100, duration: 0.5, ease: "power3.in" });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6">All Categories</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Add Category Box */}
        <div
          className="flex items-center justify-center bg-gray-200 rounded-lg shadow-md hover:shadow-lg cursor-pointer p-6"
          onClick={() => setShowAddCategory(true)}
        >
          <span className="text-gray-600 font-bold">+ Add Category</span>
        </div>

        {categories.map((category, index) => (
          <div
            key={category._id}
            ref={(el) => (categoryRefs.current[index] = el)} // Assign the ref for each category div
            className="relative bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow border"
            onMouseEnter={() => onMouseEnter(index)}
            onMouseLeave={() => onMouseLeave(index)}
          >
            <div className="p-4">
              <h3 className="text-xl font-semibold text-gray-800">{category.name}</h3>
            </div>

            {/* Action Buttons */}
            <div className="absolute inset-0 bg-gray-900 bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center space-x-4 transition-opacity -right-2/4">
              {/* Delete Button */}
              <button
                ref={(el) => (deleteButtonRefs.current[index] = el)}
                className="bg-red-500 text-white p-3 w-12 rounded-full hover:bg-red-600"
                onClick={() => deleteCategory(category._id, index)} // Pass the category index
              >
                <FontAwesomeIcon icon={faTrashAlt} />
              </button>

              {/* Edit Button */}
              <button
                ref={(el) => (editButtonRefs.current[index] = el)}
                className="bg-orange-500 w-12 text-white p-3 rounded-full hover:bg-orange-600"
                onClick={() => handleEditClick(category)}
              >
                <FontAwesomeIcon icon={faPen} className="rotate-12" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Add Category Modal */}
      {showAddCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Add New Category</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="categoryName"
                value={addForm.categoryName}
                onChange={(e) => handleInputChange(e, setAddForm)}
                placeholder="Category Name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setShowAddCategory(false)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleAddCategory}
                className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
              >
                Add Category
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Edit Category Modal */}
      {editCategory && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h2 className="text-lg font-semibold mb-4">Edit Category</h2>
            <div className="space-y-4">
              <input
                type="text"
                name="categoryName"
                value={editForm.categoryName}
                onChange={(e) => handleInputChange(e, setEditForm)}
                placeholder="Category Name"
                className="w-full p-2 border rounded"
              />
            </div>
            <div className="mt-4 flex justify-end space-x-4">
              <button
                onClick={() => setEditCategory(null)}
                className="px-4 py-2 bg-gray-300 rounded hover:bg-gray-400"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdateCategory}
                className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Update Category
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminCategories;

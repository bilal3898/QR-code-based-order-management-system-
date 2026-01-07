import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import menuService from "../../services/menuService";

const MenuItemForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: "",
    availability: true,
  });

  useEffect(() => {
    if (isEdit && id) {
      const fetchMenuItem = async () => {
        try {
          const response = await menuService.getById(id);
          const item = response.data;
          setFormData({
            name: item.name || "",
            description: item.description || "",
            price: item.price || "",
            category: item.category || "",
            availability: item.availability ?? true,
          });
        } catch (err) {
          setError("Failed to load menu item.");
          console.error(err);
        }
      };
      fetchMenuItem();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    if (!formData.name || !formData.price || !formData.category) {
      setError("Name, Price, and Category are required.");
      setLoading(false);
      return;
    }

    try {
      const submitData = {
        name: formData.name,
        description: formData.description,
        price: parseFloat(formData.price),
        category: formData.category,
        availability: formData.availability,
      };

      if (isEdit) {
        await menuService.update(id, submitData);
      } else {
        await menuService.create(submitData);
      }
      navigate("/menu");
    } catch (err) {
      const apiError = err.response?.data?.error || err.response?.data?.errors;
      let message = "Failed to save menu item.";

      if (apiError) {
        if (typeof apiError === "string") {
          message = apiError;
        } else if (typeof apiError === "object") {
          message =
            apiError.description ||
            apiError.message ||
            JSON.stringify(apiError);
        }
      }

      setError(message);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-bold mb-4">{isEdit ? "Edit Menu Item" : "Add New Menu Item"}</h2>
      {error && (
        <div className="mb-4 text-red-600">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </div>
      )}
      <form onSubmit={handleSubmit} className="max-w-md">
        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Name *</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Description</label>
          <textarea
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            rows="3"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Price *</label>
          <input
            type="number"
            name="price"
            value={formData.price}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
            min="0"
            step="0.01"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium mb-1">Category *</label>
          <input
            type="text"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="w-full border px-3 py-2 rounded"
            required
          />
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="availability"
              checked={formData.availability}
              onChange={handleChange}
              className="mr-2"
            />
            Available
          </label>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            disabled={loading}
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 disabled:opacity-50"
          >
            {loading ? "Saving..." : isEdit ? "Update" : "Add"} Item
          </button>
          <button
            type="button"
            onClick={() => navigate("/menu")}
            className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};

export default MenuItemForm;

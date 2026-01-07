// frontend/src/components/Customer/CustomerForm.js

import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import customerService from "../../services/customerService";

const CustomerForm = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEdit = !!id;
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (isEdit) {
      const fetchCustomer = async () => {
        try {
          const response = await customerService.getCustomerById(id);
          setFormData(response.data);
        } catch (err) {
          setError("Failed to load customer data.");
          console.error(err);
        }
      };
      fetchCustomer();
    }
  }, [id, isEdit]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      if (isEdit) {
        await customerService.updateCustomer(id, formData);
      } else {
        await customerService.createCustomer(formData);
      }
      navigate("/customers");
    } catch (err) {
      const apiError = err.response?.data?.error || err.response?.data?.errors;
      let message = "Something went wrong. Please try again.";

      if (apiError) {
        if (typeof apiError === "string") {
          message = apiError;
        } else if (typeof apiError === "object") {
          // Our backend error handler returns { code, name, description }
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
    <form onSubmit={handleSubmit} className="customer-form">
      <h2>{isEdit ? "Edit Customer" : "Add Customer"}</h2>

      {error && (
        <p className="error">
          {typeof error === "string" ? error : JSON.stringify(error)}
        </p>
      )}

      <div>
        <label>Name:</label>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Email:</label>
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Phone:</label>
        <input
          type="tel"
          name="phone"
          value={formData.phone}
          onChange={handleChange}
          required
        />
      </div>

      <button type="submit" disabled={loading}>
        {loading ? "Saving..." : isEdit ? "Update" : "Create"}
      </button>
      <button
        type="button"
        onClick={() => navigate("/customers")}
        className="ml-2 bg-gray-500 text-white px-4 py-2 rounded"
      >
        Cancel
      </button>
    </form>
  );
};

export default CustomerForm;

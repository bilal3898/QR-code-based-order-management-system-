// frontend/src/components/Customer/CustomerDetails.js

import React, { useEffect, useState } from "react";
import axios from "axios";

const CustomerDetails = ({ customerId, onBack }) => {
  const [customer, setCustomer] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    if (customerId) {
      fetchCustomerDetails();
    }
  }, [customerId]);

  const fetchCustomerDetails = async () => {
    try {
      const response = await axios.get(`/api/customers/${customerId}`);
      setCustomer(response.data);
      setLoading(false);
    } catch (err) {
      setError("Failed to load customer details.");
      setLoading(false);
    }
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4 border rounded shadow">
      <h2 className="text-xl font-semibold mb-4">Customer Details</h2>
      <div>
        <p><strong>Name:</strong> {customer.name}</p>
        <p><strong>Email:</strong> {customer.email}</p>
        <p><strong>Phone:</strong> {customer.phone}</p>
      </div>
      <button
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        onClick={onBack}
      >
        Back
      </button>
    </div>
  );
};

export default CustomerDetails;

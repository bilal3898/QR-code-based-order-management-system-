// frontend/src/components/Customer/CustomerList.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import customerService from "../../services/customerService";

const CustomerList = () => {
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        const response = await customerService.getCustomers();
        setCustomers(response.data || []);
      } catch (err) {
        setError("Failed to fetch customers.");
        console.error("Customer fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  if (loading) return <p>Loading customers...</p>;
  if (error) return <p>{typeof error === "string" ? error : JSON.stringify(error)}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Customer List</h2>
        <Link
          to="/customers/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Customer
        </Link>
      </div>
      {loading ? (
        <p>Loading customers...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">ID</th>
              <th className="py-2 px-4 border-b">Name</th>
              <th className="py-2 px-4 border-b">Email</th>
              <th className="py-2 px-4 border-b">Phone</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {customers.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No customers found
                </td>
              </tr>
            ) : (
              customers.map((customer) => (
                <tr key={customer.id}>
                  <td className="py-2 px-4 border-b">{customer.id}</td>
                  <td className="py-2 px-4 border-b">{customer.name}</td>
                  <td className="py-2 px-4 border-b">{customer.email}</td>
                  <td className="py-2 px-4 border-b">{customer.phone || "N/A"}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/customers/${customer.id}/edit`}
                      className="text-blue-600 hover:underline mr-2"
                    >
                      Edit
                    </Link>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CustomerList;

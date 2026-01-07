// frontend/src/components/Table/TableList.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import tableService from "../../services/tableService";

const TableList = () => {
  const [tables, setTables] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchTables = async () => {
      try {
        const response = await tableService.getAllTables();
        setTables(response.data || []);
      } catch (err) {
        console.error("Table fetch error:", err);
        setError("Failed to fetch table data.");
      } finally {
        setLoading(false);
      }
    };

    fetchTables();
  }, []);

  if (loading) return <p>Loading tables...</p>;
  if (error) return <p>{typeof error === "string" ? error : JSON.stringify(error)}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Table List</h2>
        <Link
          to="/tables/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Table
        </Link>
      </div>
      {loading ? (
        <p>Loading tables...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="min-w-full bg-white border border-gray-200">
          <thead>
            <tr className="bg-gray-100">
              <th className="py-2 px-4 border-b">Table Number</th>
              <th className="py-2 px-4 border-b">Capacity</th>
              <th className="py-2 px-4 border-b">Status</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {tables.length === 0 ? (
              <tr>
                <td colSpan="4" className="py-4 text-center text-gray-500">
                  No tables found
                </td>
              </tr>
            ) : (
              tables.map((table) => (
                <tr key={table.id}>
                  <td className="py-2 px-4 border-b">{table.number}</td>
                  <td className="py-2 px-4 border-b">{table.capacity}</td>
                  <td className="py-2 px-4 border-b">{table.status}</td>
                  <td className="py-2 px-4 border-b">
                    <Link
                      to={`/tables/${table.id}/edit`}
                      className="text-blue-600 hover:underline"
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

export default TableList;

// frontend/src/components/Menu/MenuList.js

import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import menuService from "../../services/menuService";

const MenuList = () => {
  const [menuItems, setMenuItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchMenu = async () => {
      try {
        const response = await menuService.getAll();
        setMenuItems(response.data || []);
      } catch (err) {
        setError("Failed to fetch menu items.");
        console.error("Menu fetch error:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  if (loading) return <p>Loading menu...</p>;
  if (error) return <p>{typeof error === "string" ? error : JSON.stringify(error)}</p>;

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Menu</h2>
        <Link
          to="/menu/items/new"
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Add New Item
        </Link>
      </div>
      {loading ? (
        <p>Loading menu...</p>
      ) : error ? (
        <p className="text-red-600">{error}</p>
      ) : (
        <table className="min-w-full border rounded-lg overflow-hidden">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2">Name</th>
              <th className="px-4 py-2">Category</th>
              <th className="px-4 py-2">Price</th>
              <th className="px-4 py-2">Available</th>
              <th className="px-4 py-2">Actions</th>
            </tr>
          </thead>
          <tbody>
            {menuItems.length === 0 ? (
              <tr>
                <td colSpan="5" className="py-4 text-center text-gray-500">
                  No menu items found
                </td>
              </tr>
            ) : (
              menuItems.map((item) => (
                <tr key={item.id} className="text-center border-t">
                  <td className="px-4 py-2">{item.name}</td>
                  <td className="px-4 py-2">{item.category}</td>
                  <td className="px-4 py-2">₹{item.price}</td>
                  <td className="px-4 py-2">
                    {item.availability ? "Yes" : "No"}
                  </td>
                  <td className="px-4 py-2">
                    <Link
                      to={`/menu/items/${item.id}/edit`}
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

export default MenuList;

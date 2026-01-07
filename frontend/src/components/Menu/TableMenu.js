// src/components/Menu/TableMenu.js

import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";
import MenuItem from "./MenuItem";

const TableMenu = () => {
  const { tableId } = useParams();
  const [menuItems, setMenuItems] = useState([]);

  useEffect(() => {
    // Example API call — replace with your actual endpoint
    axios
      .get(`http://localhost:5000/api/menu?tableId=${tableId}`)
      .then((res) => setMenuItems(res.data))
      .catch((err) => console.error("Failed to load menu", err));
  }, [tableId]);

  const handleEdit = (item) => {
    console.log("Edit item", item);
    // You can show a modal or redirect to edit form
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure to delete this menu item?")) {
      axios
        .delete(`http://localhost:5000/api/menu/${id}`)
        .then(() => setMenuItems((prev) => prev.filter((item) => item.id !== id)))
        .catch((err) => console.error("Delete failed", err));
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-bold mb-4">Menu for Table {tableId}</h2>
      {menuItems.map((item) => (
        <MenuItem
          key={item.id}
          item={item}
          onEdit={() => handleEdit(item)}
          onDelete={() => handleDelete(item.id)}
        />
      ))}
    </div>
  );
};

export default TableMenu;

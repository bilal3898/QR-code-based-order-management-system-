// frontend/src/components/Table/TableStatus.js

import React from "react";

const TableStatus = ({ status, onChange }) => {
  const statusColors = {
    available: "bg-green-500",
    occupied: "bg-red-500",
    reserved: "bg-yellow-500",
  };

  const handleStatusChange = (e) => {
    if (onChange) {
      onChange(e.target.value);
    }
  };

  return (
    <div className="flex items-center space-x-3">
      <span
        className={`inline-block w-3 h-3 rounded-full ${statusColors[status] || "bg-gray-400"}`}
        title={status}
      ></span>
      <select
        value={status}
        onChange={handleStatusChange}
        className="border border-gray-300 rounded px-2 py-1 text-sm focus:outline-none"
      >
        <option value="available">Available</option>
        <option value="occupied">Occupied</option>
        <option value="reserved">Reserved</option>
      </select>
    </div>
  );
};

export default TableStatus;

// frontend/src/components/Table/TableForm.js

import React, { useState } from "react";
import axios from "axios";

const TableForm = ({ onSuccess }) => {
  const [tableNumber, setTableNumber] = useState("");
  const [seats, setSeats] = useState("");
  const [status, setStatus] = useState("available");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!tableNumber || !seats) {
      setError("Please fill all required fields.");
      return;
    }

    try {
      const response = await axios.post("/api/tables", {
        table_number: tableNumber,
        seats: parseInt(seats),
        status,
      });

      if (response.status === 201 || response.status === 200) {
        onSuccess && onSuccess(); // Callback to parent after successful submission
        setTableNumber("");
        setSeats("");
        setStatus("available");
        setError("");
      }
    } catch (err) {
      setError("Failed to create table. Please try again.");
      console.error(err);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="form">
      <h2>Create Table</h2>
      {error && <p className="error">{error}</p>}

      <label>
        Table Number:
        <input
          type="text"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          required
        />
      </label>

      <label>
        Seats:
        <input
          type="number"
          value={seats}
          onChange={(e) => setSeats(e.target.value)}
          required
        />
      </label>

      <label>
        Status:
        <select value={status} onChange={(e) => setStatus(e.target.value)}>
          <option value="available">Available</option>
          <option value="occupied">Occupied</option>
          <option value="reserved">Reserved</option>
        </select>
      </label>

      <button type="submit">Create Table</button>
    </form>
  );
};

export default TableForm;

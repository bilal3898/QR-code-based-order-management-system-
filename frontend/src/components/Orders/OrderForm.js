// src/components/Orders/OrderForm.js

import React, { useState, useEffect } from 'react';
import axios from 'axios';

const OrderForm = ({ existingOrder = null, onSuccess }) => {
  const [formData, setFormData] = useState({
    customerId: '',
    tableId: '',
    items: [], // Example: [{ menuItemId: '123', quantity: 2 }]
    status: 'Pending',
  });
  const [menuItems, setMenuItems] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    if (existingOrder) {
      setFormData(existingOrder);
    }
    fetchMenuItems();
  }, [existingOrder]);

  const fetchMenuItems = async () => {
    try {
      const res = await axios.get('/api/menu');
      setMenuItems(res.data);
    } catch (err) {
      console.error('Failed to fetch menu items:', err);
      setError('Unable to load menu items.');
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleItemChange = (index, field, value) => {
    const updatedItems = [...formData.items];
    updatedItems[index][field] = value;
    setFormData({ ...formData, items: updatedItems });
  };

  const addItem = () => {
    setFormData({ ...formData, items: [...formData.items, { menuItemId: '', quantity: 1 }] });
  };

  const removeItem = (index) => {
    const updatedItems = formData.items.filter((_, i) => i !== index);
    setFormData({ ...formData, items: updatedItems });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    try {
      if (existingOrder) {
        await axios.put(`/api/orders/${existingOrder.id}`, formData);
      } else {
        await axios.post('/api/orders', formData);
      }
      if (onSuccess) onSuccess();
    } catch (err) {
      console.error('Failed to submit order:', err);
      setError('Something went wrong. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit} className="order-form">
      {error && <p className="error">{error}</p>}

      <div>
        <label>Customer ID:</label>
        <input
          type="text"
          name="customerId"
          value={formData.customerId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Table ID:</label>
        <input
          type="text"
          name="tableId"
          value={formData.tableId}
          onChange={handleChange}
          required
        />
      </div>

      <div>
        <label>Status:</label>
        <select name="status" value={formData.status} onChange={handleChange}>
          <option value="Pending">Pending</option>
          <option value="Preparing">Preparing</option>
          <option value="Completed">Completed</option>
        </select>
      </div>

      <div>
        <label>Order Items:</label>
        {formData.items.map((item, index) => (
          <div key={index} className="order-item">
            <select
              value={item.menuItemId}
              onChange={(e) => handleItemChange(index, 'menuItemId', e.target.value)}
              required
            >
              <option value="">Select Menu Item</option>
              {menuItems.map((menuItem) => (
                <option key={menuItem.id} value={menuItem.id}>
                  {menuItem.name}
                </option>
              ))}
            </select>

            <input
              type="number"
              min="1"
              value={item.quantity}
              onChange={(e) => handleItemChange(index, 'quantity', e.target.value)}
              required
            />

            <button type="button" onClick={() => removeItem(index)}>
              Remove
            </button>
          </div>
        ))}
        <button type="button" onClick={addItem}>
          Add Item
        </button>
      </div>

      <button type="submit">{existingOrder ? 'Update' : 'Create'} Order</button>
    </form>
  );
};

export default OrderForm;

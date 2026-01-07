import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams } from 'react-router-dom';

const InventoryForm = () => {
  const [item, setItem] = useState({
    name: '',
    quantity: '',
    unit: '',
    category: '',
    threshold: '',
  });

  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  useEffect(() => {
    if (isEditMode && id) {
      axios.get(`/api/inventory/${id}`)
        .then(res => setItem(res.data))
        .catch(err => console.error('Failed to fetch inventory item:', err));
    }
  }, [id, isEditMode]);

  const handleChange = e => {
    const { name, value } = e.target;
    setItem(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async e => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await axios.put(`/api/inventory/${id}`, item);
      } else {
        await axios.post('/api/inventory', item);
      }
      navigate('/inventory');
    } catch (err) {
      console.error('Failed to submit inventory form:', err);
    }
  };

  return (
    <div className="inventory-form">
      <h2>{isEditMode ? 'Edit Inventory Item' : 'Add New Inventory Item'}</h2>
      <form onSubmit={handleSubmit}>
        <label>
          Name:
          <input name="name" value={item.name} onChange={handleChange} required />
        </label>
        <label>
          Quantity:
          <input type="number" name="quantity" value={item.quantity} onChange={handleChange} required />
        </label>
        <label>
          Unit:
          <input name="unit" value={item.unit} onChange={handleChange} required />
        </label>
        <label>
          Category:
          <input name="category" value={item.category} onChange={handleChange} />
        </label>
        <label>
          Threshold (Min Stock Level):
          <input type="number" name="threshold" value={item.threshold} onChange={handleChange} />
        </label>
        <button type="submit">{isEditMode ? 'Update' : 'Add'} Item</button>
      </form>
    </div>
  );
};

export default InventoryForm;

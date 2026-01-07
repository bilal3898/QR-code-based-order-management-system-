import React, { useState } from 'react';
import axios from 'axios';

const ReservationForm = ({ onSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    contactNumber: '',
    numberOfGuests: '',
    date: '',
    time: '',
    tableNumber: '',
  });

  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    try {
      const response = await axios.post('http://localhost:5000/api/reservations', formData);
      onSuccess && onSuccess(response.data);
      setFormData({
        customerName: '',
        contactNumber: '',
        numberOfGuests: '',
        date: '',
        time: '',
        tableNumber: '',
      });
    } catch (err) {
      console.error(err);
      setError('Failed to create reservation. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="reservation-form">
      <h2>Create Reservation</h2>
      {error && <p className="error">{error}</p>}

      <input
        type="text"
        name="customerName"
        placeholder="Customer Name"
        value={formData.customerName}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="contactNumber"
        placeholder="Contact Number"
        value={formData.contactNumber}
        onChange={handleChange}
        required
      />

      <input
        type="number"
        name="numberOfGuests"
        placeholder="Number of Guests"
        value={formData.numberOfGuests}
        onChange={handleChange}
        required
      />

      <input
        type="date"
        name="date"
        value={formData.date}
        onChange={handleChange}
        required
      />

      <input
        type="time"
        name="time"
        value={formData.time}
        onChange={handleChange}
        required
      />

      <input
        type="text"
        name="tableNumber"
        placeholder="Table Number"
        value={formData.tableNumber}
        onChange={handleChange}
        required
      />

      <button type="submit" disabled={submitting}>
        {submitting ? 'Creating...' : 'Create Reservation'}
      </button>
    </form>
  );
};

export default ReservationForm;

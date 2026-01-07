// src/components/Feedback/FeedbackForm.js

import React, { useState } from 'react';
import axios from 'axios';

const FeedbackForm = ({ onSubmitSuccess }) => {
  const [formData, setFormData] = useState({
    customerName: '',
    message: '',
    rating: 5,
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/feedbacks', formData);
      if (response.status === 201 || response.status === 200) {
        setSuccess('Feedback submitted successfully!');
        setFormData({ customerName: '', message: '', rating: 5 });
        onSubmitSuccess && onSubmitSuccess(); // optional callback
      }
    } catch (err) {
      setError('Failed to submit feedback. Please try again.');
      console.error(err);
    }
  };

  return (
    <div className="feedback-form-container">
      <h2>Submit Feedback</h2>
      {error && <p className="text-red-600">{error}</p>}
      {success && <p className="text-green-600">{success}</p>}
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customerName">Your Name</label>
          <input
            type="text"
            name="customerName"
            id="customerName"
            value={formData.customerName}
            onChange={handleChange}
            required
            className="input input-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="message">Feedback</label>
          <textarea
            name="message"
            id="message"
            value={formData.message}
            onChange={handleChange}
            required
            className="textarea textarea-bordered w-full"
          />
        </div>
        <div>
          <label htmlFor="rating">Rating (1 to 5)</label>
          <input
            type="number"
            name="rating"
            id="rating"
            min="1"
            max="5"
            value={formData.rating}
            onChange={handleChange}
            className="input input-bordered w-full"
          />
        </div>
        <button
          type="submit"
          className="btn btn-primary"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;

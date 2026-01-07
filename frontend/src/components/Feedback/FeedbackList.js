// src/components/Feedback/FeedbackList.js

import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const FeedbackList = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFeedbacks = async () => {
      try {
        const response = await api.get('/feedback');
        setFeedbacks(response.data || []);
      } catch (err) {
        setError('Failed to load feedbacks.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchFeedbacks();
  }, []);

  if (loading) return <p>Loading feedbacks...</p>;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Customer Feedback</h2>
      {feedbacks.length === 0 ? (
        <p>No feedbacks found.</p>
      ) : (
        <ul className="space-y-4">
          {feedbacks.map((feedback) => (
            <li
              key={feedback.id}
              className="bg-white shadow-md rounded p-4 border border-gray-200"
            >
              <p className="text-gray-800">
                <strong>Customer ID:</strong> {feedback.customer_id}
              </p>
              <p className="text-gray-600 mt-2">
                <strong>Feedback:</strong> {feedback.comment}
              </p>
              <p className="text-sm text-gray-500 mt-1">
                <strong>Date:</strong>{' '}
                {new Date(feedback.created_at).toLocaleString()}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default FeedbackList;

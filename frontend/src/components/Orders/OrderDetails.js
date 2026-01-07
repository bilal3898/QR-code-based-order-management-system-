// src/components/Orders/OrderDetails.js

import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const OrderDetails = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError('Failed to fetch order details');
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order details...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="max-w-3xl mx-auto p-4 bg-white shadow rounded-xl mt-6">
      <h2 className="text-2xl font-bold mb-4">Order Details</h2>
      <p><strong>Order ID:</strong> {order.id}</p>
      <p><strong>Customer:</strong> {order.customerName}</p>
      <p><strong>Status:</strong> {order.status}</p>
      <p><strong>Total:</strong> ₹{order.total}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Items</h3>
      <ul className="space-y-2">
        {order.items?.map((item, index) => (
          <li key={index} className="border p-2 rounded">
            {item.name} - ₹{item.price} × {item.quantity}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default OrderDetails;

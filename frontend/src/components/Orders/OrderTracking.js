import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const OrderTracking = () => {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        const response = await axios.get(`/api/orders/${orderId}`);
        setOrder(response.data);
      } catch (err) {
        setError("Failed to fetch order status.");
      } finally {
        setLoading(false);
      }
    };

    fetchOrder();
  }, [orderId]);

  if (loading) return <p>Loading order status...</p>;
  if (error) return <p className="text-red-500">{error}</p>;
  if (!order) return <p>No order found.</p>;

  return (
    <div className="max-w-xl mx-auto p-4 bg-white rounded shadow-md">
      <h2 className="text-xl font-bold mb-4">Order #{order.id} Status</h2>
      <ul className="list-disc list-inside mb-4">
        <li><strong>Customer:</strong> {order.customerName}</li>
        <li><strong>Status:</strong> {order.status}</li>
        <li><strong>Items:</strong></li>
        <ul className="list-inside ml-6">
          {order.items.map((item, index) => (
            <li key={index}>{item.name} x {item.quantity}</li>
          ))}
        </ul>
        <li><strong>Total:</strong> ₹{order.total}</li>
      </ul>
    </div>
  );
};

export default OrderTracking;

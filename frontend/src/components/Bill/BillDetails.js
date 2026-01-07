import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const BillDetails = () => {
  const { billId } = useParams();
  const [bill, setBill] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBill = async () => {
      try {
        const response = await axios.get(`/api/bills/${billId}`);
        setBill(response.data);
      } catch (err) {
        setError('Failed to fetch bill details.');
        console.error(err);
      }
    };

    if (billId) {
      fetchBill();
    }
  }, [billId]);

  if (error) return <div className="text-red-500 p-4">{error}</div>;
  if (!bill) return <div className="p-4">Loading bill details...</div>;

  return (
    <div className="p-6 max-w-3xl mx-auto bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Bill Details - #{bill.id}</h2>
      <p><strong>Customer:</strong> {bill.customerName}</p>
      <p><strong>Table:</strong> {bill.tableNumber}</p>
      <p><strong>Date:</strong> {new Date(bill.createdAt).toLocaleString()}</p>

      <h3 className="text-xl font-semibold mt-6 mb-2">Items</h3>
      <ul className="list-disc list-inside">
        {bill.items.map((item, index) => (
          <li key={index}>
            {item.name} - ₹{item.price} x {item.quantity}
          </li>
        ))}
      </ul>

      <div className="mt-4 border-t pt-4">
        <p><strong>Total Amount:</strong> ₹{bill.totalAmount}</p>
        <p><strong>Status:</strong> {bill.status}</p>
      </div>
    </div>
  );
};

export default BillDetails;

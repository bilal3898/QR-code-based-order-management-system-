import React, { useEffect, useState } from 'react';
import api from '../../services/api';
import { Link } from 'react-router-dom';

const BillList = () => {
  const [bills, setBills] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBills();
  }, []);

  const fetchBills = async () => {
    try {
      const response = await api.get('/bills');
      setBills(response.data || []);
    } catch (err) {
      setError('Failed to load bills.');
      console.error(err);
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Bills</h2>
      {error && <p className="text-red-600">{error}</p>}
      <table className="min-w-full bg-white shadow rounded">
        <thead className="bg-gray-200">
          <tr>
            <th className="py-2 px-4 text-left">Bill ID</th>
            <th className="py-2 px-4 text-left">Order ID</th>
            <th className="py-2 px-4 text-left">Amount</th>
            <th className="py-2 px-4 text-left">Date</th>
            <th className="py-2 px-4 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {bills.map((bill) => (
            <tr key={bill.id} className="border-t">
              <td className="py-2 px-4">{bill.id}</td>
              <td className="py-2 px-4">{bill.order_id}</td>
              <td className="py-2 px-4">₹{bill.total_amount}</td>
              <td className="py-2 px-4">{new Date(bill.created_at).toLocaleString()}</td>
              <td className="py-2 px-4">
                <Link
                  to={`/bill/${bill.id}`}
                  className="text-blue-500 hover:underline"
                >
                  View
                </Link>
              </td>
            </tr>
          ))}
          {bills.length === 0 && (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No bills available.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default BillList;

import React, { useEffect, useState } from 'react';
import api from '../../services/api';

const ReservationList = () => {
  const [reservations, setReservations] = useState([]);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReservations();
  }, []);

  const fetchReservations = async () => {
    try {
      const response = await api.get('/reservations');
      setReservations(response.data || []);
    } catch (err) {
      console.error('Error fetching reservations:', err);
      setError('Failed to fetch reservations.');
    }
  };

  return (
    <div className="p-4">
      <h2 className="text-xl font-semibold mb-4">Reservation List</h2>
      {error && <p className="text-red-600">{error}</p>}
      {reservations.length > 0 ? (
        <table className="min-w-full bg-white border border-gray-200 shadow">
          <thead>
            <tr className="bg-gray-100 text-left">
              <th className="py-2 px-4 border-b">Customer</th>
              <th className="py-2 px-4 border-b">Contact</th>
              <th className="py-2 px-4 border-b">Guests</th>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Time</th>
              <th className="py-2 px-4 border-b">Table</th>
            </tr>
          </thead>
          <tbody>
            {reservations.map((res) => (
              <tr key={res.id} className="hover:bg-gray-50">
                <td className="py-2 px-4 border-b">{res.customerName}</td>
                <td className="py-2 px-4 border-b">{res.contactNumber}</td>
                <td className="py-2 px-4 border-b">{res.numberOfGuests}</td>
                <td className="py-2 px-4 border-b">{res.date}</td>
                <td className="py-2 px-4 border-b">{res.time}</td>
                <td className="py-2 px-4 border-b">{res.tableNumber}</td>
              </tr>
            ))}
          </tbody>
        </table>
      ) : (
        <p className="text-gray-600">No reservations found.</p>
      )}
    </div>
  );
};

export default ReservationList;

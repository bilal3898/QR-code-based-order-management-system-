import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';

const ReservationDetails = () => {
  const { reservationId } = useParams();
  const [reservation, setReservation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchReservationDetails = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_API_URL}/reservations/${reservationId}`);
        setReservation(response.data);
      } catch (err) {
        setError('Failed to fetch reservation details.');
      } finally {
        setLoading(false);
      }
    };

    fetchReservationDetails();
  }, [reservationId]);

  if (loading) return <p>Loading reservation details...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!reservation) return <p>No reservation found.</p>;

  return (
    <div className="p-6 bg-white shadow-md rounded-lg max-w-lg mx-auto">
      <h2 className="text-2xl font-bold mb-4">Reservation Details</h2>
      <ul className="space-y-2">
        <li><strong>Name:</strong> {reservation.customer_name}</li>
        <li><strong>Table:</strong> {reservation.table_number}</li>
        <li><strong>Date:</strong> {new Date(reservation.date).toLocaleDateString()}</li>
        <li><strong>Time:</strong> {reservation.time}</li>
        <li><strong>Guests:</strong> {reservation.guests}</li>
        <li><strong>Status:</strong> {reservation.status}</li>
        {reservation.notes && <li><strong>Notes:</strong> {reservation.notes}</li>}
      </ul>
    </div>
  );
};

export default ReservationDetails;

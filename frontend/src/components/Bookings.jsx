import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Bookings = () => {
  const [bookings, setBookings] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBookings = async () => {
      const token = localStorage.getItem('access_token');
      if (!token) {
        navigate('/login');
        return;
      }
      
      try {
        const response = await api.get('/bookings/');
        setBookings(response.data);
      } catch (error) {
        console.error('Error fetching bookings:', error);
        if (error.response && error.response.status === 401) {
          navigate('/login');
        }
      }
    };
    fetchBookings();
  }, [navigate]);

  const handleCancel = async (id) => {
    try {
      await api.patch(`/bookings/${id}/`, { status: 'cancelled' });
      setBookings(bookings.map(booking => booking.id === id ? { ...booking, status: 'cancelled' } : booking));
    } catch (error) {
      console.error('Error cancelling booking:', error);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">My Bookings</h1>
      <div className="space-y-4">
        {bookings.map((booking) => (
          <div key={booking.id} className="bg-white rounded-lg shadow-md p-6">
            <div className="flex justify-between items-start">
              <div>
                <h2 className="text-xl font-semibold mb-2">{booking.hotel.name}</h2>
                <p className="text-gray-600 mb-2">{booking.hotel.location}</p>
                <p className="text-gray-700 mb-2">Check-in: {booking.check_in}</p>
                <p className="text-gray-700 mb-2">Check-out: {booking.check_out}</p>
                <p className="text-gray-800 font-bold mb-2">Total Price: ${booking.total_price}</p>
                <p className={`text-sm font-medium ${booking.status === 'confirmed' ? 'text-green-600' : booking.status === 'cancelled' ? 'text-red-600' : 'text-yellow-600'}`}>
                  Status: {booking.status}
                </p>
              </div>
              {booking.status === 'pending' && (
                <button
                  onClick={() => handleCancel(booking.id)}
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700"
                >
                  Cancel
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Bookings;

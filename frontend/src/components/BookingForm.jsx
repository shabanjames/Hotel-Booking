import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../api';
import dayjs from 'dayjs';

const BookingForm = () => {
  const { hotelId } = useParams();
  const navigate = useNavigate();
  const [hotel, setHotel] = useState(null);
  const [checkIn, setCheckIn] = useState('');
  const [checkOut, setCheckOut] = useState('');
  const [totalPrice, setTotalPrice] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [bookingLoading, setBookingLoading] = useState(false);

  useEffect(() => {
    const fetchHotel = async () => {
      try {
        const response = await api.get(`/hotels/${hotelId}/`);
        setHotel(response.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching hotel:', err);
        setError('Failed to load hotel details');
        setLoading(false);
      }
    };

    if (hotelId) {
      fetchHotel();
    }
  }, [hotelId]);

  const calculatePrice = () => {
    if (checkIn && checkOut && hotel) {
      const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
      if (nights > 0) {
        setTotalPrice(nights * parseFloat(hotel.price_per_night));
      } else {
        setTotalPrice(0);
      }
    } else {
      setTotalPrice(0);
    }
  };

  useEffect(() => {
    calculatePrice();
  }, [checkIn, checkOut, hotel]);

  const handleBooking = async () => {
    const token = localStorage.getItem('access_token');
    if (!token) {
      alert('Please login to book a hotel');
      navigate('/login');
      return;
    }

    if (!checkIn || !checkOut) {
      alert('Please select check-in and check-out dates');
      return;
    }

    const nights = dayjs(checkOut).diff(dayjs(checkIn), 'day');
    if (nights <= 0) {
      alert('Check-out date must be after check-in date');
      return;
    }

    setBookingLoading(true);
    try {
      await api.post('/bookings/', {
        hotel_id: parseInt(hotelId),
        check_in: checkIn,
        check_out: checkOut,
      });
      alert('Booking successful!');
      navigate('/bookings');
    } catch (err) {
      console.error('Error creating booking:', err);
      alert('Booking failed. Please try again.');
    } finally {
      setBookingLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/hotels');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-xl text-gray-600">Loading...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <p>{error}</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  if (!hotel) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <p>Hotel not found</p>
          <button
            onClick={handleBack}
            className="mt-4 bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
          >
            Back to Hotels
          </button>
        </div>
      </div>
    );
  }

  // Get today's date in YYYY-MM-DD format for min date
  const today = dayjs().format('YYYY-MM-DD');

  return (
    <div className="container mx-auto px-4 py-8">
      <button
        onClick={handleBack}
        className="mb-4 text-indigo-600 hover:text-indigo-800 flex items-center"
      >
        ← Back to Hotels
      </button>

      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-md overflow-hidden">
        {/* Hotel Details Section */}
        <div className="bg-indigo-600 px-6 py-4">
          <h1 className="text-2xl font-bold text-white">{hotel.name}</h1>
          <p className="text-indigo-200">{hotel.location}</p>
        </div>

        <div className="p-6">
          {hotel.image && (
            <img
              src={hotel.image}
              alt={hotel.name}
              className="w-full h-64 object-cover rounded-md mb-6"
            />
          )}

          <div className="mb-6">
            <p className="text-gray-700 text-lg mb-2">{hotel.description}</p>
            <p className="text-2xl font-bold text-indigo-600">
              ${hotel.price_per_night} <span className="text-base font-normal text-gray-500">per night</span>
            </p>
          </div>

          {/* Booking Form Section */}
          <div className="border-t border-gray-200 pt-6">
            <h2 className="text-xl font-semibold mb-4">Book Your Stay</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Check-in Date
                </label>
                <input
                  type="date"
                  value={checkIn}
                  min={today}
                  onChange={(e) => setCheckIn(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>

              <div>
                <label className="block text-gray-700 mb-2 font-medium">
                  Check-out Date
                </label>
                <input
                  type="date"
                  value={checkOut}
                  min={checkIn || today}
                  onChange={(e) => setCheckOut(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
                />
              </div>
            </div>

            {/* Price Calculation */}
            {checkIn && checkOut && totalPrice > 0 && (
              <div className="bg-gray-50 rounded-lg p-4 mb-6">
                <div className="flex justify-between items-center mb-2">
                  <span className="text-gray-600">
                    ${hotel.price_per_night} x{' '}
                    {dayjs(checkOut).diff(dayjs(checkIn), 'day')} nights
                  </span>
                  <span className="text-gray-800">${totalPrice.toFixed(2)}</span>
                </div>
                <div className="flex justify-between items-center pt-2 border-t border-gray-200">
                  <span className="text-lg font-semibold">Total Price</span>
                  <span className="text-lg font-bold text-indigo-600">
                    ${totalPrice.toFixed(2)}
                  </span>
                </div>
              </div>
            )}

            {checkIn && checkOut && totalPrice <= 0 && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
                Please select valid check-in and check-out dates
              </div>
            )}

            {/* Book Button */}
            <button
              onClick={handleBooking}
              disabled={bookingLoading || !checkIn || !checkOut || totalPrice <= 0}
              className={`w-full py-3 px-4 rounded-md font-semibold text-white transition-colors ${
                bookingLoading || !checkIn || !checkOut || totalPrice <= 0
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-700'
              }`}
            >
              {bookingLoading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingForm;

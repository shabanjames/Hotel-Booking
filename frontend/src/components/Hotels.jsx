import React from 'react';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const Hotels = () => {
  const navigate = useNavigate();
  const [hotels, setHotels] = useState([]);

  useEffect(() => {
    const fetchHotels = async () => {
      // 🔥 DEBUG TOKEN
      console.log("TOKEN:", localStorage.getItem('access_token'));

      try {
        const response = await api.get('/hotels/');
        setHotels(response.data);
      } catch (error) {
        console.error('Error fetching hotels:', error);
      }
    };

    fetchHotels();
  }, []);

  const handleBookClick = (hotelId) => {
    navigate(`/book/${hotelId}`);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-8">Hotels</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {hotels.map((hotel) => (
          <div key={hotel.id} className="bg-white rounded-lg shadow-md p-6">
            {hotel.image && (
              <img
                src={hotel.image}
                alt={hotel.name}
                className="w-full h-48 object-cover rounded-md mb-4"
              />
            )}
            <h2 className="text-xl font-semibold mb-2">{hotel.name}</h2>
            <p className="text-gray-600 mb-2">{hotel.location}</p>
            <p className="text-gray-800 font-bold mb-4">
              ${hotel.price_per_night} per night
            </p>
            <p className="text-gray-700 mb-4">{hotel.description}</p>
            <button
              onClick={() => handleBookClick(hotel.id)}
              className="bg-indigo-600 text-white px-4 py-2 rounded-md hover:bg-indigo-700"
            >
              Book Now
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Hotels;

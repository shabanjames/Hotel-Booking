import React from 'react';
const Hero = () => {
  console.log('Hero component rendered');
  return (
    <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white">
      <div className="container mx-auto px-4 py-20">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-4">Welcome to Hotel Booking</h1>
          <p className="text-xl mb-8">Find and book the perfect hotel for your stay</p>
          <button
            onClick={() => window.location.href='/login'}
            className="bg-white text-blue-600 px-8 py-3 rounded-lg font-semibold hover:bg-gray-100 transition duration-300"
          >
            Get Started
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import Login from './components/Login';
import Register from './components/Register';
import Hotels from './components/Hotels';
import Bookings from './components/Bookings';
import BookingForm from './components/BookingForm';
import Hero from './components/Hero';

function App() {
  console.log('App component rendered');
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  useEffect(() => {
    console.log('App useEffect running');
    const token = localStorage.getItem('access_token');
    if (token) {
      setIsAuthenticated(true);
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    setIsAuthenticated(false);
  };

  return (
    <Router>
      <div className="App">
        <nav className="bg-indigo-600 p-4">
          <div className="container mx-auto flex justify-between items-center">
            <h1 className="text-white text-xl font-bold">Hotel Booking</h1>
            <div>
              {isAuthenticated ? (
                <>
                  <button onClick={() => window.location.href='/hotels'} className="text-white mr-4">Hotels</button>
                  <button onClick={() => window.location.href='/bookings'} className="text-white mr-4">Bookings</button>
                  <button onClick={handleLogout} className="text-white">Logout</button>
                </>
              ) : (
                <>
                  <button onClick={() => window.location.href='/login'} className="text-white mr-4">Login</button>
                  <button onClick={() => window.location.href='/register'} className="text-white">Register</button>
                </>
              )}
            </div>
          </div>
        </nav>
        <Routes>
          <Route path="/" element={<Hero />} />
          <Route path="/login" element={isAuthenticated ? <Navigate to="/hotels" /> : <Login setIsAuthenticated={setIsAuthenticated} />} />
          <Route path="/register" element={isAuthenticated ? <Navigate to="/hotels" /> : <Register />} />
          <Route path="/hotels" element={isAuthenticated ? <Hotels /> : <Navigate to="/login" />} />
          <Route path="/bookings" element={isAuthenticated ? <Bookings /> : <Navigate to="/login" />} />
          <Route path="/book/:hotelId" element={isAuthenticated ? <BookingForm /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

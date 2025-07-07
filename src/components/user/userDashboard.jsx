import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom"; // Import useNavigate
import axios from "axios";
import BarberCard from "./barberCard";
import ReviewForm from "./review/reviewForm";
import { motion } from "framer-motion";
import AllReviews from "./review/allReview";
import Icon from "../iconAuth/navbar";
import PaymentCheck from "../payments/paymentCheck";
import Cookies from "js-cookie";

const UserDashboard = () => {
  const navigate = useNavigate(); // Initialize navigate hook
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState(null);
  const [userLocation, setUserLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const paymentCheckRef = useRef(null);
  const [showPaymentCheck, setShowPaymentCheck] = useState(false);

  // Fetch token and other user details from cookies
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const userName = Cookies.get("username");
  const userRole = Cookies.get("userRole");

  // Calculate distance using Haversine formula
  const haversine = (lat1, lon1, lat2, lon2) => {
    const toRad = (value) => (value * Math.PI) / 180;
    const R = 6371; // Earth radius in kilometers
    const dLat = toRad(lat2 - lat1);
    const dLon = toRad(lon2 - lon1);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(toRad(lat1)) *
        Math.cos(toRad(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Returns distance in kilometers
  };

  // Fetch barbers data
  const fetchBarbers = async () => {
    setLoading(true);
    try {
      const response = await axios.get("http://localhost:5001/api/barbers", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setBarbers(response.data || []);
      setLoading(false);
    } catch (err) {
      setError("Tidak dapat mengambil daftar barber. Coba lagi nanti.");
      setLoading(false);
    }
  };

  // Fetch reviews data for a specific barber
  const fetchReviews = async (barberId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/reviews/${barberId}`
      );
      setReviews(response.data || []);
    } catch (err) {
      setError("Gagal mengambil review. Coba lagi nanti.");
    }
  };

  // Handle barber selection without scrolling
  const handleSelectBarber = (barberId) => {
    const selected = barbers.find((barber) => barber.id === barberId);
    setSelectedBarber(selected);
    fetchReviews(barberId);
  };

  // Get user location
  const getUserLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setUserLocation({ latitude, longitude });
        },
        () => {
          setError("Gagal mendapatkan lokasi pengguna.");
        }
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  };

  // Handle user logout
  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("userRole");
    window.location.href = "/";
  };

  // Fetch data on component mount
  useEffect(() => {
    if (token) {
      fetchBarbers();
    } else {
      setError("Anda perlu login untuk melihat barber.");
      setLoading(false);
    }
    getUserLocation();
  }, [token]);

  const scrollToPayment = () => {
    setShowPaymentCheck((prevState) => !prevState);

    // Add a slight delay before scrolling to allow state change to be reflected
    setTimeout(() => {
      if (paymentCheckRef.current) {
        paymentCheckRef.current.scrollIntoView({
          behavior: "smooth",
          block: "start",
        });
      }
    }, 100);
  };

  // Sort barbers by distance
  const sortedBarbers = barbers
    .filter((barber) => userLocation)
    .map((barber) => {
      const distance = haversine(
        userLocation.latitude,
        userLocation.longitude,
        barber.latitude,
        barber.longitude
      );
      return { ...barber, distance };
    })
    .sort((a, b) => a.distance - b.distance);

  // Check if the payment status is successful
  const handlePaymentSuccess = () => {
    navigate("/profile"); // Redirect to the profile page
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8">
          Dashboard Pengguna
        </h1>
        <div className="text-center text-gray-500">Memuat data...</div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        {/* Render the Icon component */}
        <Icon
          userName={userName}
          role={userRole}
          onClick={scrollToPayment}
          onLogout={handleLogout}
        />

        <div ref={paymentCheckRef}>
          {showPaymentCheck && (
            <PaymentCheck onSuccess={handlePaymentSuccess} />
          )}
        </div>

        <h1 className="text-4xl font-bold text-center text-gray-800 mb-8 mt-6">
          Selamat datang
        </h1>

        <div className="text-3xl font-semibold text-bold mt-10 text-center">
          Rekomendasi Barber Terdekatmu
        </div>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-10">
          {sortedBarbers.length > 0 ? (
            sortedBarbers.map((barber, index) => (
              <motion.div
                key={`${barber.id}-${index}`} // Ensure a unique key
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.5 }}
              >
                <BarberCard
                  barber={barber}
                  onSelectBarber={() => handleSelectBarber(barber.id)}
                  userLocation={userLocation}
                />
              </motion.div>
            ))
          ) : (
            <p className="col-span-3 text-center text-gray-500">
              Tidak ada barber yang tersedia
            </p>
          )}
        </div>

        {selectedBarber && (
          <div className="mt-10 bg-white shadow-lg rounded-lg p-6">
            <h2 className="text-2xl font-semibold text-gray-800">
              {selectedBarber.name}
            </h2>

            <div className="mt-5">
              <ReviewForm
                barberId={selectedBarber.id}
                onReviewAdded={() => fetchReviews(selectedBarber.id)}
              />
            </div>

            <div>
              <AllReviews />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default UserDashboard;

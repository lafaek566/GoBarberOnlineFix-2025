import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { AiOutlineClockCircle } from "react-icons/ai";

const PromoPage = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [countdown, setCountdown] = useState(3600);
  const navigate = useNavigate();

  useEffect(() => {
    if (countdown === 0) return;
    const intervalId = setInterval(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);
    return () => clearInterval(intervalId);
  }, [countdown]);

  const handleClaimBonus = () => {
    if (!isLoggedIn) {
      const userConfirmed = window.confirm(
        "You need to log in to order. Do you want to log in now?"
      );
      if (userConfirmed) {
        navigate("/login");
      } else {
        alert("You can order after logging in !");
      }
    } else {
      alert("You've claimed your bonus!");
    }
  };

  const formatTime = (time) => {
    const hours = Math.floor(time / 3600);
    const minutes = Math.floor((time % 3600) / 60);
    const seconds = time % 60;
    return `${String(hours).padStart(2, "0")}:${String(minutes).padStart(
      2,
      "0"
    )}:${String(seconds).padStart(2, "0")}`;
  };

  return (
    <div
      className="promo-page py-16 mt-20 bg-cover bg-center rounded-3xl"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/474x/e8/2a/98/e82a989a64c45ab830bed112ab35d39a.jpg')",
      }}
    >
      <div className="max-w-screen-lg mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center">
          {/* Animasi Judul */}
          <motion.h1
            className="text-5xl font-extrabold text-white mb-4"
            initial={{ opacity: 0, y: -50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            Exclusive Promotion Just for You!
          </motion.h1>

          <motion.p
            className="text-lg text-white mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Claim your bonus by registering or logging in now! Hurry, limited
            time offer.
          </motion.p>

          {/* Countdown Timer dengan Ikon Jam & Animasi */}
          <motion.div
            className="flex items-center justify-center bg-gradient-to-r from-gray-500 text-white p-3 rounded-lg shadow-3xl mb-8"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            {/* Ikon Jam dengan Animasi Rotasi */}
            <motion.div
              animate={{ static: 30 }}
              transition={{ repeat: Infinity, duration: 10, ease: "linear" }}
            >
              <AiOutlineClockCircle className="text-4xl mr-3 text-white" />
            </motion.div>

            <div>
              <h2 className="text-2xl font-bold mb-1">Hurry, offer ends in:</h2>
              <motion.p
                key={countdown}
                className="text-xl font-semibold"
                initial={{ opacity: 0, scale: 0.5 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                {formatTime(countdown)}
              </motion.p>
            </div>
          </motion.div>

          {/* Promotion Content */}
          <motion.div
            className="bg-gray-300 bg-opacity-50 text-gray-900 p-8 rounded-lg shadow-2xl"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.9 }}
          >
            <h2 className="text-3xl font-bold mb-4">
              Claim Your Haircut & Beard Package
            </h2>
            <p className="text-xl mb-6">
              Sign up today and receive an exclusive bonus! Don’t miss out on
              this great offer. Limited time only!
            </p>

            {/* Gambar dengan Animasi */}
            <motion.div
              className="mb-6"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 1.2 }}
            >
              <img
                src="https://i.pinimg.com/474x/ac/eb/99/aceb992206b78f7b8692d44ef886e14b.jpg"
                alt="Haircut & Beard Package"
                className="mx-auto rounded-lg shadow-lg transform transition duration-500 hover:scale-105"
              />
            </motion.div>

            {/* Tombol dengan Animasi */}
            <motion.button
              onClick={handleClaimBonus}
              className="bg-yellow-500 hover:bg-white-500 text-white py-2 px-6 rounded-3xl transition duration-300 transform hover:scale-105"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              Order Now
            </motion.button>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

export default PromoPage;

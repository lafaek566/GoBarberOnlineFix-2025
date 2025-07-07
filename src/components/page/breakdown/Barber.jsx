import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FaStar, FaMapMarkerAlt } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // ✅ Tambahkan ini

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const Barbers = () => {
  const [allBarbers, setAllBarbers] = useState([]);
  const [bookedBarberIds, setBookedBarberIds] = useState([]);
  const [userLocation, setUserLocation] = useState(null);
  const [distanceFilter, setDistanceFilter] = useState("all");
  const token = Cookies.get("token");
  const userId = Cookies.get("userId");
  const navigate = useNavigate();

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      },
      (err) => {
        console.warn("Lokasi tidak tersedia:", err.message);
      }
    );
  }, []);

  useEffect(() => {
    const fetchBarbersAndBookings = async () => {
      try {
        const barberResponse = await axios.get(
          "http://localhost:5001/api/barbers"
        );
        let barbers = barberResponse.data || [];

        if (userLocation) {
          barbers = barbers.map((barber) => {
            const distance = calculateDistance(
              userLocation.latitude,
              userLocation.longitude,
              barber.latitude,
              barber.longitude
            );
            return { ...barber, distance };
          });
          barbers.sort((a, b) => a.distance - b.distance);
        }

        setAllBarbers(barbers);

        if (token && userId) {
          const bookingResponse = await axios.get(
            `http://localhost:5001/api/bookings/user/${userId}`,
            {
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          const bookings = bookingResponse.data || [];
          const barberIds = bookings.map((b) => b.barber?.id).filter(Boolean);
          setBookedBarberIds(barberIds);
        }
      } catch (err) {
        console.error("Gagal memuat data barber.");
      }
    };

    if (userLocation) {
      fetchBarbersAndBookings();
    }
  }, [token, userId, userLocation]);

  const handleBooking = (barberId) => {
    if (!token) {
      Swal.fire({
        title: "Login diperlukan",
        text: "Silakan login untuk melakukan booking.",
        icon: "info",
        confirmButtonText: "Login Sekarang",
        confirmButtonColor: "#000000",
      }).then((result) => {
        if (result.isConfirmed) {
          navigate("/login");
        }
      });
    } else {
      navigate(`/book/${barberId}`);
    }
  };

  const filteredBarbers = allBarbers.filter(
    (barber) =>
      !bookedBarberIds.includes(barber.id) &&
      (distanceFilter === "all" ||
        (barber.distance !== undefined &&
          barber.distance <= Number(distanceFilter)))
  );

  const noBarberInRadius =
    filteredBarbers.length === 0 && distanceFilter !== "all";
  const barbersToShow = noBarberInRadius
    ? allBarbers.filter((b) => !bookedBarberIds.includes(b.id))
    : filteredBarbers;

  const getGoogleMapsLink = (barber) =>
    `https://www.google.com/maps/dir/?api=1&destination=${barber.latitude},${barber.longitude}&travelmode=driving`;

  return (
    <div className="px-4 sm:px-6 md:px-8 max-w-7xl mx-auto mt-20">
      <h1 className="text-3xl font-bold text-center mb-10 dark:text-white">
        Barber Terdekat
      </h1>

      {/* Filter */}
      <div className="max-w-md mx-auto mb-10 flex justify-center space-x-4 bg-white dark:bg-gray-800 p-4 rounded-3xl shadow-md ring-1 ring-gray-200 dark:ring-gray-700">
        <label
          htmlFor="distanceFilter"
          className="font-semibold text-gray-700 dark:text-gray-300 self-center"
        >
          Filter Jarak:
        </label>
        <select
          id="distanceFilter"
          value={distanceFilter}
          onChange={(e) => setDistanceFilter(e.target.value)}
          className="bg-blue-50 dark:bg-blue-900 text-blue-900 dark:text-blue-300 font-semibold rounded-xl px-3 py-1 focus:outline-none focus:ring-2 focus:ring-blue-400 transition"
        >
          <option value="all">Semua</option>
          <option value="1">Dalam 1 km</option>
          <option value="5">Dalam 5 km</option>
          <option value="10">Dalam 10 km</option>
          <option value="20">Dalam 20 km</option>
        </select>
      </div>

      {/* Jika tidak ada barber */}
      {noBarberInRadius && (
        <div className="max-w-md mx-auto mb-8 p-4 bg-yellow-100 dark:bg-yellow-900 text-yellow-800 dark:text-yellow-200 rounded-3xl shadow text-center">
          <p>
            Tidak ada barber dalam radius <strong>{distanceFilter} km</strong>.
          </p>
          <button
            onClick={() => setDistanceFilter("all")}
            className="mt-3 px-6 py-2 bg-blue-600 text-white rounded-3xl hover:bg-blue-700 transition"
          >
            Tampilkan Semua Barber
          </button>
        </div>
      )}

      {/* Daftar Barber */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 justify-items-center">
        {barbersToShow.length > 0 ? (
          barbersToShow.map((barber, index) => (
            <motion.div
              key={barber.id}
              className="bg-white dark:bg-gray-700 dark:text-white p-5 rounded-3xl shadow-md w-full max-w-[240px] flex flex-col"
              style={{ minHeight: 480 }}
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * index, duration: 0.4 }}
              whileHover={{
                scale: 1.05,
                boxShadow: "0 0 15px rgba(59,130,246,0.6)",
              }}
            >
              <img
                src={`http://localhost:5001${barber.profile_image}`}
                alt={barber.name}
                className="w-28 h-28 rounded-full mx-auto mb-4 object-cover"
              />
              <h2 className="text-lg font-semibold text-center mb-2">
                {barber.name}
              </h2>

              {barber.distance !== undefined && (
                <p className="text-center text-sm text-white mb-2">
                  Jarak: {barber.distance.toFixed(2)} km
                </p>
              )}

              <a
                href={getGoogleMapsLink(barber)}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center mb-3 text-white hover:underline font-semibold"
              >
                <FaMapMarkerAlt className="mr-1 text-white" />
                Lihat Rute
              </a>

              <div className="flex-grow overflow-hidden mb-3">
                <p className="text-center text-gray-500 dark:text-gray-300 text-sm line-clamp-3">
                  {barber.services}
                </p>
                <p className="text-center text-xs text-gray-400 mt-1 line-clamp-2">
                  Paket: {barber.paket_description}
                </p>
              </div>

              <div className="flex justify-center mb-3">
                {[...Array(5)].map((_, i) => (
                  <FaStar
                    key={i}
                    className={`${
                      i < barber.rating ? "text-yellow-500" : "text-gray-300"
                    }`}
                  />
                ))}
              </div>

              <button
                onClick={() => handleBooking(barber.id)}
                className="w-full py-2 bg-blue-600 text-white rounded-2xl shadow hover:bg-blue-700 transition"
              >
                Booking
              </button>
            </motion.div>
          ))
        ) : (
          <p className="text-gray-500 dark:text-gray-400 text-center w-full">
            Tidak ada barber baru yang tersedia untuk booking.
          </p>
        )}
      </div>
    </div>
  );
};

export default Barbers;

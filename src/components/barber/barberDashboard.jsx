import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import BarberForm from "./barberForm";
import axios from "axios";
import { motion } from "framer-motion";
import Cookies from "js-cookie";
import Icon from "../iconAuth/navbar";
import AllReviews from "./confirm user/allReviews";

const BarberDashboard = () => {
  const [editingBarberId, setEditingBarberId] = useState(null);
  const [error, setError] = useState("");
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [activeTab, setActiveTab] = useState("bookings"); // Track active tab
  const [barbers, setBarbers] = useState([]); // List of barbers
  const [searchQuery, setSearchQuery] = useState(""); // Search query
  const [showBarbers, setShowBarbers] = useState(false); // Show barbers on search

  const [enteredPassword, setEnteredPassword] = useState("");
  const [passwordError, setPasswordError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token") || localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: No token provided");
      return;
    }

    axios
      .get("http://localhost:5001/api/barbers/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBarbers(response.data); // Set fetched barbers
      })
      .catch((err) => {
        setError(`Error fetching barbers: ${err.message}`);
      });
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userRole");
    Cookies.remove("adminName");
    localStorage.removeItem("token");
    navigate("/"); // Redirect to login
  };

  const handleTabClick = (tab) => {
    setActiveTab(tab);
  };

  // Filter barbers based on search query
  const filteredBarbers = barbers.filter(
    (barber) => barber.name.toLowerCase() === searchQuery.toLowerCase()
  );

  // Show barbers when search query is typed
  useEffect(() => {
    setShowBarbers(!!searchQuery);
  }, [searchQuery]);

  return (
    <div className="min-h-screen bg-gray-100 py-10 px-6 md:px-8">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <Icon userName="barber" role="barber" onLogout={handleLogout} />

        {/* Center the title */}
        <div className="flex justify-center items-center mb-8 mt-10">
          <h1 className="text-center text-4xl font-semibold text-blue-700">
            Barber Dashboard
          </h1>
        </div>

        {error && (
          <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-6 text-center">
            {error}
          </div>
        )}

        {/* Search form for filtering barbers */}
        <div className="text-center mb-8">
          <p className="text-sm text-gray-500 mb-2">
            Please enter the full name of the barber for accurate search
            results.
          </p>
          <input
            type="text"
            placeholder="Search for a barber..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="px-6 py-3 rounded-lg border border-gray-300 text-lg w-full md:w-1/2 mx-auto"
          />
        </div>

        {/* Display barbers based on search query */}
        {showBarbers && (
          <div className="text-center mb-6">
            {filteredBarbers.length > 0 ? (
              filteredBarbers.map((barber) => (
                <Link
                  key={barber.id}
                  to={`/barber/${barber.id}`}
                  className="px-6 py-3 rounded-lg mx-2 text-lg font-semibold text-blue-600"
                >
                  {barber.name}
                </Link>
              ))
            ) : (
              <div className="text-red-500">No barbers found.</div>
            )}
          </div>
        )}

        {/* Navbar for selecting tabs */}
        <div className="flex justify-center mb-8 mt-10 space-x-4">
          {/* <Link
            to="/bookings"
            className="px-6 py-3 rounded-lg text-lg font-semibold bg-blue-600 text-white"
          >
            Booking List
          </Link>
          <Link
            to="/payments"
            className="px-6 py-3 rounded-lg text-lg font-semibold bg-gray-200 text-gray-800"
          >
            Payment List
          </Link> */}
          <button
            onClick={() => handleTabClick("reviews")}
            className="px-6 py-3 rounded-lg text-lg font-semibold bg-green-600 text-white"
          >
            All Reviews
          </button>
        </div>

        {/* Conditional rendering based on activeTab */}
        {activeTab === "reviews" && <AllReviews />}

        {/* Add/Edit Barber form */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          <div className="bg-white shadow-xl rounded-xl p-8">
            <h2 className="text-3xl font-semibold text-gray-800 mb-6">
              {editingBarberId ? "Edit Barber" : "Add Barber"}
            </h2>
            <BarberForm barberId={editingBarberId} />
          </div>
        </div>

        {/* Display selected barber's location */}
        {selectedBarber && (
          <div className="mt-12 bg-white p-8 rounded-xl shadow-xl">
            <h3 className="text-3xl font-semibold text-gray-800 mb-6">
              {selectedBarber.name}'s Location
            </h3>
            {/* Map or location */}
          </div>
        )}
      </motion.div>
    </div>
  );
};

export default BarberDashboard;

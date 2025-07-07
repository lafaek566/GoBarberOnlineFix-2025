import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import Icon from "../iconAuth/navbar";

const AdminDashboard = () => {
  const navigate = useNavigate();
  const userName = "Admin";
  const role = "admin";

  const handleLogout = () => {
    console.log("Logging out...");
    navigate("/");
  };

  const redirectToDashboard = () => {
    if (role === "admin") {
      navigate("/admin-dashboard");
    } else if (role === "barber") {
      navigate("/barber-dashboard");
    } else if (role === "user") {
      navigate("/user-dashboard");
    } else {
      navigate("/");
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-50">
      {/* Sidebar */}
      <div className="w-full sm:w-64 bg-white p-6 shadow-lg sm:block hidden">
        <h3 className="text-center text-2xl font-semibold text-gray-800 mb-6 mt-4">
          {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
        </h3>
        <motion.ul
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="space-y-4"
        >
          <li>
            <Link
              to="/users"
              className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
              <span className="mr-3">🧑‍🧑‍🧒‍🧒</span> View All Users
            </Link>
          </li>
          <li>
            <Link
              to="/All-barber-dashboard"
              className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
              <span className="mr-3">💈</span> Go to Barber Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/user-dashboard"
              className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
              <span className="mr-3">🙋‍♂️</span> Go to User Dashboard
            </Link>
          </li>
          <li>
            <Link
              to="/payments"
              className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
              <span className="mr-3">💲</span> Go to Payments
            </Link>
          </li>
          <li>
            <Link
              to="/bookings"
              className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
              <span className="mr-3">📋</span> Go to Bookings
            </Link>
          </li>
          <li>
            <Link
              to="/reviews"
              className="flex items-center text-blue-500 hover:text-blue-700 transition-all duration-300"
            >
              <span className="mr-3">⭐</span> Reviews
            </Link>
          </li>
        </motion.ul>
        <button
          onClick={handleLogout}
          className="mt-6 text-red-500 hover:text-red-700 transition-all duration-300"
        >
          Logout
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-8 sm:p-6">
        <div className="bg-white p-1 rounded-lg shadow-md">
          <Icon userName={userName} role={role} onLogout={handleLogout} />
          <h3 className="text-center text-2xl font-semibold text-gray-800 mb-6 mt-4">
            {role.charAt(0).toUpperCase() + role.slice(1)} Dashboard
          </h3>
          <motion.ul
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0, delay: 0 }}
            className="space-y-3 mt-10"
          >
            <li>
              <Link
                to="/users"
                className="text-blue-500 hover:text-blue-700 transition-all duration-300"
              >
                {/* View All Users */}
              </Link>
            </li>
            <li>
              <Link
                to="/All-barber-dashboard"
                className="text-blue-500 hover:text-blue-700 transition-all duration-300"
              >
                {/* Go to Barber Dashboard */}
              </Link>
            </li>
            <li>
              <Link
                to="/user-dashboard"
                className="text-blue-500 hover:text-blue-700 transition-all duration-300"
              >
                {/* Go to User Dashboard */}
              </Link>
            </li>
            <li>
              <Link
                to="/payments"
                className="text-blue-500 hover:text-blue-700 transition-all duration-300"
              >
                {/* Go to User Dashboard */}
              </Link>
            </li>
            <li>
              <Link
                to="/bookings"
                className="text-blue-500 hover:text-blue-700 transition-all duration-300"
              >
                {/* Go to User Dashboard */}
              </Link>
            </li>
            <li>
              <Link
                to="/reviews"
                className="text-blue-500 hover:text-blue-700 transition-all duration-300"
              >
                {/* Reviews */}
              </Link>
            </li>
          </motion.ul>
        </div>
      </div>

      {/* Mobile Sidebar Toggle */}
      <div className="sm:hidden fixed top-0 right-0 m-4">
        <button
          className="text-blue-500 hover:text-blue-700"
          onClick={() => alert("Toggle mobile sidebar")}
        >
          <span className="material-icons">menu</span>
        </button>
      </div>
    </div>
  );
};

export default AdminDashboard;

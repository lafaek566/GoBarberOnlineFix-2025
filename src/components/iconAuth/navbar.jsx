import React, { useState } from "react";
import {
  FaUserAlt,
  FaSearch,
  FaSignOutAlt,
  FaBars,
  FaTimes,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { useNavigate, useParams } from "react-router-dom";

const Navbar = () => {
  const { userId } = useParams();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  const handleLogout = () => {
    navigate("/");
  };

  return (
    <nav className="bg-gray-800 text-white px-6 py-4 rounded-3xl shadow-lg">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-gray-100 to-orange-300 bg-clip-text text-transparent"
          onClick={() => navigate("#")}
        >
          Gó~br
        </h1>

        {/* Desktop Menu */}
        <div className="hidden md:flex space-x-6">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => navigate(`/users/${userId}`)}
          >
            <FaUserAlt className="w-5 h-5" />
            <span>Profile</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 bg-gray-700 px-4 py-2 rounded-lg hover:bg-gray-600"
            onClick={() => navigate("/check-orders")}
          >
            <FaSearch className="w-5 h-5" />
            <span>Check Order</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 bg-red-600 px-4 py-2 rounded-lg hover:bg-red-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <motion.button
            onClick={toggleMenu}
            whileHover={{ scale: 1.2 }}
            transition={{ type: "spring", stiffness: 200 }}
          >
            {isMenuOpen ? (
              <FaTimes className="w-6 h-6" />
            ) : (
              <FaBars className="w-6 h-6" />
            )}
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden flex flex-col items-center space-y-4 mt-4 bg-gray-900 p-4 rounded-lg shadow-xl">
          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 text-white"
            onClick={() => navigate(`/users/${userId}`)}
          >
            <FaUserAlt className="w-5 h-5" />
            <span>Profile</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 text-white"
            onClick={() => navigate("/check-orders")}
          >
            <FaSearch className="w-5 h-5" />
            <span>Check Order</span>
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.1 }}
            transition={{ type: "spring", stiffness: 200 }}
            className="flex items-center space-x-2 text-red-500"
            onClick={handleLogout}
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span>Logout</span>
          </motion.button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

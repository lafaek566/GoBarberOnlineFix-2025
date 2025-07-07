import React, { useState } from "react";
import { FaUserCircle } from "react-icons/fa";
import axios from "axios";
import Cookies from "js-cookie";

const IconProfile = () => {
  const [showDropdown, setShowDropdown] = useState(false);
  const [showEditModal, setShowEditModal] = useState(false);
  const [editData, setEditData] = useState({ username: "", password: "" });

  const toggleDropdown = () => setShowDropdown(!showDropdown);
  const handleEditProfile = () => {
    setShowEditModal(true);
    setShowDropdown(false);
  };

  const handleSaveProfile = async () => {
    try {
      const token = Cookies.get("token") || localStorage.getItem("token");
      await axios.put(
        "http://localhost:5001/api/auth/update-profile",
        editData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
      alert("Profile updated successfully!");
      setShowEditModal(false);
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  return (
    <div className="relative">
      {/* Icon Profile */}
      <button className="flex items-center space-x-2" onClick={toggleDropdown}>
        <FaUserCircle className="text-3xl text-blue-700" />
        <span className="text-lg font-semibold">Barber</span>
      </button>

      {/* Dropdown Menu */}
      {showDropdown && (
        <div className="absolute right-0 mt-2 w-48 bg-white shadow-md rounded-lg py-2">
          <button
            onClick={handleEditProfile}
            className="block w-full text-left px-4 py-2 hover:bg-gray-100"
          >
            Edit Profile
          </button>
          <button className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-100">
            Logout
          </button>
        </div>
      )}

      {/* Modal Edit Profile */}
      {showEditModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
            <input
              type="text"
              placeholder="New Username"
              value={editData.username}
              onChange={(e) =>
                setEditData({ ...editData, username: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <input
              type="password"
              placeholder="New Password"
              value={editData.password}
              onChange={(e) =>
                setEditData({ ...editData, password: e.target.value })
              }
              className="w-full p-2 border rounded mb-3"
            />
            <div className="flex justify-end">
              <button
                onClick={() => setShowEditModal(false)}
                className="mr-2 px-4 py-2 bg-gray-300 rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveProfile}
                className="px-4 py-2 bg-blue-600 text-white rounded"
              >
                Save
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default IconProfile;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaSave, FaTimes } from "react-icons/fa";

const BarberEdit = ({ barber, onEditSuccess, onCancel }) => {
  const [editBarberData, setEditBarberData] = useState({
    name: "",
    latitude: "",
    longitude: "",
    services: "",
    paket: "Basic",
    paket_description: "",
    price: "",
    profile_image: "",
    gallery_images: [],
    bank_name: "",
    account_number: "",
    payment_method: "",
    no_telp: "",
  });
  const [error, setError] = useState("");

  // Populate the form fields with the selected barber data on mount
  useEffect(() => {
    setEditBarberData({
      name: barber.name || "",
      latitude: barber.latitude || "",
      longitude: barber.longitude || "",
      services: barber.services || "",
      paket: barber.paket || "Basic",
      paket_description: barber.paket_description || "",
      price: barber.price || "",
      profile_image: barber.profile_image || "",
      gallery_images: barber.gallery_images || [],
      bank_name: barber.bank_name || "",
      account_number: barber.account_number || "",
      payment_method: barber.payment_method || "",
      no_telp: barber.no_telp || "",
    });
  }, [barber]);

  const handleSaveEdit = (id) => {
    const token = localStorage.getItem("token");

    if (!token) {
      setError("Unauthorized: No token provided");
      return;
    }

    // Validate required fields
    if (
      !editBarberData.name ||
      !editBarberData.services ||
      !editBarberData.paket ||
      !editBarberData.price ||
      !editBarberData.bank_name ||
      !editBarberData.account_number ||
      !editBarberData.no_telp ||
      !editBarberData.payment_method
    ) {
      setError("All fields are required!");
      return;
    }

    // Make API call to save edited barber data
    const formData = new FormData();
    formData.append("name", editBarberData.name);
    formData.append("latitude", editBarberData.latitude);
    formData.append("longitude", editBarberData.longitude);
    formData.append("services", editBarberData.services);
    formData.append("paket", editBarberData.paket);
    formData.append("paket_description", editBarberData.paket_description);
    formData.append("price", editBarberData.price);
    formData.append("bank_name", editBarberData.bank_name);
    formData.append("account_number", editBarberData.account_number);
    formData.append("payment_method", editBarberData.payment_method);
    formData.append("no_telp", editBarberData.no_telp);

    // Only append profile image if it's provided
    if (editBarberData.profile_image) {
      formData.append("profileImage", editBarberData.profile_image);
    }

    // Only append gallery images if selected
    if (editBarberData.gallery_images.length > 0) {
      for (let i = 0; i < editBarberData.gallery_images.length; i++) {
        formData.append("galleryImages", editBarberData.gallery_images[i]);
      }
    }

    axios
      .put(`http://localhost:5001/api/barbers/update/${id}`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
      })
      .then((response) => {
        if (response.data.message === "Barber updated successfully") {
          setError("");
          alert("Barber details have been successfully updated!");
          onEditSuccess(response.data);
        } else {
          setError("Failed to update barber");
        }
      })
      .catch((error) => {
        setError("Something went wrong");
      });
  };

  return (
    <div className="fixed inset-0 bg-gray-800 bg-opacity-50 flex justify-center items-center">
      <div className="bg-white p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Edit Barber
        </h2>
        {error && (
          <div className="bg-red-100 text-red-800 p-4 rounded-lg mb-4">
            {error}
          </div>
        )}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSaveEdit(barber.id);
          }}
        >
          <div className="max-h-96 overflow-auto">
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Name</label>
              <input
                type="text"
                value={editBarberData.name}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    name: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Latitude</label>
              <input
                type="text"
                value={editBarberData.latitude}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    latitude: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Longitude</label>
              <input
                type="text"
                value={editBarberData.longitude}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    longitude: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Services</label>
              <input
                type="text"
                value={editBarberData.services}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    services: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Paket</label>
              <input
                type="text"
                value={editBarberData.paket}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    paket: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">
                Paket Description
              </label>
              <input
                type="text"
                value={editBarberData.paket_description}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    paket_description: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Telp</label>
              <input
                type="text"
                value={editBarberData.no_telp}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    no_telp: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Price</label>
              <input
                type="text"
                value={editBarberData.price}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    price: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Bank Name</label>
              <input
                type="text"
                value={editBarberData.bank_name}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    bank_name: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Account Number</label>
              <input
                type="text"
                value={editBarberData.account_number}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    account_number: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Payment Method</label>
              <input
                type="text"
                value={editBarberData.payment_method}
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    payment_method: e.target.value,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Profile Image */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Profile Image</label>
              <input
                type="file"
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    profile_image: e.target.files[0],
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>

            {/* Gallery Images */}
            <div className="mb-4">
              <label className="block text-gray-700 mb-2">Gallery Images</label>
              <input
                type="file"
                multiple
                onChange={(e) =>
                  setEditBarberData({
                    ...editBarberData,
                    gallery_images: e.target.files,
                  })
                }
                className="w-full border border-gray-300 rounded-md p-2"
              />
            </div>
          </div>

          <div className="flex justify-between">
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              <FaSave className="mr-2" /> Save
            </button>
            <button
              type="button"
              onClick={onCancel}
              className="bg-gray-500 text-white px-4 py-2 rounded-lg"
            >
              <FaTimes className="mr-2" /> Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BarberEdit;

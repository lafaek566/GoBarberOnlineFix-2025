import React, { useState, useEffect } from "react";
import axios from "axios";

const BarberForm = ({ onSuccess }) => {
  const [name, setName] = useState("");
  const [latitude, setLatitude] = useState("");
  const [longitude, setLongitude] = useState("");
  const [services, setServices] = useState("");
  const [paket, setPaket] = useState(""); // New field
  const [paketDescription, setPaketDescription] = useState(""); // New field
  const [price, setPrice] = useState(""); // New field
  const [profileImage, setProfileImage] = useState(null); // Single image for profile
  const [galleryImages, setGalleryImages] = useState([]); // Multiple images for gallery
  const [bankName, setBankName] = useState(""); // New field for bank name
  const [accountNumber, setAccountNumber] = useState(""); // New field for account number
  const [paymentMethod, setPaymentMethod] = useState(""); // New field for payment method
  const [no_telp, setNoTelp] = useState("");
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState(""); // New state for success message

  // Automatically set price based on paket selection
  useEffect(() => {
    switch (paket) {
      case "Basic":
        setPrice(30);
        break;
      case "Medium":
        setPrice(50);
        break;
      case "VIP":
        setPrice(100);
        break;
      default:
        setPrice(""); // Reset if no paket is selected
    }
  }, [paket]);

  const handleProfileImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setProfileImage(file);
    }
  };

  const handleGalleryImageChange = (e) => {
    const files = Array.from(e.target.files);
    if (files.length > 6) {
      setError("You can only upload a maximum of 6 gallery images.");
    } else if (files.length < 1) {
      setError("Please upload at least 1 gallery image.");
    } else {
      setGalleryImages(files);
      setError(""); // Clear error if valid number of files are uploaded
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Confirm submission
    const isConfirmed = window.confirm(
      "Are you sure you want to add this barber?"
    );
    if (!isConfirmed) {
      return; // Stop the form submission if not confirmed
    }

    // Validate input fields
    if (
      !name ||
      !latitude ||
      !longitude ||
      !services ||
      !paket ||
      !price ||
      !profileImage ||
      galleryImages.length < 1 || // Check if at least 1 gallery image is uploaded
      !bankName ||
      !accountNumber ||
      !no_telp ||
      !paymentMethod
    ) {
      setError(
        "Please fill in all fields and upload at least 1 gallery image."
      );
      return; // Prevent form submission if validation fails
    }

    const formData = new FormData();

    // Append form fields
    formData.append("name", name);
    formData.append("latitude", latitude);
    formData.append("longitude", longitude);
    formData.append("services", services);
    formData.append("paket", paket);
    formData.append("paket_description", paketDescription);
    formData.append("price", price);
    formData.append("bank_name", bankName); // Append bank name
    formData.append("account_number", accountNumber); // Append account number
    formData.append("payment_method", paymentMethod); // Append payment method
    formData.append("no_telp", no_telp);

    // Append profile image
    formData.append("profileImage", profileImage);

    // Append gallery images (up to 5)
    galleryImages.forEach((image) => {
      formData.append("galleryImages", image);
    });

    try {
      // Send form data to the backend API
      const response = await axios.post(
        "http://localhost:5001/api/barbers/add",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Success:", response.data);
      setSuccessMessage("Barber added successfully!"); // Set success message
      if (onSuccess) onSuccess(); // Call onSuccess if provided
    } catch (error) {
      console.error("Error:", error);
      setError("An error occurred while adding the barber.");
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      className="max-w-lg mx-auto p-6 bg-white rounded-lg shadow-lg"
    >
      <h2 className="text-2xl font-semibold text-center mb-6">
        Add New Barber
      </h2>

      {/* Display success message */}
      {successMessage && (
        <p className="text-green-600 text-center mb-4">{successMessage}</p>
      )}

      {error && <p className="text-red-600 text-center mb-4">{error}</p>}

      {/* Name Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="name"
        >
          Name:
        </label>
        <input
          type="text"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Telp Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="no_telp"
        >
          Telp:
        </label>
        <input
          type="number"
          id="no_telp"
          value={no_telp}
          onChange={(e) => setNoTelp(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Latitude Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="latitude"
        >
          Latitude:
        </label>
        <input
          type="number"
          id="latitude"
          value={latitude}
          onChange={(e) => setLatitude(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Longitude Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="longitude"
        >
          Longitude:
        </label>
        <input
          type="number"
          id="longitude"
          value={longitude}
          onChange={(e) => setLongitude(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Services Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="services"
        >
          Services:
        </label>
        <textarea
          id="services"
          value={services}
          onChange={(e) => setServices(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Paket Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="paket"
        >
          Paket:
        </label>
        <select
          id="paket"
          value={paket}
          onChange={(e) => setPaket(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="Basic">Basic</option>
          <option value="Medium">Medium</option>
          <option value="VIP">VIP</option>
        </select>
      </div>

      {/* Paket Description Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="paket_description"
        >
          Paket Description:
        </label>
        <textarea
          id="paket_description"
          value={paketDescription}
          onChange={(e) => setPaketDescription(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
      </div>

      {/* Price Display */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="price"
        >
          Price: ${price}
        </label>
      </div>

      {/* Bank Name Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="bank_name"
        >
          Bank Name:
        </label>
        <input
          type="text"
          id="bank_name"
          value={bankName}
          onChange={(e) => setBankName(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Account Number Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="account_number"
        >
          Account Number:
        </label>
        <input
          type="text"
          id="account_number"
          value={accountNumber}
          onChange={(e) => setAccountNumber(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Payment Method Field */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="payment_method"
        >
          Payment Method:
        </label>
        <select
          id="payment_method"
          value={paymentMethod}
          onChange={(e) => setPaymentMethod(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        >
          <option value="tf">Bank Transfer (TF)</option>
          <option value="qris">QRIS</option>
        </select>
      </div>

      {/* Profile Image Upload */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="profile_image"
        >
          Profile Image:
        </label>
        <input
          type="file"
          id="profile_image"
          accept="image/*"
          onChange={handleProfileImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Gallery Image Upload */}
      <div className="mb-4">
        <label
          className="block text-lg font-medium text-gray-700"
          htmlFor="gallery_images"
        >
          Gallery Images (At least 1):
        </label>
        <input
          type="file"
          id="gallery_images"
          accept="image/*"
          multiple
          onChange={handleGalleryImageChange}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          required
        />
      </div>

      {/* Submit Button */}
      <div className="mt-6 text-center">
        <button
          type="submit"
          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-all duration-300"
        >
          Add Barber
        </button>
      </div>
    </form>
  );
};

export default BarberForm;

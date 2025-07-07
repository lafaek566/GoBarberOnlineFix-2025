import React, { useState, useEffect } from "react";
import Modal from "react-modal";
import BookingForm from "./bookingForm";
import BarberReviews from "../user/review/idReviews";
import {
  FaDirections,
  FaTimes,
  FaArrowLeft,
  FaArrowRight,
} from "react-icons/fa";
import { motion } from "framer-motion";
import { disableBodyScroll, enableBodyScroll } from "body-scroll-lock";

Modal.setAppElement("#root");

const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371; // Radius of the Earth in km
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLon = ((lon2 - lon1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const BarberCard = ({
  barber,
  onSelectBarber,
  userLocation,
  profileImage,
  paymentStatus,
}) => {
  const [distance, setDistance] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null);
  const [showReviews, setShowReviews] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);

  useEffect(() => {
    if (userLocation) {
      const dist = calculateDistance(
        userLocation.latitude,
        userLocation.longitude,
        barber.latitude,
        barber.longitude
      );
      setDistance(dist);
    }
  }, [userLocation, barber.latitude, barber.longitude]);

  const getGoogleMapsLink = () => {
    return `https://www.google.com/maps/dir/?api=1&destination=${barber.latitude},${barber.longitude}&travelmode=driving`;
  };

  const handleBarberSelect = () => {
    onSelectBarber(barber);
    setShowBookingForm(true);
  };

  const toggleReviews = () => {
    setShowReviews((prevState) => !prevState);
  };

  const toggleBookingForm = () => {
    setShowBookingForm((prevState) => !prevState);
  };

  const handleImageChange = (index) => {
    setSelectedImage(`http://localhost:5001${barber.gallery_images[index]}`);
  };

  const closeModal = () => {
    setSelectedImage(null);
  };

  const goToNextImage = () => {
    const currentIndex = barber.gallery_images.findIndex(
      (image) => `http://localhost:5001${image}` === selectedImage
    );
    const nextIndex =
      currentIndex === barber.gallery_images.length - 1 ? 0 : currentIndex + 1;
    setSelectedImage(
      `http://localhost:5001${barber.gallery_images[nextIndex]}`
    );
  };

  const goToPreviousImage = () => {
    const currentIndex = barber.gallery_images.findIndex(
      (image) => `http://localhost:5001${image}` === selectedImage
    );
    const prevIndex =
      currentIndex === 0 ? barber.gallery_images.length - 1 : currentIndex - 1;
    setSelectedImage(
      `http://localhost:5001${barber.gallery_images[prevIndex]}`
    );
  };

  return (
    <div
      onClick={handleBarberSelect}
      className="p-6 bg-white border border-gray-200 rounded-xl shadow-lg hover:shadow-2xl transition-all transform hover:scale-105 cursor-pointer hover:bg-gray-50"
    >
      <div className="flex items-center space-x-6 mb-6">
        <div className="w-20 h-20 rounded-3xl bg-gray-300 overflow-hidden shadow-md">
          <img
            src={profileImage || `http://localhost:5001${barber.profile_image}`}
            alt={barber.name}
            className="w-full h-full object-cover"
          />
        </div>
        <div>
          <h3 className="text-2xl font-semibold text-gray-800">
            {barber.name}
          </h3>
          <p className="text-sm text-gray-500 mt-5">
            <span className="font-semibold text-blue-600">Service:</span>{" "}
            {barber.services}
          </p>
          <p className="text-sm text-gray-500 mt-3">
            <span className="font-semibold text-green-600">Paket:</span>{" "}
            {barber.paket_description}
          </p>
        </div>
      </div>

      {distance !== null && (
        <motion.div
          className="bg-gray-100 p-4 rounded-lg shadow-md text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
        >
          <p className="text-lg font-semibold text-gray-800">
            <span className="text-blue-600">Jarak:</span> {distance.toFixed(2)}{" "}
            km
          </p>
          <div className="mt-6 flex items-center justify-center space-x-2">
            <a
              href={getGoogleMapsLink()}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center text-blue-600 hover:underline"
            >
              <span className="text-center mr-2">Direction</span>
              <FaDirections className="text-blue-600 text-3xl animate-pulse" />
            </a>
          </div>

          <p className="text-sm text-gray-500 mt-3">Dari lokasi Anda</p>
        </motion.div>
      )}

      {barber.gallery_images && barber.gallery_images.length > 0 && (
        <div className="mt-6">
          <h4 className="text-xl font-semibold text-gray-800 mb-4">Gallery</h4>
          <div className="grid grid-cols-3 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {barber.gallery_images.map((image, index) => (
              <div
                key={index}
                className="w-full h-24 sm:h-32 md:h-40 lg:h-48 rounded-lg overflow-hidden shadow-lg cursor-pointer hover:scale-110 transition transform duration-200"
                onClick={() => handleImageChange(index)}
              >
                <img
                  src={`http://localhost:5001${image}`}
                  alt={`Gallery Image ${index + 1}`}
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>
      )}

      <div className="mt-6 text-center">
        <button
          onClick={toggleReviews}
          className="text-blue-600 hover:underline text-1xl font-semibold"
        >
          {showReviews ? "Hide Reviews" : "Show Reviews"}
        </button>

        {showReviews && <BarberReviews barberId={barber.id} />}
      </div>

      {selectedImage && (
        <Modal
          isOpen={true}
          onRequestClose={closeModal}
          contentLabel="Image Zoom"
          overlayClassName="modal-overlay"
          shouldCloseOnOverlayClick={true}
          className="max-w-full max-h-full bg-transparent"
        >
          <div className="relative w-full h-full overflow-y-auto">
            <button
              onClick={closeModal}
              className="absolute top-0 right-0 p-2 text-white bg-black bg-opacity-50 rounded-full"
            >
              <FaTimes />
            </button>
            <button
              onClick={goToPreviousImage}
              className="absolute left-0 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black bg-opacity-50 rounded-full"
            >
              <FaArrowLeft />
            </button>
            <button
              onClick={goToNextImage}
              className="absolute right-0 top-1/2 transform -translate-y-1/2 p-2 text-white bg-black bg-opacity-50 rounded-full"
            >
              <FaArrowRight />
            </button>
            <img
              src={selectedImage}
              alt="Selected"
              className="max-w-full max-h-full object-contain"
            />
          </div>
        </Modal>
      )}

      <div className="mt-6">
        <button
          onClick={toggleBookingForm}
          className="w-full py-2 bg-blue-600 text-white rounded-lg shadow-md hover:bg-blue-700 transition-all"
        >
          {showBookingForm ? " Booking Form" : "Book Now"}
        </button>
      </div>

      {showBookingForm && (
        <div className="mt-6">
          <BookingForm barberId={barber.id} />
        </div>
      )}
    </div>
  );
};

export default BarberCard;

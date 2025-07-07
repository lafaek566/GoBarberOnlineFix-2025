import React, { useEffect, useState } from "react";
import axios from "axios";
import Cookies from "js-cookie";
import { useParams, Link, useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

const BarberDetails = () => {
  const { id } = useParams();
  const [barber, setBarber] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    if (!id) {
      setError("Invalid barber ID");
      setLoading(false);
      return;
    }

    const token = Cookies.get("token");

    if (!token) {
      setError("Unauthorized: No token provided");
      setLoading(false);
      return;
    }

    axios
      .get(`http://localhost:5001/api/barbers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => {
        setBarber(response.data);
        setLoading(false);
      })
      .catch((err) => {
        setError("Error fetching barber details: " + err.message);
        setLoading(false);
      });
  }, [id]);

  if (loading) {
    return <div className="text-center text-xl text-gray-700">Loading...</div>;
  }

  if (error) {
    return <div className="text-center text-xl text-red-600">{error}</div>;
  }

  const handleDelete = async () => {
    const token = Cookies.get("token");

    if (!token) {
      setError("No token");
      return;
    }

    const isConfirmed = window.confirm(
      "Are you sure you want to delete this barber?"
    );
    if (!isConfirmed) return;

    try {
      await axios.delete(`http://localhost:5001/api/barbers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      alert("Barber successfully deleted!");
      console.log("Navigating to /barber-dashboard...");
      navigate("/barber-dashboard", { replace: true });
    } catch (err) {
      setError("Error deleting barber: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-center text-gray-800 mb-12">
          Barber Details
        </h1>

        <div
          className="bg-white shadow-xl rounded-lg overflow-hidden"
          data-aos="fade-up"
        >
          <div className="flex flex-col lg:flex-row items-center justify-between p-8 space-y-6 lg:space-y-0 lg:space-x-8">
            {/* Profile Section */}
            <div className="flex flex-col items-center justify-center space-y-4 p-6">
              {barber.profile_image && (
                <img
                  src={`http://localhost:5001${barber.profile_image}`}
                  alt={barber.name}
                  className="w-36 h-36 object-cover rounded-full shadow-xl border-4 border-orange-500"
                />
              )}
              <div className="text-center space-y-2">
                <h2 className="text-3xl font-semibold text-gray-800">
                  Barber: {barber.name}
                </h2>
                <h3 className="text-xl font-semibold text-gray-700">
                  Telp: {barber.no_telp}
                </h3>
                <p className="text-lg text-gray-600">
                  Services: {barber.services}
                </p>
                <p className="text-lg text-gray-600">
                  desc: {barber.paket_description}
                </p>
                <p className="text-xl font-medium text-gray-800">
                  Price: ${barber.price}
                </p>
                <p className="text-lg text-gray-600">Paket: {barber.paket}</p>
                <p className="text-lg text-gray-600">
                  Payment Method: {barber.payment_method}
                </p>
              </div>
            </div>
          </div>

          {/* Gallery Section */}
          <div>
            <p className="text-center text-4xl text-gray-800 mb-6">Gallery</p>
            {barber.gallery_images?.length > 0 && (
              <div
                className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 p-6"
                data-aos="fade-up"
              >
                {barber.gallery_images.map((image, index) => (
                  <img
                    key={index}
                    src={`http://localhost:5001${image}`}
                    alt="Gallery"
                    className="w-full h-40 object-cover rounded-lg shadow-md border-2 border-gray-200 hover:scale-105 transition-transform"
                  />
                ))}
              </div>
            )}
          </div>

          {/* View Payments Button */}
          <div className="text-center mt-4">
            <Link
              to={`/payments/${id}`}
              className="bg-blue-500 text-white px-4 py-2 rounded-3xl mt-4 inline-block"
            >
              Lihat Pembayaran
            </Link>
          </div>

          {/* Edit & Delete Buttons */}
          <div className="flex justify-center space-x-4 p-6">
            <Link
              to={`/edit-barber/${id}`}
              className="bg-blue-600 text-white px-6 py-3 rounded-3xl shadow-md hover:bg-blue-700 transition"
            >
              Edit Barber
            </Link>
            <button
              onClick={handleDelete}
              className="bg-red-600 text-white px-6 py-3 rounded-3xl shadow-md hover:bg-red-700 transition"
            >
              Delete
            </button>
          </div>

          {/* Back Button */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => navigate("/barber-dashboard")}
              className="mt-5 px-6 py-3 bg-gray-400 text-white rounded-3xl shadow-md hover:bg-gray-600 transition"
            >
              Back to Dashboard
            </button>
          </div>

          {/* Bank Details Section */}
          <div className="bg-gray-100 p-6 mt-8 text-center" data-aos="fade-up">
            <h3 className="text-2xl font-semibold text-gray-800 mb-4">
              Bank Details
            </h3>
            <p className="text-lg text-gray-600">
              Bank Name: {barber.bank_name}
            </p>
            <p className="text-lg text-gray-600">
              Account Number: {barber.account_number}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BarberDetails;

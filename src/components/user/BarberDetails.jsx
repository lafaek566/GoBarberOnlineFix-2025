import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";

const BarberDetails = () => {
  const { id } = useParams(); // ID dari URL
  const navigate = useNavigate();
  const [barber, setBarber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get(`http://localhost:5001/api/barbers/${id}`)
      .then((res) => setBarber(res.data))
      .catch(() => setError("Gagal memuat detail barber"));
  }, [id]);

  const handleBooking = () => {
    navigate(`/book/${barber.id}`);
  };

  if (error) return <p>{error}</p>;
  if (!barber) return <p>Loading...</p>;

  return (
    <div className="max-w-4xl mx-auto p-8">
      <h2 className="text-3xl font-semibold mb-4">{barber.name}</h2>
      <img
        src={`http://localhost:5001${barber.profile_image}`}
        alt={barber.name}
        className="w-64 h-64 object-cover rounded-xl mb-6"
      />
      <p className="mb-2">
        <strong>Services:</strong> {barber.services}
      </p>
      <p className="mb-2">
        <strong>Description:</strong> {barber.paket_description}
      </p>
      <p className="mb-6">
        <strong>Rating:</strong> {barber.rating} ⭐
      </p>

      <button
        onClick={handleBooking}
        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
      >
        Booking
      </button>
    </div>
  );
};

export default BarberDetails;

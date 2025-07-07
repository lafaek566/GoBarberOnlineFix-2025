import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import BookingForm from "./bookingForm";
import axios from "axios";

const BookBarber = () => {
  const { barberId } = useParams();
  const [barber, setBarber] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBarber = async () => {
      try {
        const res = await axios.get(
          `http://localhost:5001/api/barbers/${barberId}`
        );
        setBarber(res.data);
      } catch (err) {
        setError("Barber tidak ditemukan.");
      }
    };

    fetchBarber();
  }, [barberId]);

  if (error) return <p className="text-red-500 text-center">{error}</p>;
  if (!barber) return <p className="text-center">Memuat data barber...</p>;

  return (
    <div className="max-w-4xl mx-auto mt-20">
      <h2 className="text-2xl font-semibold mb-6 text-center">
        Booking untuk {barber.name}
      </h2>
      <BookingForm barberId={barber.id} />
    </div>
  );
};

export default BookBarber;

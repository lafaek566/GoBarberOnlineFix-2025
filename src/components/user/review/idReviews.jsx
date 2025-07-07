import React, { useEffect, useState } from "react";
import axios from "axios";
import { FaStar } from "react-icons/fa"; // Import ikon bintang dari react-icons

const IdReviews = ({ barberId }) => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true); // Tambahkan state loading

  useEffect(() => {
    if (!barberId) return; // Cegah pemanggilan API jika barberId tidak ada

    const fetchReviews = async () => {
      setLoading(true); // Set loading sebelum fetch data
      try {
        const response = await axios.get(
          `http://localhost:5001/api/reviews/${barberId}`
        );

        if (response.data.length === 0) {
          setError("Belum ada review untuk barber ini."); // Jika review kosong, tampilkan error
        } else {
          setReviews(response.data);
          setError(""); // Reset error jika ada review
        }
      } catch (err) {
        setError("Gagal memuat review: " + err.message);
      } finally {
        setLoading(false); // Matikan loading setelah fetch selesai
      }
    };

    fetchReviews();
  }, [barberId]);

  return (
    <div className="mt-6 max-w-2xl mx-auto bg-white p-2 rounded-xl shadow-md">
      <h3 className="text-1xl text-center font-bold text-gray-800 border-b pb-3">
        Customer Reviews
      </h3>
      {loading ? (
        <p className="text-sm text-gray-500 text-center mt-2">
          Memuat review...
        </p>
      ) : error ? (
        <p className="text-red-500 text-center mt-2">{error}</p>
      ) : reviews.length > 0 ? (
        <div className="space-y-4 mt-4">
          {reviews.map((review) => (
            <div
              key={review.id}
              className="bg-gray-50 p-4 rounded-lg shadow-sm border border-gray-200 hover:shadow-md transition-shadow duration-300"
            >
              {/* Username dan Rating */}
              <div className="flex items-center justify-between">
                <h4 className="text-lg font-semibold text-gray-700">
                  {review.username || "Anonymous"}
                </h4>
                <div className="flex text-yellow-500">
                  {[...Array(review.rating)].map((_, index) => (
                    <FaStar key={index} />
                  ))}
                </div>
              </div>
              {/* Komentar */}
              <p className="text-gray-600 italic mt-2">
                "{review.comment || "Tidak ada komentar"}"
              </p>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-gray-500 mt-4 text-center">
          Belum ada review untuk barber ini.
        </p>
      )}
    </div>
  );
};

export default IdReviews;

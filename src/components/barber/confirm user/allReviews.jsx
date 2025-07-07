import React, { useState, useEffect } from "react";
import axios from "axios";

const AllReviews = () => {
  const [reviews, setReviews] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchReviews = async () => {
      try {
        const response = await axios.get("http://localhost:5001/api/reviews");
        setReviews(response.data);
      } catch (err) {
        setError("Gagal memuat review: " + err.message);
      }
    };

    fetchReviews();
  }, []);

  // Delete review handler
  const handleDelete = async (id) => {
    try {
      const response = await axios.delete(
        `http://localhost:5001/api/reviews/${id}`
      );
      if (response.status === 200) {
        // Remove the deleted review from the state
        setReviews(reviews.filter((review) => review.id !== id));
      }
    } catch (err) {
      setError("Gagal menghapus review: " + err.message);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-10">
      <div className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6">
        <h2 className="text-3xl font-bold text-blue-600 mb-6 text-center">
          Semua Review
        </h2>
        {error && <p className="text-red-500 text-center mb-4">{error}</p>}
        {reviews.length > 0 ? (
          <ul className="space-y-6">
            {reviews.map((review, index) => (
              <li
                key={index}
                className="p-6 bg-blue-50 border border-blue-200 rounded-xl shadow-sm hover:shadow-md transition-shadow"
              >
                <div className="flex items-center mb-2">
                  <div className="w-10 h-10 rounded-full bg-blue-400 text-white flex items-center justify-center text-lg font-bold mr-4">
                    {review.username
                      ? review.username.charAt(0).toUpperCase()
                      : "A"}
                  </div>
                  <h3 className="text-xl font-semibold text-gray-700">
                    {review.username || "Anonymous"}
                  </h3>
                </div>
                {/* Displaying Barber's name */}
                <p className="text-gray-500 italic mb-2">
                  <strong>Barber:</strong>{" "}
                  {review.barberName || "Nama barber tidak tersedia"}
                </p>
                <p className="text-yellow-500 font-medium">
                  ⭐ {review.rating} / 5
                </p>
                <p className="text-gray-600 mt-2">{review.comment}</p>

                {/* Delete button */}
                <button
                  onClick={() => handleDelete(review.id)}
                  className="mt-4 bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 transition"
                >
                  Hapus Review
                </button>
              </li>
            ))}
          </ul>
        ) : (
          <p className="text-center text-gray-500">Tidak ada review.</p>
        )}
      </div>
    </div>
  );
};

export default AllReviews;

import React, { useState } from "react";
import axios from "axios";
import { FaStar, FaStarHalfAlt, FaRegStar } from "react-icons/fa"; // Importing icons

const ReviewForm = ({ barberId, onReviewAdded }) => {
  const [rating, setRating] = useState(1);
  const [comment, setComment] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Basic validation
    if (!comment) {
      setError("Komentar tidak boleh kosong.");
      return;
    }

    if (rating < 1 || rating > 5) {
      setError("Rating harus antara 1 dan 5.");
      return;
    }

    try {
      await axios.post("http://localhost:5001/api/reviews/add", {
        barberId: Number(barberId),
        username,
        rating,
        comment,
      });

      alert("Review berhasil ditambahkan");
      setRating(1);
      setComment("");
      setUsername("");
      setError(""); // Clear error message after success
      onReviewAdded();
    } catch (err) {
      setError("Error menambahkan review: " + err.message);
    }
  };

  // Handle the star rating click
  const handleStarClick = (newRating) => {
    setRating(newRating);
  };

  const renderStars = () => {
    const stars = [];
    for (let i = 1; i <= 5; i++) {
      if (i <= rating) {
        stars.push(
          <FaStar
            key={i}
            className="cursor-pointer text-yellow-500"
            onClick={() => handleStarClick(i)}
          />
        );
      } else if (i === Math.ceil(rating) && rating % 1 !== 0) {
        stars.push(
          <FaStarHalfAlt
            key={i}
            className="cursor-pointer text-yellow-500"
            onClick={() => handleStarClick(i)}
          />
        );
      } else {
        stars.push(
          <FaRegStar
            key={i}
            className="cursor-pointer text-yellow-500"
            onClick={() => handleStarClick(i)}
          />
        );
      }
    }
    return stars;
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
      <h3 className="text-xl font-semibold">Form Review</h3>
      {error && <p className="text-red-500">{error}</p>}

      <div className="mb-4">
        <label htmlFor="username" className="block text-lg">
          Username
        </label>
        <input
          type="text"
          id="username"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
          placeholder="Masukkan username (opsional)"
        />
      </div>

      <div className="mb-4">
        <label htmlFor="rating" className="block text-lg">
          Rating
        </label>
        <div className="flex">
          {renderStars()} {/* Render star rating here */}
        </div>
      </div>

      <div className="mb-4">
        <label htmlFor="comment" className="block text-lg">
          Komentar
        </label>
        <textarea
          id="comment"
          value={comment}
          onChange={(e) => setComment(e.target.value)}
          className="w-full px-4 py-2 border border-gray-300 rounded-lg"
        />
      </div>

      <button
        type="submit"
        className="w-full bg-blue-600 text-white py-2 rounded-lg"
      >
        Kirim Review
      </button>
    </form>
  );
};

export default ReviewForm;

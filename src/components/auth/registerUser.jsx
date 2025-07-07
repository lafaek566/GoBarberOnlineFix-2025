import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Import icons for show/hide password

const RegisterUser = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [passwordVisible, setPasswordVisible] = useState(false); // State to toggle password visibility
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/register-user",
        { username, email, password }
      );

      // Save the token and role in localStorage
      localStorage.setItem("token", response.data.token);
      localStorage.setItem("userRole", "user");

      // Navigate to the user dashboard
      navigate("/user-dashboard");
    } catch (err) {
      setError(err.response?.data?.error || "Something went wrong");
    }
  };

  const togglePasswordVisibility = () => {
    setPasswordVisible(!passwordVisible);
  };

  return (
    <div
      className="min-h-screen flex justify-center items-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/5c/00/0b/5c000b2798790dd9e537cfe8f6b3f830.jpg')",
        backgroundSize: "cover", // Ensures the background image covers the entire screen
        backgroundPosition: "center", // Centers the background image
        backgroundAttachment: "fixed", // Makes the background stay in place while scrolling
      }}
    >
      <div className="bg-white bg-opacity-30 p-8 rounded-lg shadow-lg w-96 max-w-sm">
        <h2 className="text-3xl font-semibold text-center text-black mb-6">
          Register
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Username
            </label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-4">
            <label className="block text-white text-sm font-medium mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <div className="mb-6 relative">
            <label className="block text-white text-sm font-medium mb-2">
              Password
            </label>
            <input
              type={passwordVisible ? "text" : "password"} // Toggle input type based on password visibility
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
            <span
              onClick={togglePasswordVisibility}
              className="absolute top-12 right-11 transform -translate-y-1/2 cursor-pointer"
            >
              {passwordVisible ? <FaEyeSlash size={10} /> : <FaEye size={15} />}
            </span>
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-400 transition duration-200"
          >
            Register
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-white">
            Already have an account?{" "}
            <a href="/" className="text-blue-400 hover:underline">
              Login
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default RegisterUser;

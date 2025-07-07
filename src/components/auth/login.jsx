import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingPage from "../iconAuth/loading"; // Import komponen Loading

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false); // State untuk loading
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true); // Aktifkan loading saat login dimulai

    try {
      const response = await axios.post(
        "http://localhost:5001/api/auth/login",
        { email, password }
      );

      const { token, role } = response.data;

      // Simpan token dan role di Cookies
      Cookies.set("token", token, { expires: 1 });
      Cookies.set("userRole", role, { expires: 7 });

      console.log("Token from Cookies:", Cookies.get("token"));

      // Redirect berdasarkan role
      if (role === "admin") {
        navigate("/admin-dashboard");
      } else if (role === "barber") {
        navigate("/barber-dashboard");
      } else {
        navigate("/user-dashboard");
      }

      setTimeout(() => {
        window.location.reload(); // Refresh halaman setelah login sukses
      }, 1000);
    } catch (err) {
      setError(err.response?.data?.error || "Login failed. Please try again.");
    } finally {
      setLoading(false); // Matikan loading setelah login selesai
    }
  };

  return loading ? (
    <LoadingPage />
  ) : (
    <div
      className="min-h-screen flex justify-center items-center bg-cover bg-center"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/a6/79/7c/a6797c5ed3fca6ebff7fabc2c3b46261.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
      }}
    >
      <div className="bg-gray-200 bg-opacity-50 p-8 rounded-lg shadow-lg w-96">
        <h2 className="text-3xl font-semibold text-center text-gray-800 mb-6">
          Login
        </h2>

        {error && <p className="text-red-500 text-center mb-4">{error}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-black text-sm font-medium mb-2">
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

          <div className="mb-6">
            <label className="block text-gray-700 text-sm font-medium mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-400"
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 bg-gray-700 text-white font-semibold rounded-lg hover:bg-gray-800 transition duration-200"
          >
            Login
          </button>
        </form>

        <div className="mt-4 text-center">
          <p className="text-sm text-black">
            Don't have an account?{" "}
            <span
              onClick={() => navigate("/register-user")}
              className="text-white hover:underline cursor-pointer"
            >
              Sign up
            </span>
          </p>
        </div>

        <div className="mt-4 text-center">
          <div className="mt-4 text-center">
            <button
              onClick={() => navigate("/")}
              className="text-sm bg-white text-gray-900 hover:bg-gray-300 px-4 py-1 rounded-full transition duration-300"
            >
              Back to Home
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;

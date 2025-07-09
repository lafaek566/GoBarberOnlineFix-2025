import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Cookies from "js-cookie";

const Navbar = ({ refs }) => {
  const [isLogin, setIsLogin] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const token = Cookies.get("token");
    setIsLogin(!!token);
  }, []);

  const handleLogout = () => {
    Cookies.remove("token");
    Cookies.remove("userId");
    Cookies.remove("username");
    Cookies.remove("userRole");
    window.location.href = "/"; // wajib pakai ini untuk full reload
  };

  const toggleMenu = () => setIsMenuOpen(!isMenuOpen);

  const handleScroll = (ref) => {
    if (ref?.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      setIsMenuOpen(false);
    }
  };

  const menuItems = [
    { name: "Home", ref: refs?.homeRef },
    { name: "Gallery", ref: refs?.galleryRef },
    { name: "Features", ref: refs?.featuresRef },
    { name: "Promo", ref: refs?.promoRef },
    { name: "Client", ref: refs?.clientRef },
    { name: "Review", ref: refs?.reviewRef },
    { name: "Barbers", ref: refs?.barbersRef },
  ];

  return (
    <nav className="bg-gray-900 text-white p-3 rounded-3xl shadow-lg">
      <div className="max-w-6xl mx-auto flex justify-between items-center gap-5">
        {/* Logo */}
        <h1
          className="text-2xl font-bold cursor-pointer bg-gradient-to-r from-gray-100 to-orange-300 bg-clip-text text-transparent pl-4"
          onClick={() => navigate("/")}
        >
          Gó~br
        </h1>

        {/* Desktop Navigation */}
        <div className="hidden md:flex space-x-6">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleScroll(item.ref)}
              className="hover:text-orange-400 transition duration-300"
            >
              {item.name}
            </button>
          ))}

          {isLogin ? (
            <button
              onClick={handleLogout}
              className="bg-red-600 hover:bg-red-700 px-5 py-2 rounded-lg transition duration-300"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="text-xs bg-white text-gray-900 hover:bg-gray-300 px-4 py-1 rounded-full transition duration-300"
            >
              Login / Signup
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="md:hidden">
          <button onClick={toggleMenu} className="text-white text-3xl">
            ☰
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-gray-800 text-white p-4 rounded-lg mt-2">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => handleScroll(item.ref)}
              className="block w-full text-left px-4 py-2 hover:text-orange-400 transition duration-300"
            >
              {item.name}
            </button>
          ))}

          {isLogin ? (
            <button
              onClick={handleLogout}
              className="w-full bg-red-600 hover:bg-red-700 px-4 py-2 rounded-lg transition duration-300 mt-2"
            >
              Logout
            </button>
          ) : (
            <button
              onClick={() => navigate("/")}
              className="w-full bg-white text-gray-900 hover:bg-gray-300 px-4 py-2 rounded-full transition duration-300 mt-2"
            >
              Login / Signup
            </button>
          )}
        </div>
      )}
    </nav>
  );
};

export default Navbar;

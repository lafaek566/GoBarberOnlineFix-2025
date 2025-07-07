import React, { useState, useEffect, useRef } from "react";
import AOS from "aos";
import "aos/dist/aos.css"; // Import AOS CSS
import Navbar from "./breakdown/Navbar";
import Barbers from "./breakdown/Barber";
import Gallery from "./breakdown/Gallery";
import AllReview from "./breakdown/review";
import Footer from "./breakdown/footer";
import PromoPage from "./breakdown/Promo";
import Features from "./breakdown/Features";
import ClientBarbershop from "./breakdown/client";
import Become from "./breakdown/become.jsx";

const Dashboard = () => {
  const [isDarkMode, setIsDarkMode] = useState(false);
  const [hiddenBarbers, setHiddenBarbers] = useState({});
  const [activeFilter, setActiveFilter] = useState("popular");
  const [showScrollNav, setShowScrollNav] = useState(false);

  // Refs untuk navigasi scroll
  const homeRef = useRef(null);
  const featuresRef = useRef(null);
  const promoRef = useRef(null);
  const galleryRef = useRef(null);
  const reviewRef = useRef(null);
  const clientRef = useRef(null);
  const barbersRef = useRef(null);

  useEffect(() => {
    AOS.init({ duration: 1000, once: true });

    const handleScroll = () => {
      setShowScrollNav(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleBoxClick = (id) => {
    setHiddenBarbers((prevState) => ({
      ...prevState,
      [id]: !prevState[id],
    }));
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scrollToSection = (section) => {
    section.current.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div
      className={`min-h-screen p-10 ${
        isDarkMode ? "bg-gray-800 text-white" : "bg-gray-400 text-gray-900"
      }`}
    >
      <Navbar
        refs={{
          homeRef,
          featuresRef,
          promoRef,
          galleryRef,
          reviewRef,
          clientRef,
          barbersRef,
        }}
      />

      {/* Header Section */}
      <div ref={homeRef} className="text-center mb-12 mt-8">
        <h1 className="text-5xl font-bold text-gray-800">Welcome</h1>
        <p className="mt-4 text-lg text-gray-600">
          Find your perfect barber experience starts here
        </p>
      </div>

      {/* Barbers Section */}
      <div ref={barbersRef}>
        <Barbers
          hiddenBarbers={hiddenBarbers}
          handleBoxClick={handleBoxClick}
        />
      </div>

      {/* Gallery Section */}
      <div ref={galleryRef} className="mt-20" data-aos="fade-up">
        <Gallery
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />
      </div>

      {/* Features Section */}
      <div ref={featuresRef}>
        <Features />
      </div>

      {/* Become Section */}
      <div ref={featuresRef}>
        <Become />
      </div>

      {/* Promo Section */}
      <div ref={promoRef}>
        <PromoPage />
      </div>

      {/* Client Barbershop */}
      <div ref={clientRef}>
        <ClientBarbershop />
      </div>

      {/* Barbers Review Section */}
      <div ref={reviewRef} className="mt-20">
        <AllReview />
      </div>

      {/* Footer */}
      <Footer />

      {/* Scroll to Top Button */}
      {showScrollNav && (
        <button
          onClick={scrollToTop}
          className="fixed bottom-10 right-10 p-4 bg-gray-500 text-white rounded-full shadow-lg hover:bg-gray-600 transition-all"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M12 19V6M5 13l7-7 7 7" />
          </svg>
        </button>
      )}
    </div>
  );
};

export default Dashboard;

import React from "react";
import { motion, useAnimation } from "framer-motion";
import { useEffect } from "react";
import { useInView } from "react-intersection-observer";
import {
  FaMapMarkerAlt,
  FaRegCreditCard,
  FaUserCheck,
  FaUsers,
  FaSearchLocation,
  FaCut,
} from "react-icons/fa";

const featureData = [
  {
    icon: <FaCut className="text-[#FF8C00] text-5xl mb-4 mx-auto" />,
    title: "Easy Booking",
    description:
      "Booking can be done at the barber shop or through home visits, according to your needs.",
    delay: 0.2,
  },
  {
    icon: <FaRegCreditCard className="text-[#FFB84D] text-5xl mb-4 mx-auto" />,
    title: "Fast Payment",
    description:
      "Payments can be made using QRIS or bank transfer for your convenience.",
    delay: 0.4,
  },
  {
    icon: <FaUserCheck className="text-[#FF8C00] text-5xl mb-4 mx-auto" />,
    title: "Professional Barbers",
    description:
      "All of our barbers are licensed and professional, ensuring the best service quality.",
    delay: 0.6,
  },
  {
    icon: <FaMapMarkerAlt className="text-[#FFB84D] text-5xl mb-4 mx-auto" />,
    title: "Uses Maps Directions",
    description:
      "We provide directions using maps to easily locate our services.",
    delay: 0.8,
  },
  {
    icon: <FaUsers className="text-[#FF8C00] text-5xl mb-4 mx-auto" />,
    title: "Interactive User Experience",
    description:
      "This website is designed for an easy and comfortable user experience.",
    delay: 1.0,
  },
  {
    icon: <FaSearchLocation className="text-[#FFB84D] text-5xl mb-4 mx-auto" />,
    title: "Choose Your Barber",
    description:
      "You can select your preferred barber for the best experience.",
    delay: 1.2,
  },
  {
    icon: <FaSearchLocation className="text-[#FF8C00] text-5xl mb-4 mx-auto" />,
    title: "Find Nearest Barber",
    description:
      "Easily find the nearest barber shop from your location using our search feature.",
    delay: 1.4,
  },
];

const FeatureCard = ({ icon, title, description, delay }) => {
  const controls = useAnimation();
  const { ref, inView } = useInView({
    triggerOnce: false,
    threshold: 0.5, // Animasi berjalan saat 20% elemen terlihat
  });

  useEffect(() => {
    if (inView) {
      controls.start("visible");
    }
  }, [controls, inView]);

  return (
    <motion.div
      ref={ref}
      initial="hidden"
      animate={controls}
      variants={{
        hidden: { opacity: 0, y: 50, scale: 0.9 },
        visible: { opacity: 1, y: 0, scale: 1 },
      }}
      transition={{ duration: 0.8, delay }}
      whileHover={{ scale: 1.05 }}
      className="bg-gradient-to-r from-gray-800 via-gray-900 to-black text-white p-6 rounded-3xl shadow-xl text-center"
    >
      {icon}
      <h3 className="text-xl font-semibold mb-2">{title}</h3>
      <p className="text-sm">{description}</p>
    </motion.div>
  );
};

const FeaturesSection = () => {
  return (
    <div className="mt-20 px-4 sm:px-6 lg:px-8">
      <motion.h2
        className="text-3xl font-extrabold text-center text-gray-800 mb-8"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Features & Services
      </motion.h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-12">
        {featureData.map((feature, index) => (
          <FeatureCard key={index} {...feature} />
        ))}
      </div>
    </div>
  );
};

export default FeaturesSection;

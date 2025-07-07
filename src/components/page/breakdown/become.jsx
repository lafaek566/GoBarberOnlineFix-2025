import { motion } from "framer-motion";
import { Scissors, Users, DollarSign } from "lucide-react";
import { useNavigate } from "react-router-dom";

const BarbermanSection = () => {
  const navigate = useNavigate();

  return (
    <section
      className="py-20 text-center bg-cover bg-center rounded-3xl mt-20"
      style={{
        backgroundImage:
          "url('https://i.pinimg.com/736x/8a/36/c1/8a36c1fe02df62cdad2e70dff2f6e43e.jpg')",
      }}
    >
      <motion.h2
        className="text-3xl font-bold text-white mb-6"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        Jadilah Seorang Barberman - Gabung Disini!
      </motion.h2>

      <div className="max-w-2xl mx-auto grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-10">
        {[
          {
            icon: <Scissors size={40} />,
            title: "Skill Profesional",
            desc: "Asah kemampuan mencukur dengan standar tinggi.",
          },
          {
            icon: <Users size={40} />,
            title: "Komunitas Barber",
            desc: "Gabung dengan komunitas barber terbaik.",
          },
          {
            icon: <DollarSign size={40} />,
            title: "Penghasilan Stabil",
            desc: "Dapatkan pelanggan tetap dan penghasilan stabil.",
          },
        ].map((item, index) => (
          <motion.div
            key={index}
            className="p-6 bg-gray-200 bg-opacity-70 shadow-lg rounded-2xl flex flex-col items-center gap-4 cursor-pointer"
            whileHover={{ scale: 1.05 }}
          >
            <div className="text-black">{item.icon}</div>
            <h3 className="text-lg font-semibold text-gray-900">
              {item.title}
            </h3>
            <p className="text-gray-600 text-sm">{item.desc}</p>
          </motion.div>
        ))}
      </div>

      <motion.button
        className="mt-8 px-6 py-3 bg-orange-600 text-white font-semibold rounded-xl shadow-lg hover:bg-orange-500"
        whileHover={{ scale: 1.1 }}
        onClick={() => navigate("/register-barber")}
      >
        Daftar Sekarang
      </motion.button>
    </section>
  );
};

export default BarbermanSection;

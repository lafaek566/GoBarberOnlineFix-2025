import React, { useState } from "react";
import { motion } from "framer-motion";
import { FaStar } from "react-icons/fa";
import profile from "../../../assets/barber/4.jpeg";

const Barbers = ({ hiddenBarbers, handleBoxClick }) => {
  const barbers = [
    {
      id: 1,
      name: "Glasgow",
      image:
        "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRqb83s5UR5p87KZl7r0JXyi-LIOG3i2OSukJmF06OD-4d5zHt4Qgum9USyUO0mSLop0N8&usqp=CAU",
      specialty: "Beard Grooming",
      rating: 4,
      backgroundImage:
        "https://i.pinimg.com/736x/bc/0b/d9/bc0bd9d7b124a2c99b7a140f75e8e403.jpg",
    },

    {
      id: 2,
      name: "Pio ś Padre",
      image: profile,
      specialty: "Men's Haircuts",
      rating: 5, // Adding a rating for each barber
      backgroundImage:
        "https://i.pinimg.com/474x/2b/79/fc/2b79fc82186479297a09227461761498.jpg",
    },

    {
      id: 3,
      name: "Captain Barbershop",
      image:
        "https://i.pinimg.com/736x/31/b1/65/31b1659b545a9ab14a33be18d29d4580.jpg",
      specialty: "Hair Coloring",
      rating: 3,
      backgroundImage:
        "https://i.pinimg.com/474x/2d/a2/68/2da268b464183333484fce0239a6390c.jpg",
    },
  ];

  return (
    <div className="mt-20 flex justify-center items-center space-x-9">
      {barbers.map((barber, index) => (
        <motion.div
          key={barber.id}
          className="bg-white p-12 rounded-3xl shadow-lg dark:bg-gray-700 dark:text-white w-64"
          initial={{ opacity: 0, x: -100 }}
          animate={{
            opacity: hiddenBarbers[barber.id] ? 0 : 1,
            x: hiddenBarbers[barber.id] ? 100 : 0,
          }}
          transition={{
            delay: 0.2 * index,
            type: "spring",
            stiffness: 100,
            duration: 0.5,
          }}
          whileHover={{
            scale: 1.05,
            cursor: "pointer",
            transition: { duration: 0.3 },
          }}
          whileTap={{
            scale: 0.95,
            transition: { duration: 0.1 },
          }}
          onClick={() => handleBoxClick(barber.id)}
          style={{
            backgroundImage: `url(${barber.backgroundImage})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            minHeight: "500px", // Set a min height for the box to fit the image
          }}
        >
          <motion.img
            src={barber.image}
            alt={barber.name}
            className="w-40 h-40 rounded-full mx-auto mb-10 object-cover"
            whileHover={{ scale: 1.4 }}
            transition={{ duration: 0.3 }}
          />

          <h2 className="text-xl font-semibold text-center">{barber.name}</h2>
          <p className="text-center text-gray-500 dark:text-gray-300">
            {barber.specialty}
          </p>
          <div className="flex justify-center mt-2">
            {[...Array(5)].map((_, i) => (
              <FaStar
                key={i}
                className={`text-yellow-500 ${
                  i < barber.rating ? "fill-current" : "text-gray-300"
                }`}
              />
            ))}
          </div>
        </motion.div>
      ))}
    </div>
  );
};

export default Barbers;

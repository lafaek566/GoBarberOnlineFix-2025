import React from "react";
import { FaInstagram, FaGithub, FaLinkedinIn } from "react-icons/fa";
import { motion } from "framer-motion";

const Footer = () => {
  return (
    <footer
      className="relative bg-gray-800 text-white py-12 mt-20 w-full rounded-3xl bg-cover bg-center"
      style={{
        backgroundImage:
          'url("https://i.pinimg.com/474x/2b/79/fc/2b79fc82186479297a09227461761498.jpg")',
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundAttachment: "fixed",
        minHeight: "400px",
      }}
    >
      {/* Dark overlay */}
      <div className="absolute inset-0 bg-black bg-opacity-30 rounded-3xl shadow-xl"></div>

      <div className="relative z-10 max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
          {/* About Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">About Me</h3>
            <p className="text-white text-xs">
              We are a passionate team dedicated to providing the best services
              for our clients. Your satisfaction is our priority.
            </p>
          </div>

          {/* Links Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white">Quick Links</h3>
            <ul className="space-y-2 text-white text-xs">
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Privacy Policy
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Terms of Service
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  Contact Us
                </a>
              </li>
              <li>
                <a
                  href="#"
                  className="hover:text-white transition duration-300"
                >
                  FAQ
                </a>
              </li>
            </ul>
          </div>

          {/* Social Media Section */}
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-white text-center">
              Follow Us
            </h3>
            <div className="flex space-x-4 justify-center">
              <motion.a
                href="https://www.instagram.com/elvren__/"
                className="text-white hover:text-pink-500 transition duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaInstagram size={30} />
              </motion.a>

              <motion.a
                href="https://github.com/lafaek566?tab=repositories"
                className="text-white hover:text-white transition duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaGithub size={30} />
              </motion.a>

              <motion.a
                href="https://www.linkedin.com/in/elvren/"
                className="text-white hover:text-blue-500 transition duration-300"
                whileHover={{ scale: 1.2 }}
                whileTap={{ scale: 0.9 }}
              >
                <FaLinkedinIn size={30} />
              </motion.a>
            </div>
          </div>
        </div>

        {/* Copyright Section */}
        <div>
          <p className="text-center text-white-400 text-lg mt-10">
            &copy; {new Date().getFullYear()} || @elvren. All rights reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

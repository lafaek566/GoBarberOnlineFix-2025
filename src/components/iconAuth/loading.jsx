import { motion } from "framer-motion";

const LoadingPage = () => {
  return (
    <div className="flex flex-col justify-center items-center h-screen bg-black">
      {/* Lingkaran utama dengan efek glow */}
      <motion.div
        className="relative flex justify-center items-center w-24 h-24"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: [0.8, 1, 0.8], opacity: [0, 1, 1, 0] }}
        transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
      >
        <div className="w-16 h-16 border-4 border-blue-500 border-t-transparent rounded-full animate-spin shadow-lg shadow-blue-500/50"></div>

        {/* Titik orbit dengan efek pulse */}
        {[...Array(3)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute w-4 h-4 bg-blue-500 rounded-full shadow-lg shadow-blue-500/50"
            initial={{ rotate: 0, scale: 1 }}
            animate={{ rotate: 360, scale: [1, 1.5, 1] }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
            style={{
              top: "50%",
              left: "50%",
              transform: `translate(-50%, -50%) rotate(${
                i * 120
              }deg) translate(40px)`,
            }}
          ></motion.div>
        ))}
      </motion.div>

      {/* Animasi teks "Loading..." dengan efek wave */}
      <div className="flex mt-4 space-x-1">
        {"Loading...".split("").map((char, index) => (
          <motion.span
            key={index}
            className="text-blue-400 text-2xl font-semibold drop-shadow-lg"
            initial={{ y: 0 }}
            animate={{ y: [-5, 5, -5] }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              delay: index * 0.1,
              ease: "easeInOut",
            }}
          >
            {char}
          </motion.span>
        ))}
      </div>
    </div>
  );
};

export default LoadingPage;

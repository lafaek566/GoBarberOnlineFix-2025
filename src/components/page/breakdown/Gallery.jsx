import React, { useState } from "react";
import { motion } from "framer-motion";

const Gallery = ({ activeFilter, setActiveFilter }) => {
  const galleryImages = [
    {
      src: [
        "https://i.pinimg.com/736x/13/a1/8b/13a18beec35e3db6010a03033dfb7ab7.jpg",
        "https://i.pinimg.com/474x/b1/a2/0d/b1a20d19be4bfc2b96f17181a2cd05fb.jpg",
        "https://i.pinimg.com/474x/24/e8/2f/24e82f48fc60a02d99ee62b1d4cc49f3.jpg",
        "https://i.pinimg.com/474x/ff/61/e0/ff61e09eb0f8b14c2a5e9c09c65923bc.jpg",
        "https://i.pinimg.com/474x/43/14/e2/4314e2d2593987e79443efae6138c5ea.jpg",
        "https://i.pinimg.com/474x/6a/6e/40/6a6e40754306045b8e7cf5a11735653b.jpg",
      ],
      category: "popular",
    },
    {
      src: [
        "https://i.pinimg.com/736x/9b/0f/e3/9b0fe307d2a97ffa4d5cb016327fe568.jpg",
        "https://i.pinimg.com/474x/f7/16/d2/f716d2f14990ec577debf36188f23cc8.jpg",
        "https://i.pinimg.com/474x/ce/4d/42/ce4d420799e2fd76a804285e0ac3c8fa.jpg",
        "https://i.pinimg.com/474x/f0/d4/1d/f0d41db633a586660ec7d0cfd1f91cb1.jpg",
        "https://i.pinimg.com/474x/83/b4/ce/83b4ce5709549d1c3ccd6945c8dfa083.jpg",
        "https://i.pinimg.com/474x/8c/32/ea/8c32ea2641effbf2bae6c2543f33ae37.jpg",
      ],
      category: "latest",
    },
    {
      src: [
        "https://i.pinimg.com/474x/cb/c0/eb/cbc0eb8d11fd395e9e3e8b5f005e3a6b.jpg",
        "https://i.pinimg.com/474x/11/1e/0e/111e0e06aaf1f1532fb415f02d0ba612.jpg",
        "https://i.pinimg.com/474x/6d/a3/94/6da394af04f2cb1ae0ebd7076709103e.jpg",
        "https://i.pinimg.com/474x/49/70/d7/4970d7965007efc6829aaa3d9e3c851f.jpg",
        "https://i.pinimg.com/474x/1d/a8/cb/1da8cbf6455b98d426c3231da9b1f848.jpg",
        "https://i.pinimg.com/474x/02/ad/4d/02ad4d9018995cfbb0a5da1586e8c8b7.jpg",
      ],
      category: "top-rated",
    },
  ];

  const filteredImages =
    activeFilter === "all"
      ? galleryImages
      : galleryImages.filter((image) => image.category === activeFilter);

  // State for handling the modal and image being clicked
  const [modalImage, setModalImage] = useState(null);
  const [dragging, setDragging] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [imagePos, setImagePos] = useState({ x: 0, y: 0 });

  // Function to handle closing the modal
  const closeModal = () => {
    setModalImage(null);
    setDragging(false);
  };

  // Start dragging
  const handleMouseDown = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({ x: e.clientX, y: e.clientY });
  };

  // Handle dragging
  const handleMouseMove = (e) => {
    if (dragging) {
      const dx = e.clientX - startPos.x;
      const dy = e.clientY - startPos.y;
      setImagePos({
        x: imagePos.x + dx,
        y: imagePos.y + dy,
      });
      setStartPos({ x: e.clientX, y: e.clientY });
    }
  };

  // Stop dragging
  const handleMouseUp = () => {
    setDragging(false);
  };

  // For mobile devices, handle touch events
  const handleTouchStart = (e) => {
    e.preventDefault();
    setDragging(true);
    setStartPos({
      x: e.touches[0].clientX,
      y: e.touches[0].clientY,
    });
  };

  const handleTouchMove = (e) => {
    if (dragging) {
      const dx = e.touches[0].clientX - startPos.x;
      const dy = e.touches[0].clientY - startPos.y;
      setImagePos({
        x: imagePos.x + dx,
        y: imagePos.y + dy,
      });
      setStartPos({
        x: e.touches[0].clientX,
        y: e.touches[0].clientY,
      });
    }
  };

  const handleTouchEnd = () => {
    setDragging(false);
  };

  return (
    <div className="mt-20">
      <h2 className="text-3xl font-bold text-center mb-10">Gallery</h2>

      <div className="flex justify-center space-x-4 mb-10 rounded-3xl">
        {["all", "popular", "latest", "top-rated"].map((filter) => (
          <motion.button
            key={filter}
            className={`px-3 py-2 rounded-3xl text-xs font-semibold  ${
              activeFilter === filter
                ? "bg-gray-500 text-white"
                : "bg-gray-300 text-gray-800"
            }`}
            onClick={() => setActiveFilter(filter)}
            whileHover={{ scale: 1.3, transition: { duration: 0.3 } }}
            whileTap={{ scale: 0.95, transition: { duration: 0 } }}
          >
            {filter === "all"
              ? "All"
              : filter === "popular"
              ? "Popular"
              : filter === "latest"
              ? "Latest"
              : "Top Rated"}
          </motion.button>
        ))}
      </div>

      <motion.div
        className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
      >
        {filteredImages.map((image, index) => {
          // Handle multiple images if src is an array
          const imageSources = Array.isArray(image.src)
            ? image.src
            : [image.src];

          return imageSources.map((src, i) => (
            <motion.div
              key={`${index}-${i}`} // Ensure unique key for each image
              className="relative overflow-hidden rounded-3xl shadow-lg transform transition-transform duration-300 hover:scale-105"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.3 }}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <img
                src={src}
                alt={`Gallery Image ${index + 1}-${i + 1}`}
                className="w-full h-48 sm:h-56 md:h-64 lg:h-72 object-cover rounded-3xl"
                style={{ objectFit: "cover" }} // Ensures the image covers the box without distortion
                onClick={() => setModalImage(src)} // Open the modal with the clicked image
              />
            </motion.div>
          ));
        })}
      </motion.div>

      {/* Modal for zoomed-in image */}
      {modalImage && (
        <div
          className="fixed top-0 left-0 right-0 bottom-0 bg-black bg-opacity-75 flex justify-center items-center z-50"
          onClick={closeModal} // Close modal on click outside the image
        >
          <motion.div
            className="relative max-w-4xl max-h-[90%] overflow-auto rounded-xl"
            whileHover={{ scale: 1.05 }} // Optional zoom effect on hover
            transition={{ duration: 0.3 }}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            onTouchStart={handleTouchStart}
            onTouchMove={handleTouchMove}
            onTouchEnd={handleTouchEnd}
            style={{
              cursor: dragging ? "grabbing" : "grab",
              transform: `translate(${imagePos.x}px, ${imagePos.y}px)`, // Move image based on mouse/touch drag
            }}
          >
            <img
              src={modalImage}
              alt="Zoomed Image"
              className="w-full h-full object-contain rounded-xl transition-all duration-300"
              style={{
                objectFit: "contain", // Maintain aspect ratio and fit within the modal
              }}
              onClick={(e) => e.stopPropagation()} // Prevent closing the modal if the image is clicked
            />
            <button
              onClick={closeModal}
              className="absolute top-4 right-4  text-white rounded-full p-1"
            >
              &#x2715; {/* Close button */}
            </button>
          </motion.div>
        </div>
      )}
    </div>
  );
};

export default Gallery;

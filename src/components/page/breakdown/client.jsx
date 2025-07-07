import React, { useState, useEffect } from "react";
import Modal from "react-modal"; // Assuming you're using the 'react-modal' package

const ClientBarbershop = () => {
  const [barbers, setBarbers] = useState([]);
  const [selectedImage, setSelectedImage] = useState(null);

  useEffect(() => {
    const fetchBarbers = async () => {
      const response = await fetch("http://localhost:5001/api/barbers");
      const data = await response.json();
      setBarbers(data);
    };
    fetchBarbers();
  }, []);

  return (
    <div className="container mx-auto p-2 my-12">
      <h2 className="text-4xl font-bold text-center mb-8">Our Clients</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-8">
        {barbers.map((barber, index) => (
          <div
            key={index}
            className="bg-gray-800 text-white shadow-lg rounded-lg overflow-hidden transition transform duration-300 hover:scale-105 hover:shadow-xl"
          >
            {/* Barber Profile */}
            <div className="flex flex-col items-center p-6">
              <div className="w-24 h-24 rounded-full bg-gray-300 overflow-hidden shadow-md mb-4">
                <img
                  src={
                    barber.profile_image
                      ? `http://localhost:5001${barber.profile_image}`
                      : "/default-profile.jpg"
                  }
                  alt={barber.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <h3 className="text-xl font-semibold text-center">
                {barber.name}
              </h3>
              <p className="text-[#FFB84D] text-sm text-center">
                {barber.services}
              </p>
              <p className="text-gray-400 text-xs text-center">
                {barber.location}
              </p>
            </div>

            {/* Gallery */}
            {barber.gallery_images && barber.gallery_images.length > 0 && (
              <div className="mt-4 px-2 pb-6">
                <h4 className="text-lg font-semibold text-white  mb-4 text-center">
                  Gallery
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                  {barber.gallery_images.map((image, index) => (
                    <div
                      key={index}
                      className="relative w-full aspect-w-1 aspect-h-1 rounded-full overflow-hidden shadow-lg cursor-pointer transform transition duration-300 hover:scale-110 hover:shadow-xl"
                      onClick={() =>
                        setSelectedImage(`http://localhost:5001${image}`)
                      }
                    >
                      <img
                        src={`http://localhost:5001${image}`}
                        alt={`Gallery Image ${index + 1}`}
                        className="w-full h-full object-cover rounded-full transition duration-300 ease-in-out transform hover:scale-110"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modal for Zooming Image */}
            {selectedImage && (
              <Modal
                isOpen={!!selectedImage}
                onRequestClose={() => setSelectedImage(null)}
                className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75"
              >
                <div className="relative bg-white p-4 rounded-lg shadow-lg">
                  <button
                    onClick={() => setSelectedImage(null)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-3 py-1 rounded-full hover:bg-red-600"
                  >
                    ✕
                  </button>
                  <img
                    src={selectedImage}
                    alt="Zoomed"
                    className="max-w-full max-h-[90vh] rounded-lg transition duration-300 ease-in-out transform hover:scale-110"
                  />
                </div>
              </Modal>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ClientBarbershop;

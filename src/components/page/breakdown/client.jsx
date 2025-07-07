import React, { useState, useEffect } from "react";
import Modal from "react-modal";

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
    <div className="mt-20 px-4 sm:px-6 md:px-8 max-w-7xl mx-auto">
      <h2 className="text-4xl font-bold text-center mb-12">Our Clients</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-10">
        {barbers.map((barber, index) => (
          <div
            key={index}
            className="bg-white dark:bg-gray-800 rounded-3xl shadow-lg p-8 w-full max-w-[420px] mx-auto hover:shadow-xl transition duration-300"
          >
            {/* Profile Image */}
            <div className="w-32 h-32 rounded-full overflow-hidden shadow-md mx-auto mb-4">
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

            {/* Name */}
            <h3 className="text-2xl font-semibold text-center mb-6 text-gray-800 dark:text-white">
              {barber.name}
            </h3>

            {/* Gallery */}
            {barber.gallery_images?.length > 0 && (
              <div className="w-full">
                <h4 className="text-sm font-medium text-center mb-3 text-gray-700 dark:text-gray-300">
                  Gallery
                </h4>
                <div className="grid grid-cols-3 gap-3">
                  {barber.gallery_images.map((image, idx) => (
                    <div
                      key={idx}
                      className="overflow-hidden rounded-xl shadow cursor-pointer hover:scale-105 transform transition"
                      onClick={() =>
                        setSelectedImage(`http://localhost:5001${image}`)
                      }
                    >
                      <img
                        src={`http://localhost:5001${image}`}
                        alt={`Gallery ${idx + 1}`}
                        className="w-full h-24 object-cover"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Modal */}
      {selectedImage && (
        <Modal
          isOpen={!!selectedImage}
          onRequestClose={() => setSelectedImage(null)}
          className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-75 z-50"
          overlayClassName=""
          ariaHideApp={false}
        >
          <div className="relative max-w-4xl max-h-[90vh] overflow-auto bg-white p-4 rounded-lg shadow-lg">
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded-full hover:bg-red-700 text-lg font-bold"
            >
              ✕
            </button>
            <img
              src={selectedImage}
              alt="Zoomed"
              className="w-full h-full object-contain rounded-lg"
            />
          </div>
        </Modal>
      )}
    </div>
  );
};

export default ClientBarbershop;

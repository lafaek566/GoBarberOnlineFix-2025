import React, { useState, useEffect } from "react";
import axios from "axios";
import { FaEdit, FaTrash } from "react-icons/fa";
import BarberEdit from "../barbers/Editbarber";
import Cookies from "js-cookie";

const BarberList = ({ onEditSuccess }) => {
  const [barbers, setBarbers] = useState([]);
  const [selectedBarber, setSelectedBarber] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Unauthorized: No token provided");
      return;
    }
    axios
      .get("http://localhost:5001/api/barbers/", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBarbers(response.data))
      .catch((err) => setError("Error fetching barbers: " + err.message));
  }, []);

  const handleDelete = (id) => {
    const token = Cookies.get("token");
    if (!token) {
      setError("Unauthorized: No token provided");
      return;
    }
    if (!window.confirm("Are you sure you want to delete this barber?")) {
      return;
    }
    axios
      .delete(`http://localhost:5001/api/barbers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then(() =>
        setBarbers((prev) => prev.filter((barber) => barber.id !== id))
      )
      .catch((err) => setError("Error deleting barber: " + err.message));
  };

  return (
    <div className="container mx-auto px-6 py-4 mt-6">
      <h1 className="text-4xl font-bold text-center text-gray-800 mb-10 tracking-wide">
        Barber List
      </h1>
      {error && (
        <div className="bg-red-100 text-red-700 border border-red-400 p-4 rounded-lg mb-4 text-center">
          {error}
        </div>
      )}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {barbers.length > 0 ? (
          barbers.map((barber) => (
            <div
              key={barber.id}
              className="bg-white shadow-lg rounded-xl overflow-hidden transform transition duration-300 hover:scale-105"
            >
              <div className="p-6 flex flex-col items-center text-center">
                <img
                  src={`http://localhost:5001${barber.profile_image}`}
                  alt={barber.name}
                  className="w-24 h-24 object-cover rounded-full border-4 border-gray-300 shadow-md"
                />
                <h2 className="mt-4 text-xl font-semibold text-gray-800">
                  {barber.name}
                </h2>
                <p className="text-gray-600">{barber.no_telp}</p>
                <div className="mt-4 space-y-1 text-gray-700 text-sm">
                  <p>
                    <span className="font-semibold">Service:</span>{" "}
                    {barber.services}
                  </p>
                  <p>
                    <span className="font-semibold">Paket:</span> {barber.paket}
                  </p>
                  <p>
                    <span className="font-semibold">Price:</span> $
                    {barber.price}
                  </p>
                  <p>
                    <span className="font-semibold">Bank:</span>{" "}
                    {barber.bank_name}
                  </p>
                  <p>
                    <span className="font-semibold">Payment:</span>{" "}
                    {barber.payment_method}
                  </p>
                </div>
                <div className="mt-4 flex space-x-4">
                  <button
                    onClick={() => setSelectedBarber(barber)}
                    className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition"
                  >
                    <FaEdit className="mr-2" /> Edit
                  </button>
                  <button
                    onClick={() => handleDelete(barber.id)}
                    className="flex items-center bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-700 transition"
                  >
                    <FaTrash className="mr-2" /> Delete
                  </button>
                </div>
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-600 col-span-full">
            No barbers found
          </p>
        )}
      </div>
      {selectedBarber && (
        <BarberEdit
          barber={selectedBarber}
          onEditSuccess={(updatedBarber) => {
            setBarbers((prev) =>
              prev.map((barber) =>
                barber.id === updatedBarber.id ? updatedBarber : barber
              )
            );
            setSelectedBarber(null);
          }}
          onCancel={() => setSelectedBarber(null)}
        />
      )}
    </div>
  );
};

export default BarberList;

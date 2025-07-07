import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import Cookies from "js-cookie";

const EditBarber = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [barber, setBarber] = useState({
    name: "",
    services: "",
    price: "",
    paket: "",
    paket_description: "",
    profile_image: "",
    bank_name: "",
    account_number: "",
    payment_method: "",
    no_telp: "",
    latitude: "",
    longitude: "",
  });

  useEffect(() => {
    const token = Cookies.get("token");
    axios
      .get(`http://localhost:5001/api/barbers/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((response) => setBarber(response.data))
      .catch((err) => console.error("Error fetching barber:", err));
  }, [id]);

  const handleChange = (e) => {
    setBarber({ ...barber, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = Cookies.get("token");

    const barberData = {
      name: barber.name,
      services: barber.services,
      price: barber.price,
      paket: barber.paket,
      paket_description: barber.paket_description,
      no_telp: barber.no_telp,
      profile_image: barber.profile_image || null, // Optional, set null if empty
      bank_name: barber.bank_name || null, // Optional
      account_number: barber.account_number || null, // Optional
      payment_method: barber.payment_method || null,
    };

    try {
      await axios.put(
        `http://localhost:5001/api/barbers/update/${id}`,
        barberData,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      alert("Barber updated successfully!");
      navigate(`/edit-barber/${id}`);
    } catch (err) {
      console.error("Error updating barber:", err.response?.data || err);
    }
  };

  const handleBack = () => {
    navigate(`/barber/${id}`);
  };

  return (
    <div className="min-h-screen p-10 bg-gray-100">
      <div className="container mx-auto px-6 py-12">
        <h1 className="text-4xl font-semibold text-center">Edit Barber</h1>

        <form
          onSubmit={handleSubmit}
          className="bg-white p-6 rounded-lg shadow-md mt-6"
        >
          <div className="mb-4">
            <label className="block text-gray-700">Name</label>
            <input
              type="text"
              name="name"
              value={barber.name}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Telp</label>
            <input
              type="number"
              name="no_telp"
              value={barber.no_telp}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Services</label>
            <input
              type="text"
              name="services"
              value={barber.services}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Price</label>
            <input
              type="number"
              name="price"
              value={barber.price}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Paket</label>
            <select
              name="paket"
              value={barber.paket}
              onChange={handleChange}
              className="w-full p-2 border rounded"
              required
            >
              <option value="">Select a package</option>
              <option value="basic">Basic</option>
              <option value="medium">Medium</option>
              <option value="vip">VIP</option>
            </select>
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Paket Description</label>
            <input
              type="text"
              name="paket_description"
              value={barber.paket_description}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <div className="mb-4">
            <label className="block text-gray-700">Payment Method</label>
            <input
              type="text"
              name="payment_method"
              value={barber.payment_method}
              onChange={handleChange}
              className="w-full p-2 border rounded"
            />
          </div>

          <button
            type="submit"
            className="px-4 py-2 bg-blue-600 text-white rounded"
          >
            Update Barber
          </button>

          <button
            type="button"
            onClick={handleBack}
            className="ml-4 px-4 py-2 bg-gray-400 text-white rounded"
          >
            Back
          </button>
        </form>
      </div>
    </div>
  );
};

export default EditBarber;

import React, { useState, useEffect } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { useNavigate } from "react-router-dom";

const BookingForm = ({ barberId }) => {
  const [email, setEmail] = useState("");
  const [appointmentTime, setAppointmentTime] = useState("");
  const [location, setLocation] = useState("barbershop");
  const [service, setService] = useState("");
  const [paket, setPaket] = useState("");
  const [paketDescription, setPaketDescription] = useState("");
  const [address, setAddress] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();
  const [barberPrice, setBarberPrice] = useState(null);
  const [Price, setPrice] = useState("");
  const [barberData, setBarberData] = useState(null);
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);

  // Bank and Payment Info States
  const [bankName, setBankName] = useState("");
  const [accountNumber, setAccountNumber] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("");

  useEffect(() => {
    const fetchBarberData = async () => {
      if (barberId) {
        try {
          const response = await axios.get(
            `http://localhost:5001/api/barbers/${barberId}`
          );

          if (response.data) {
            setBarberData(response.data);
            setBarberPrice(response.data.price);
            setBankName(response.data.bank_name || "N/A"); // Default to "N/A" if not available
            setAccountNumber(response.data.account_number || "N/A"); // Default to "N/A" if not available
            setPaymentMethod(response.data.payment_method || "N/A"); // Default to "N/A" if not available

            const { latitude, longitude } = response.data;

            if (latitude && longitude) {
              setLatitude(latitude);
              setLongitude(longitude);
              const address = await getAddressFromCoordinates(
                latitude,
                longitude
              );
              setAddress(address);
            } else {
              console.log("Barber location coordinates not available.");
            }
          } else {
            console.log("No data returned from API.");
          }
        } catch (err) {
          setError("Gagal memuat data barber.");
          console.error(err);
        }
      }
    };

    fetchBarberData();
  }, [barberId]);

  useEffect(() => {
    // Auto-fill Price based on the selected package
    if (paket === "Basic") {
      setPrice("30");
    } else if (paket === "Medium") {
      setPrice("50");
    } else if (paket === "VIP") {
      setPrice("100");
    }
  }, [paket]);

  const getAddressFromCoordinates = async (latitude, longitude) => {
    const googleMapsAPIKey = "YOUR_GOOGLE_MAPS_API_KEY";
    try {
      const response = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${latitude},${longitude}&key=${googleMapsAPIKey}`
      );
      const result = response.data.results[0];
      return result ? result.formatted_address : " ";
    } catch (error) {
      console.error("Geocoding error:", error);
      return " ";
    }
  };

  const validateForm = () => {
    if (!email || !appointmentTime || !service || !paket || !paketDescription) {
      setError("Semua kolom harus diisi!");
      return false;
    }

    if (location === "barbershop" && !address) {
      setError("Alamat barber harus diisi jika lokasi adalah barbershop!");
      return false;
    }

    if (location === "home" && !address) {
      setError("Alamat harus diisi jika lokasi adalah rumah!");
      return false;
    }

    setError("");
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validateForm()) return;

    setIsSubmitting(true);

    const bookingData = {
      email,
      barberId,
      appointmentTime,
      location,
      service,
      paket,
      paket_description: paketDescription,
      address,
      price: parseFloat(Price),
      bank_name: bankName,
      account_number: accountNumber,
      payment_method: paymentMethod,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/bookings/add",
        bookingData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (response.data && response.data.bookingId) {
        const bookingId = response.data.bookingId; // assuming your API returns bookingId
        alert(
          `Pemesanan berhasil! Booking ID: ${bookingId}. Gunakan ID ini untuk melakukan pembayaran.`
        );

        // Redirect to the payment page after successful booking
        navigate(`/payment/${bookingId}`); // Pass the bookingId to the payment page

        setIsSubmitting(false);
      } else {
        setError("Gagal mendapatkan booking ID. Coba lagi nanti.");
      }
    } catch (err) {
      if (err.response && err.response.data && err.response.data.errors) {
        const errorMessages = err.response.data.errors.map(
          (error) => error.message
        );
        setError(errorMessages.join(", "));
      } else {
        setError("Gagal membuat booking. Coba lagi nanti.");
      }
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto bg-white p-8 rounded-lg shadow-lg border border-gray-200">
      <h2 className="text-3xl font-semibold text-gray-800 text-center mb-6">
        Buat Janji
      </h2>

      {error && <p className="text-red-500 text-center mb-4">{error}</p>}

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Email Field */}
        <div className="flex flex-col mb-6">
          <label htmlFor="email" className="text-sm font-medium text-gray-700">
            Email
          </label>
          <input
            type="email"
            id="email"
            placeholder="masukan email-mu"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Appointment Time Field */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="appointment-time"
            className="text-sm font-medium text-gray-700"
          >
            Waktu Janji
          </label>
          <input
            type="datetime-local"
            id="appointment-time"
            value={appointmentTime}
            onChange={(e) => setAppointmentTime(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Location Field */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="location"
            className="text-sm font-medium text-gray-700"
          >
            Pilih Lokasi
          </label>
          <select
            id="location"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="barbershop">Barbershop</option>
            <option value="home">Rumah</option>
          </select>
        </div>

        {/* Address Field for Home Location */}
        {location === "home" && (
          <div className="flex flex-col mb-6">
            <label
              htmlFor="address"
              className="text-sm font-medium text-gray-700"
            >
              Alamat
            </label>
            <input
              type="text"
              id="address"
              value={address}
              placeholder="masukan alamat(jika barber ingin ke rumah)"
              onChange={(e) => setAddress(e.target.value)}
              required
              className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
        )}

        {/* Display Barber Location on Map
        {latitude && longitude && (
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700">
              Lokasi Barber
            </label>
            <MapContainer
              center={[latitude, longitude]}
              zoom={14}
              style={{ height: "300px", width: "100%" }}
            >
              <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
              <Marker position={[latitude, longitude]}>
                <Popup>{barberData?.barbershop_name}</Popup>
              </Marker>
            </MapContainer>
          </div>
        )} */}

        {/* Select Service */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="service"
            className="text-sm font-medium text-gray-700"
          >
            Layanan
          </label>
          <select
            id="service"
            value={service}
            onChange={(e) => setService(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Haircut">Haircut</option>
            <option value="Shave">Shave</option>
            <option value="Haircut & Shave">Haircut & Shave</option>
          </select>
        </div>

        {/* Select Paket */}
        <div className="flex flex-col mb-6">
          <label htmlFor="paket" className="text-sm font-medium text-gray-700">
            Pilih Paket
          </label>
          <select
            id="paket"
            value={paket}
            onChange={(e) => setPaket(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="Basic">Basic</option>
            <option value="Medium">Medium</option>
            <option value="VIP">VIP</option>
          </select>
        </div>

        {/* Paket Description */}
        <div className="flex flex-col mb-6">
          x
          <label
            htmlFor="paket-description"
            className="text-sm font-medium text-gray-700"
          >
            Tambahkan catatan
          </label>
          <textarea
            id="paket-description"
            value={paketDescription}
            onChange={(e) => setPaketDescription(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          />
        </div>

        {/* Price Display */}
        <div className="mb-6">
          <label
            htmlFor="price"
            className="block text-sm font-medium text-gray-700"
          >
            Harga: {Price} IDR
          </label>
        </div>

        {/* Payment Details Section */}
        <div className="flex flex-col mb-6">
          <label
            htmlFor="payment-method"
            className="text-sm font-medium text-gray-700"
          >
            Metode Pembayaran
          </label>
          <select
            id="payment-method"
            value={paymentMethod}
            onChange={(e) => setPaymentMethod(e.target.value)}
            required
            className="mt-2 p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="tf">Bank Transfer</option>
            <option value="qris">Cash</option>
          </select>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full p-3 bg-indigo-600 text-white rounded-md hover:bg-indigo-700"
        >
          {isSubmitting ? "Memproses..." : "Buat Janji"}
        </button>
      </form>
    </div>
  );
};

export default BookingForm;

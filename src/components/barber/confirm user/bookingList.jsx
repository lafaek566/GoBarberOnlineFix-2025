import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingList = () => {
  const [bookingList, setBookingList] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [bookingsPerPage] = useState(10);

  // Fetch bookings from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/bookings")
      .then((response) => {
        const sortedBookings = response.data.sort((a, b) => {
          return b.id - a.id; // Sort bookings by ID, latest first
        });
        setBookingList(sortedBookings);
      })
      .catch((err) => {
        setError(
          "Error fetching bookings: " +
            (err.response ? err.response.data.message : err.message)
        );
      });
  }, []);

  const handleUpdateStatus = (bookingId, status) => {
    axios
      .put(
        `http://localhost:5001/api/bookings/${bookingId}/status`,
        { status } // Only send status
      )
      .then((response) => {
        const updatedBookings = bookingList.map((booking) =>
          booking.id === bookingId
            ? { ...booking, status: response.data.status }
            : booking
        );
        setBookingList(updatedBookings);
      })
      .catch((err) => {
        setError(
          "Error updating status: " +
            (err.response ? err.response.data.message : err.message)
        );
      });
  };

  const handleDeleteBooking = (bookingId) => {
    axios
      .delete(`http://localhost:5001/api/bookings/${bookingId}`)
      .then(() => {
        setBookingList(
          bookingList.filter((booking) => booking.id !== bookingId)
        );
      })
      .catch((err) => {
        setError(
          "Error deleting booking: " +
            (err.response ? err.response.data.message : err.message)
        );
      });
  };

  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = bookingList.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );
  const totalPages = Math.ceil(bookingList.length / bookingsPerPage);

  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="mt-12 bg-white p-8 rounded-xl shadow-xl">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">
        Booking List
      </h3>

      {error && (
        <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Appointment Time
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Service
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.map((booking) => (
              <tr key={booking.id} className="border-b hover:bg-gray-50">
                <td className="px-6 py-3 text-sm">{booking.id}</td>
                <td className="px-6 py-3 text-sm">{booking.email}</td>
                <td className="px-6 py-3 text-sm">
                  {booking.appointment_time}
                </td>
                <td className="px-6 py-3 text-sm">{booking.service}</td>
                <td className="px-6 py-3 text-sm">{booking.status}</td>
                <td className="px-6 py-3 text-sm">
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "completed")}
                    className="bg-blue-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "pending")}
                    className="bg-yellow-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel (Set to Pending)
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(booking.id, "cancelled")}
                    className="bg-red-500 text-white px-4 py-2 rounded mr-2"
                  >
                    Cancel (Set to Cancelled)
                  </button>
                  <button
                    onClick={() => handleDeleteBooking(booking.id)}
                    className="bg-red-500 text-white px-4 py-2 rounded"
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-black rounded-l"
        >
          Previous
        </button>
        {[...Array(totalPages)].map((_, index) => (
          <button
            key={index}
            onClick={() => paginate(index + 1)}
            className={`px-4 py-2 ${
              currentPage === index + 1
                ? "bg-blue-500 text-white"
                : "bg-gray-200 text-black"
            }`}
          >
            {index + 1}
          </button>
        ))}
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="px-4 py-2 bg-gray-300 text-black rounded-r"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingList;

import React, { useState, useEffect } from "react";
import axios from "axios";

const BookingList = () => {
  const [bookingList, setBookingList] = useState([]);
  const [filteredBookings, setFilteredBookings] = useState([]);
  const [error, setError] = useState("");
  const [currentPage, setCurrentPage] = useState(1); // Current page
  const [bookingsPerPage] = useState(10); // Number of bookings per page
  const [selectedBarber, setSelectedBarber] = useState(""); // Selected barber

  // Fetch bookings from the backend
  useEffect(() => {
    axios
      .get("http://localhost:5001/api/bookings") // Update this to the correct endpoint
      .then((response) => {
        console.log(response.data); // Log the response to check the data
        // Sort the bookings by appointment_time in descending order
        const sortedBookings = response.data.sort((a, b) => {
          return new Date(b.appointment_time) - new Date(a.appointment_time);
        });
        setBookingList(sortedBookings);
        setFilteredBookings(sortedBookings); // Initially set filtered bookings to all bookings
      })
      .catch((err) => {
        setError("Error fetching bookings: " + err.message);
      });
  }, []);

  // Handle page change
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  // Filter bookings based on selected barber
  const handleBarberSelect = (barberName) => {
    setSelectedBarber(barberName);
    if (barberName) {
      const filtered = bookingList.filter(
        (booking) => booking.barber_name === barberName
      );
      setFilteredBookings(filtered);
    } else {
      setFilteredBookings(bookingList); // If no barber selected, show all bookings
    }
  };

  // Logic for displaying bookings based on current page
  const indexOfLastBooking = currentPage * bookingsPerPage;
  const indexOfFirstBooking = indexOfLastBooking - bookingsPerPage;
  const currentBookings = filteredBookings.slice(
    indexOfFirstBooking,
    indexOfLastBooking
  );

  return (
    <div className="mt-12 bg-white p-8 rounded-xl shadow-xl">
      <h3 className="text-3xl font-semibold text-gray-800 mb-6">
        Booking List
      </h3>

      {/* Error message */}
      {error && (
        <div className="bg-red-200 text-red-800 p-4 rounded-lg mb-6 text-center">
          {error}
        </div>
      )}

      {/* Barber Selector */}
      <div className="mb-6">
        <button
          onClick={() => handleBarberSelect("")}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
        >
          All Barbers
        </button>
        {/* Render a button for each barber in the booking list */}
        {bookingList
          .map((booking) => booking.barber_name)
          .filter((value, index, self) => self.indexOf(value) === index) // Remove duplicates
          .map((barberName) => (
            <button
              key={barberName}
              onClick={() => handleBarberSelect(barberName)}
              className={`px-4 py-2 ${
                selectedBarber === barberName
                  ? "bg-blue-500 text-white"
                  : "bg-gray-300 text-gray-700"
              } rounded-lg mr-2`}
            >
              {barberName}
            </button>
          ))}
      </div>

      {/* Table for booking list */}
      <div className="overflow-x-auto">
        <table className="min-w-full table-auto">
          <thead>
            <tr className="bg-gray-100 text-gray-700">
              <th className="px-6 py-3 text-left text-sm font-semibold">ID</th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Email
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Barber
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Location
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Address
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Date
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Service
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Price
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Status
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Bank
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Account Number
              </th>
              <th className="px-6 py-3 text-left text-sm font-semibold">
                Payment Method
              </th>
            </tr>
          </thead>
          <tbody>
            {currentBookings.length > 0 ? (
              currentBookings.map((booking) => (
                <tr key={booking.id} className="border-b">
                  <td className="px-6 py-4 text-sm">{booking.id}</td>
                  <td className="px-6 py-4 text-sm">{booking.email}</td>
                  <td className="px-6 py-4 text-sm">{booking.barber_name}</td>
                  <td className="px-6 py-4 text-sm">
                    {booking.status === "cancelled" ? (
                      <span className="text-gray-500">
                        Location not available (cancelled)
                      </span>
                    ) : booking.status === "pending" ? (
                      <span className="text-gray-500">
                        Location available if Barber approves
                      </span>
                    ) : booking.barber_latitude && booking.barber_longitude ? (
                      <a
                        href={`https://www.google.com/maps?q=${booking.barber_latitude},${booking.barber_longitude}`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 hover:underline"
                      >
                        View Barber Location
                      </a>
                    ) : (
                      <span className="text-gray-500">
                        No location provided
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">{booking.address}</td>
                  <td className="px-6 py-4 text-sm">
                    {new Date(booking.appointment_time).toLocaleString()}
                  </td>
                  <td className="px-6 py-4 text-sm">{booking.service}</td>
                  <td className="px-6 py-4 text-sm">${booking.price}</td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`${
                        booking.status === "completed"
                          ? "bg-green-500 text-white"
                          : booking.status === "confirmed"
                          ? "bg-blue-500 text-white"
                          : "bg-yellow-500 text-white"
                      } px-3 py-1 rounded-full text-sm font-semibold`}
                    >
                      {booking.status.charAt(0).toUpperCase() +
                        booking.status.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {booking.bank_name || "Not Available"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {booking.account_number || "Not Available"}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    {booking.payment_method || "Not Available"}
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="9" className="px-6 py-4 text-center text-gray-500">
                  No bookings found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="mt-4 flex justify-center">
        <button
          onClick={() => paginate(currentPage - 1)}
          disabled={currentPage === 1}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg mr-2"
        >
          Previous
        </button>
        <button
          onClick={() => paginate(currentPage + 1)}
          disabled={currentPage * bookingsPerPage >= filteredBookings.length}
          className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg"
        >
          Next
        </button>
      </div>
    </div>
  );
};

export default BookingList;

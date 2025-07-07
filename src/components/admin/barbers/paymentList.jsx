import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(null); // Untuk gambar modal

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/payments")
      .then((response) => {
        setPayments(response.data.payments);
        setLoading(false);
      })
      .catch((err) => {
        setError("Failed to fetch payment data");
        setLoading(false);
      });
  }, []);

  const handleUpdateStatus = (id, status) => {
    if (!id) {
      console.error("Payment ID is undefined");
      return;
    }

    axios
      .put(`http://localhost:5001/api/payments/${id}`, { status })
      .then((response) => {
        console.log("Status updated successfully:", response.data);
        setPayments((prevPayments) =>
          prevPayments.map((payment) =>
            payment.id === id ? { ...payment, status } : payment
          )
        );
      })
      .catch((err) => {
        console.error("Error updating payment status:", err);
      });
  };

  if (loading) return <p>Loading...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className="p-6 bg-gray-100 min-h-screen">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800">
        Payments List
      </h1>
      <div className="overflow-x-auto">
        <table className="table-auto w-full border-collapse border border-gray-300 bg-white shadow-lg">
          <thead className="bg-gray-800 text-white">
            <tr>
              {/* Table Headers */}
              <th className="px-4 py-2 border border-gray-300">Payment ID</th>
              <th className="px-4 py-2 border border-gray-300">
                Order ID
              </th>{" "}
              {/* New column for Order ID */}
              <th className="px-4 py-2 border border-gray-300">Booking ID</th>
              <th className="px-4 py-2 border border-gray-300">Amount</th>
              <th className="px-4 py-2 border border-gray-300">
                Payment Method
              </th>
              <th className="px-4 py-2 border border-gray-300">User Email</th>
              <th className="px-4 py-2 border border-gray-300">Created At</th>
              <th className="px-4 py-2 border border-gray-300">Barber Name</th>
              <th className="px-4 py-2 border border-gray-300">
                Account Number
              </th>
              <th className="px-4 py-2 border border-gray-300">
                Time of Booking
              </th>
              <th className="px-4 py-2 border border-gray-300">Service</th>
              <th className="px-4 py-2 border border-gray-300">Paket</th>
              <th className="px-4 py-2 border border-gray-300">Bank Name</th>
              <th className="px-4 py-2 border border-gray-300">
                Proof of Payment
              </th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
              <th className="px-4 py-2 border border-gray-300">Actions</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment, index) => (
              <tr
                key={payment.id}
                className={`${
                  index % 2 === 0 ? "bg-gray-100" : "bg-gray-200"
                } hover:bg-gray-300`}
              >
                {/* Table Data */}
                <td className="px-4 py-2 border border-gray-300">
                  {payment.id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.order_id} {/* Displaying Order ID */}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.booking_id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.amount}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.payment_method}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.userEmail}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(payment.created_at).toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.barberName}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.account_number}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(payment.appointment_time).toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.service}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.paket}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.bank_name}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.proofFile ? (
                    <img
                      src={payment.proofFile}
                      alt="Proof of Payment"
                      className="w-30 h-30 object-cover rounded cursor-pointer"
                      onClick={() => setSelectedImage(payment.proofFile)}
                    />
                  ) : (
                    "No Proof Uploaded"
                  )}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.status}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  <button
                    onClick={() => handleUpdateStatus(payment.id, "completed")}
                    className="bg-green-500 text-white px-3 py-1 rounded-md mr-2 hover:bg-green-600"
                  >
                    Mark as Completed
                  </button>
                  <button
                    onClick={() => handleUpdateStatus(payment.id, "failed")}
                    className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
                  >
                    Mark as Failed
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Modal */}
      {selectedImage && (
        <div
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center"
          onClick={() => setSelectedImage(null)}
        >
          <div className="bg-white bg-transparent p-4 rounded shadow-lg flex justify-center items-center">
            <img
              src={selectedImage}
              alt="Selected Proof of Payment"
              className="w-1/2 h-1/2 max-w-full max-h-screen"
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PaymentsList;

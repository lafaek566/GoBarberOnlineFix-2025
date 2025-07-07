import React, { useState, useEffect } from "react";
import axios from "axios";

const PaymentsList = () => {
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    axios
      .get("http://localhost:5001/api/payments/")
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
              <th className="px-4 py-2 border border-gray-300">Payment ID</th>
              <th className="px-4 py-2 border border-gray-300">Booking ID</th>
              <th className="px-4 py-2 border border-gray-300">Amount</th>
              <th className="px-4 py-2 border border-gray-300">
                Payment Method
              </th>
              <th className="px-4 py-2 border border-gray-300">Status</th>
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
                <td className="px-4 py-2 border border-gray-300">
                  {payment.id}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.bookingId}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.amount}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.paymentMethod}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.status}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.userEmail}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(payment.appointment_time).toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.barberName}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.accountNumber}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {new Date(payment.timeOfBooking).toLocaleString()}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.service}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.paket}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.bankName}
                </td>
                <td className="px-4 py-2 border border-gray-300">
                  {payment.proofOfPayment ? (
                    <a
                      href={payment.proofOfPayment}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500 hover:underline"
                    >
                      View Proof
                    </a>
                  ) : (
                    "No Proof Uploaded"
                  )}
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
    </div>
  );
};

export default PaymentsList;

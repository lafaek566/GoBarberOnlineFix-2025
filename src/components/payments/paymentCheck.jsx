import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom"; // Import useNavigate

const PaymentCheck = () => {
  const [orderId, setOrderId] = useState("");
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);
  const navigate = useNavigate(); // Initialize useNavigate

  // Format the date to a readable format
  const formatDate = (dateString) => {
    if (!dateString) return "Not Available";
    const date = new Date(dateString);
    return date.toLocaleString(); // Convert to a readable format
  };

  const handleCheckPayment = async () => {
    if (!orderId) {
      setError("Order ID is required");
      return;
    }

    try {
      setError(null); // Clear previous errors
      setPaymentData(null); // Clear previous result

      const response = await axios.get(
        `http://localhost:5001/api/payments/${orderId}/status-order`
      );

      // Log the response to verify the structure
      console.log(response.data);

      setPaymentData(response.data);

      // Navigate to UserDashboard after successful payment check
      if (response.data.status === "success") {
        navigate("/user-dashboard"); // Redirect to user dashboard
      }
    } catch (err) {
      setError(err.response?.data?.message || "Error fetching payment status");
    }
  };

  // Function to handle back to user dashboard
  const handleBackToDashboard = () => {
    navigate("/user-dashboard"); // Navigate back to user dashboard
  };

  return (
    <div className="max-w-md mx-auto bg-white p-6 rounded-lg shadow-lg">
      <h2 className="text-xl text-center font-semibold mb-4">
        Check Payment Status
      </h2>
      <h3 className="text-xs text-center text-gray-500 font-semibold mb-4">
        (available success order dan get order id <p>make a order in barber)</p>
      </h3>

      <input
        type="text"
        placeholder="Enter Order ID"
        value={orderId}
        onChange={(e) => setOrderId(e.target.value)}
        className="w-full text-center p-2 border rounded-3xl mb-2"
      />

      <button
        onClick={handleCheckPayment}
        className="w-full bg-blue-500 text-white p-2 rounded-3xl hover:bg-blue-600"
      >
        Check Payment
      </button>

      {error && <p className="text-red-500 mt-2">{error}</p>}

      {paymentData && (
        <div className="mt-4 p-4 bg-gray-100 rounded-3xl">
          <h3 className="text-lg font-semibold">Payment Details</h3>
          <p>
            <strong>Status:</strong> {paymentData.status}
          </p>
          <p>
            <strong>Order ID:</strong> {paymentData.order_id}
          </p>

          <p>
            <strong>Amount:</strong>
            {paymentData.gross_amount
              ? `Rp ${parseFloat(paymentData.gross_amount).toFixed(2)}`
              : "Not Available"}
          </p>

          <p>
            <strong>Bank:</strong> {paymentData.bank_name}
          </p>
          <p>
            <strong>Account Number:</strong> {paymentData.account_number}
          </p>
          <p>
            <strong>Barber:</strong> {paymentData.barber_name || "N/A"}
          </p>
          <p>
            <strong>Customer Email:</strong> {paymentData.user_email}
          </p>
          <p>
            <strong>Created At:</strong>{" "}
            {paymentData?.created_at
              ? formatDate(paymentData.created_at)
              : "Not Available"}
          </p>
          <p>
            <strong>Update At:</strong>{" "}
            {paymentData?.updated_at
              ? formatDate(paymentData.updated_at)
              : "Not Available"}
          </p>
          <p>
            <strong>Time Booking:</strong>{" "}
            {paymentData.appointment_time
              ? paymentData.appointment_time
              : "Not Available"}
          </p>
          {paymentData.midtrans_url && (
            <a
              href={paymentData.midtrans_url}
              target="_blank"
              rel="noopener noreferrer"
              className="block text-blue-600 mt-2 underline"
            >
              View Payment on Midtrans
            </a>
          )}
        </div>
      )}

      {/* Back to Dashboard Button */}
      <button
        onClick={handleBackToDashboard}
        className="w-full bg-gray-500 text-white p-2 rounded-3xl mt-4 hover:bg-gray-600"
      >
        Back to Dashboard
      </button>
    </div>
  );
};

export default PaymentCheck;

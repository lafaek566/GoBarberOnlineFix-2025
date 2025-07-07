import React, { useState } from "react";
import axios from "axios";

const PaymentHistory = () => {
  const [bookingId, setBookingId] = useState("");
  const [payments, setPayments] = useState([]);
  const [message, setMessage] = useState("");

  const fetchPayments = async () => {
    try {
      const response = await axios.get(`/api/payments/${bookingId}`);
      setPayments(response.data);
      setMessage("");
    } catch (error) {
      setMessage(
        `Error: ${error.response ? error.response.data.message : error.message}`
      );
      setPayments([]);
    }
  };

  return (
    <div className="container">
      <h2>Payment History</h2>
      <div className="form-group">
        <label>Booking ID</label>
        <input
          type="number"
          value={bookingId}
          onChange={(e) => setBookingId(e.target.value)}
          required
        />
        <button onClick={fetchPayments}>Fetch Payments</button>
      </div>

      {message && <p>{message}</p>}

      {payments.length > 0 && (
        <table>
          <thead>
            <tr>
              <th>Payment Method</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payment Date</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id}>
                <td>{payment.payment_method}</td>
                <td>{payment.amount}</td>
                <td>{payment.status}</td>
                <td>{payment.payment_date}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentHistory;

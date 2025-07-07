import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate(); // For navigation
  const [paymentData, setPaymentData] = useState({
    bookingId: bookingId || "",
    paymentMethod: "",
    qrisCode: "",
    status: "pending",
    amount: 0,
    bank_name: "",
    accountNumber: "",
    userEmail: "",
    barberName: "",
    service: "",
    price: 0,
    invoiceNumber: "",
  });
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (bookingId) {
      axios
        .get(`http://localhost:5001/api/bookings/${bookingId}`)
        .then((response) => {
          const {
            email,
            barber_name,
            service,
            price,
            amount,
            account_number,
            bank_name,
          } = response.data.booking;
          setPaymentData((prevState) => ({
            ...prevState,
            userEmail: email,
            barberName: barber_name,
            service,
            price,
            amount: amount || price,
            accountNumber: account_number || "",
            bank_name: bank_name || "",
          }));
        })
        .catch(() => setMessage("Failed to fetch booking details"));
    }
  }, [bookingId]);

  const generateQrisCode = (price, email, barberName, service) => {
    const qrisPayload = `QRIS_PAYMENT|Amount:${price}|Email:${email}|Barber:${barberName}|Service:${service}`;
    return qrisPayload;
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setPaymentData((prevState) => ({
      ...prevState,
      [name]: value,
      qrisCode:
        name === "paymentMethod" && value === "qris"
          ? generateQrisCode(
              prevState.price,
              prevState.userEmail,
              prevState.barberName,
              prevState.service
            )
          : prevState.qrisCode,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    const amount = parseFloat(paymentData.amount);
    if (isNaN(amount) || amount <= 0) {
      setMessage("Amount is required and should be a positive number.");
      setLoading(false);
      return;
    }

    if (
      paymentData.paymentMethod === "bank_transfer" &&
      !paymentData.accountNumber
    ) {
      setMessage("Account number is required for bank transfer.");
      setLoading(false);
      return;
    }

    if (paymentData.paymentMethod === "qris" && !paymentData.qrisCode) {
      setMessage("QRIS code is required for QRIS payments.");
      setLoading(false);
      return;
    }

    const paymentPayload = {
      bookingId: paymentData.bookingId,
      paymentMethod: paymentData.paymentMethod,
      amount: amount.toFixed(2),
      bank_name:
        paymentData.paymentMethod === "bank_transfer"
          ? paymentData.bank_name
          : undefined,
      accountNumber:
        paymentData.paymentMethod === "bank_transfer"
          ? paymentData.accountNumber
          : undefined,
      qrisCode:
        paymentData.paymentMethod === "qris" ? paymentData.qrisCode : null,
    };

    try {
      const response = await axios.post(
        "http://localhost:5001/api/payments/snap",
        paymentPayload
      );
      const {
        message: paymentMessage,
        paymentId,
        snap_token,
        invoiceNumber,
      } = response.data;

      setMessage(paymentMessage || "Payment successfully!");

      if (paymentId && snap_token) {
        // Store the invoice number
        setPaymentData((prevState) => ({
          ...prevState,
          invoiceNumber: invoiceNumber || "No invoice number generated",
        }));

        // Directly redirect the user to Midtrans Snap payment page
        window.location.href = `https://app.sandbox.midtrans.com/snap/v4/redirection/${snap_token}`;
      }
    } catch (error) {
      setMessage("Payment processing failed: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="payment-form">
      <h1>Payment Form</h1>
      <form onSubmit={handleSubmit}>
        <div>
          <label>Payment Method:</label>
          <select
            name="paymentMethod"
            value={paymentData.paymentMethod}
            onChange={handleInputChange}
            required
          >
            <option value="">Select a payment method</option>
            <option value="bank_transfer">Bank Transfer</option>
            <option value="qris">QRIS</option>
          </select>
        </div>

        {paymentData.paymentMethod === "bank_transfer" && (
          <div>
            <label>Bank Name:</label>
            <input
              type="text"
              name="bank_name"
              value={paymentData.bank_name}
              onChange={handleInputChange}
              required
            />
            <label>Account Number:</label>
            <input
              type="text"
              name="accountNumber"
              value={paymentData.accountNumber}
              onChange={handleInputChange}
              required
            />
          </div>
        )}

        {paymentData.paymentMethod === "qris" && (
          <div>
            <label>QRIS Code:</label>
            <QRCodeCanvas value={paymentData.qrisCode} size={200} />
          </div>
        )}

        <div>
          <button type="submit" disabled={loading} className="btn-primary">
            {loading ? "Processing..." : "Submit Payment"}
          </button>
        </div>

        {message && <p>{message}</p>}
      </form>

      {/* Display the invoice number */}
      {paymentData.invoiceNumber && (
        <div>
          <h3>Invoice Details</h3>
          <p>
            <strong>Invoice Number:</strong> {paymentData.invoiceNumber}
          </p>
          <p>
            <strong>Amount:</strong> {paymentData.amount}
          </p>
          <p>
            <strong>Service:</strong> {paymentData.service}
          </p>
          <p>
            <strong>Bank Name:</strong> {paymentData.bank_name}
          </p>
          <p>
            <strong>Account Number:</strong> {paymentData.accountNumber}
          </p>
        </div>
      )}
    </div>
  );
};

export default PaymentForm;

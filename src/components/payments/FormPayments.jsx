import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { QRCodeCanvas } from "qrcode.react";

const PaymentForm = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
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
    barberBankName: "",
    service: "",
    price: 0,
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
            barber_bank_name,
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
            barberBankName: barber_bank_name || "",
            service,
            price,
            amount: amount || price,
            accountNumber: account_number || "",
            bank_name: bank_name || "",
          }));
        })
        .catch((err) => setMessage("Failed to fetch booking details"));
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

  const fetchPaymentStatus = async (paymentId) => {
    try {
      const response = await axios.get(
        `http://localhost:5001/api/payments/status/${paymentId}`
      );
      setMessage(
        response.data.status || "Payment status fetched successfully!"
      );
    } catch (error) {
      setMessage("Failed to fetch payment status: " + error.message);
    }
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

    // Construct payment payload
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
      userEmail: paymentData.userEmail,
      barberName: paymentData.barberName,
    };

    try {
      // Get snapToken from your backend
      const response = await axios.post(
        "http://localhost:5001/api/payments/snap",
        paymentPayload
      );
      const { snapToken } = response.data;

      if (!snapToken) {
        setMessage("Error: snapToken is missing.");
        setLoading(false);
        return;
      }

      // Now include the snapToken in the frontend payment request
      const snapResponse = await snap.pay(snapToken, {
        onSuccess: function (result) {
          const orderId = result.order_id; // Pastikan ini sesuai dengan data response
          navigate(`/payments/${result.order_id}/status-order`);
        },
        onPending: function (result) {
          const orderId = result.order_id;
          navigate(`/payments/${result.order_id}/status-order`);
        },

        onError: function (result) {
          console.log(result);
          // Handle error
          setMessage("Payment error: " + result.error_message);
        },
      });
    } catch (error) {
      console.error("Error processing payment:", error);
      setMessage("Error processing payment: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto p-6 bg-white shadow-lg rounded-lg">
      <h2 className="text-2xl font-semibold text-center mb-6">Payment Form</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="bookingId"
            className="block text-sm font-medium text-gray-700"
          >
            Booking ID
          </label>
          <input
            type="text"
            id="bookingId"
            name="bookingId"
            value={paymentData.bookingId}
            onChange={handleInputChange}
            required
            readOnly
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4">
          <label className="block text-gray-700">Total Price</label>
          <input
            type="text"
            value={`Rp ${
              paymentData.price ? paymentData.price.toLocaleString() : "0"
            }`}
            readOnly
            className="w-full p-2 border border-gray-300 rounded mt-2"
          />
        </div>

        <div className="mb-4">
          <label
            htmlFor="paymentMethod"
            className="block text-sm font-medium text-gray-700"
          >
            Payment Method
          </label>
          <select
            id="paymentMethod"
            name="paymentMethod"
            value={paymentData.paymentMethod}
            onChange={handleInputChange}
            required
            className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
          >
            <option value="">Select Payment Method</option>
            <option value="qris">QRIS</option>
            <option value="bank_transfer">Bank Transfer</option>
          </select>
        </div>

        {paymentData.paymentMethod === "bank_transfer" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="bank_name"
                className="block text-sm font-medium text-gray-700"
              >
                Bank Name
              </label>
              <input
                type="text"
                id="bank_name"
                name="bank_name"
                value={paymentData.bank_name}
                onChange={handleInputChange}
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="accountNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Account Number
              </label>
              <input
                type="text"
                id="accountNumber"
                name="accountNumber"
                value={paymentData.accountNumber}
                onChange={handleInputChange}
                required
                className="mt-1 block w-full px-4 py-2 border border-gray-300 rounded-md"
              />
            </div>
          </>
        )}

        {paymentData.paymentMethod === "qris" && (
          <>
            <div className="mb-4">
              <label
                htmlFor="qrisCode"
                className="block text-sm font-medium text-gray-700"
              >
                QRIS Code
              </label>
              <QRCodeCanvas
                value={paymentData.qrisCode || ""}
                size={200}
                className="mt-2 mx-auto"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">
                Email: {paymentData.userEmail}, Barber: {paymentData.barberName}
                , Service: {paymentData.service}
              </p>
            </div>
          </>
        )}

        <div className="mb-4">
          <label
            htmlFor="amount"
            className="block text-sm font-medium text-gray-700"
          >
            Amount
          </label>
          <input
            id="amount"
            value={paymentData.amount}
            onChange={handleInputChange}
            required
            className="mt-1 block text w-full px-4 py-2 border border-gray-300 rounded-md"
          />
        </div>

        <div className="mb-4 text-center">
          <button
            type="submit"
            disabled={loading}
            className="w-full py-2 px-4 bg-blue-500 text-white rounded-md disabled:bg-gray-300"
          >
            {loading ? "Processing..." : "Pay Now"}
          </button>
        </div>
        {message && (
          <div
            className={`text-center ${
              message.includes("Error") ? "text-red-600" : "text-green-600"
            }`}
          >
            {message}
          </div>
        )}
      </form>
    </div>
  );
};

export default PaymentForm;

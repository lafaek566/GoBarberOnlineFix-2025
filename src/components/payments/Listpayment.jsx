import React, { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";
import { FaMapMarkerAlt, FaClipboard, FaClipboardCheck } from "react-icons/fa";
import UploadProof from "./UploadProof"; // Import the UploadProof component
import PaymentReceipt from "./receipt";

const ListPayment = () => {
  const [payment, setPayment] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [file, setFile] = useState(null);
  const { id } = useParams();
  const [copied, setCopied] = useState({ paymentId: false, orderId: false });
  const [uploading, setUploading] = useState(false);
  const [message, setMessage] = useState("");

  const navigate = useNavigate(); // Initialize useNavigate

  useEffect(() => {
    if (!id) {
      setError("Invalid payment ID.");
      setLoading(false);
      return;
    }

    const fetchPaymentStatus = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5001/api/payments/${id}`
        );

        console.log(data); // Debugging step to check the full payment data

        if (data.status_code === "200") {
          setPayment({
            paymentId: data.payment_identifier,
            orderId: data.order_id,
            amount: data.gross_amount,
            status: data.status,
            bankName: data.bank_name,
            barberName: data.barber_name,
            barberPhoneNumber: data.barber_phone_number,
            userEmail: data.user_email,
            appointmentTime: data.appointment_time,
            createdAt: data.created_at,
            barberLatitude: data.barber_latitude,
            barberLongitude: data.barber_longitude,
          });
        } else {
          setError("Payment not found.");
        }
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Failed to fetch payment status.";
        setError(`Error: ${errorMessage}`);
      } finally {
        setLoading(false);
      }
    };

    fetchPaymentStatus();
  }, [id]);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleFileUpload = async () => {
    if (!file) {
      setMessage("Please select a file.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("proof", file);

      const { data } = await axios.post(
        `http://localhost:5001/api/payments/${id}/upload-proof`,
        formData
      );
      setMessage(data.message || "Proof uploaded successfully.");
    } catch (err) {
      setMessage(err.response?.data?.message || "Error uploading proof.");
    } finally {
      setUploading(false);
    }
  };

  // Create the Google Maps URL with latitude and longitude
  const googleMapsUrl =
    payment?.barberLatitude && payment?.barberLongitude
      ? `https://www.google.com/maps?q=${payment.barberLatitude},${payment.barberLongitude}`
      : null;

  useEffect(() => {
    // Debugging step to check if the map URL is being generated correctly
    console.log(googleMapsUrl);
  }, [payment]);

  const copyToClipboard = (text, type) => {
    navigator.clipboard
      .writeText(text)
      .then(() => {
        setCopied((prev) => ({ ...prev, [type]: true }));
        setTimeout(() => {
          setCopied((prev) => ({ ...prev, [type]: false }));
        }, 2000);
      })
      .catch((err) => {
        alert("Failed to copy: " + err);
      });
  };

  const renderStatus = (status) => {
    switch (status) {
      case "completed":
        return <span className="text-green-500 font-semibold">Completed</span>;
      case "pending":
        return <span className="text-orange-500 font-semibold">Pending</span>;
      case "failed":
        return <span className="text-red-500 font-semibold">Failed</span>;
      case "cancelled":
        return <span className="text-gray-500 font-semibold">Cancelled</span>;
      default:
        return (
          <span className="text-gray-600 font-semibold">Awaiting Payment</span>
        );
    }
  };

  const handleNavigateToCheckOrder = () => {
    navigate("/check-orders"); // Navigate to check orders
  };

  if (loading) {
    return <div className="text-center mt-8">Loading payment details...</div>;
  }

  if (error) {
    return <div className="text-center mt-8 text-red-600">{error}</div>;
  }

  return (
    <div className="container mx-auto mt-8 px-6 sm:px-8">
      <h1 className="text-3xl font-semibold text-blue-800 mb-6">
        Payment Details
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-lg space-y-6 border border-gray-200">
        {/* Payment ID */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">
            <strong>Payment ID: </strong>
            {payment.paymentId || "N/A"}
          </p>
          <button
            onClick={() => copyToClipboard(payment.paymentId, "paymentId")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaClipboard size={16} />
            Copy
          </button>
        </div>
        {copied.paymentId && (
          <span className="text-green-500 font-semibold flex items-center gap-1 mt-2">
            <FaClipboardCheck size={16} />
            Copied!
          </span>
        )}

        {/* Order ID */}
        <div className="flex justify-between items-center">
          <p className="text-lg font-medium">
            <strong>Order ID: </strong>
            {payment.orderId || "N/A"}
          </p>

          <button
            onClick={() => copyToClipboard(payment.orderId, "orderId")}
            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 flex items-center gap-2"
          >
            <FaClipboard size={16} />
            Copy
          </button>
        </div>
        {copied.orderId && (
          <span className="text-green-500 font-semibold flex items-center gap-1 mt-2">
            <FaClipboardCheck size={16} />
            Copied!
          </span>
        )}
        <p className="text-xs text-gray-400">
          (Copy Order ID untuk cek ulang status pemesanan kamu)
        </p>

        {/* Barber Name */}
        <p className="text-lg">
          <strong>Barber Name: </strong>
          {payment.barberName || "N/A"}
        </p>

        {/* User Email */}
        <p className="text-lg">
          <strong>User Email: </strong>
          {payment.userEmail || "N/A"}
        </p>

        {/* Appointment Time */}
        <p className="text-lg">
          <strong>Booking Time: </strong>
          {payment.appointmentTime || "N/A"}
        </p>

        {/* Barber Phone */}
        <p className="text-lg">
          <strong>Barber Phone: </strong>
          {payment.barberPhoneNumber || "N/A"}
        </p>

        {/* Total Amount */}
        <p className="text-lg">
          <strong>Total Amount: </strong>
          {payment.amount ? `${payment.amount} IDR` : "N/A"}
        </p>

        {/* Barber Location (Google Maps Link) */}
        {payment.status === "completed" &&
          payment.barberLatitude &&
          payment.barberLongitude && (
            <div>
              <strong>Barber Location: </strong>
              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-500 hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          )}

        {/* Payment Status */}
        <div className="mt-4">
          <strong>Status: </strong>
          {renderStatus(payment.status)}
        </div>

        {/* Payment Receipt (only show if status is "completed") */}
        {payment.status === "completed" && <PaymentReceipt payment={payment} />}

        {/* Upload Proof */}
        {(payment.status === "pending" || payment.status === "failed") && (
          <UploadProof
            onFileChange={handleFileChange}
            onFileUpload={handleFileUpload}
            uploading={uploading}
            message={message}
          />
        )}

        {/* Navigate to user-dashboard */}
        <div className="mt-6">
          <button
            onClick={handleNavigateToCheckOrder}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Go to Check Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default ListPayment;

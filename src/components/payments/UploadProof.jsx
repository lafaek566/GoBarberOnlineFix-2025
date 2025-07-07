import React, { useState } from "react";
import axios from "axios";

const UploadProof = () => {
  const [file, setFile] = useState(null);
  const [paymentId, setPaymentId] = useState("");
  const [message, setMessage] = useState("");
  const [isUploading, setIsUploading] = useState(false);

  const handleFileChange = (event) => {
    setFile(event.target.files[0]);
  };

  const handlePaymentIdChange = (event) => {
    setPaymentId(event.target.value);
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!file) {
      setMessage("Please select a proof file.");
      return;
    }

    if (!paymentId) {
      setMessage("Payment ID is required.");
      return;
    }

    const formData = new FormData();
    formData.append("proof", file);
    formData.append("payment_id", paymentId);

    try {
      setIsUploading(true);
      setMessage("");

      const response = await axios.post(
        "http://localhost:5001/api/payments/upload-proof",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      if (response.status === 200) {
        setMessage("Proof uploaded successfully.");
      }
    } catch (error) {
      setMessage("Error uploading proof. Please try again.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div>
      <div className="bg-white shadow-md rounded p-4 w-full max-w-sm">
        <h2 className="text-lg font-semibold text-gray-700 mb-3 text-center">
          Upload Proof of Payment
        </h2>
        <form onSubmit={handleSubmit} className="space-y-3">
          <div className="flex flex-col">
            <label htmlFor="paymentId" className="text-sm text-gray-600">
              Payment ID:
            </label>
            <input
              type="text"
              id="paymentId"
              value={paymentId}
              onChange={handlePaymentIdChange}
              placeholder="Enter payment ID"
              className="mt-1 p-1 text-sm border rounded focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div className="flex flex-col">
            <label htmlFor="proof" className="text-sm text-gray-600">
              Select Proof File:
            </label>
            <input
              type="file"
              id="proof"
              accept="image/jpeg, image/png, application/pdf"
              onChange={handleFileChange}
              className="mt-1 p-1 text-sm border rounded focus:ring-1 focus:ring-blue-400"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={isUploading}
              className={`w-full py-1.5 text-sm text-white font-medium rounded ${
                isUploading
                  ? "bg-gray-400 cursor-not-allowed"
                  : "bg-blue-500 hover:bg-blue-600 focus:ring-1 focus:ring-blue-300"
              }`}
            >
              {isUploading ? "Uploading..." : "Upload Proof"}
            </button>
          </div>
        </form>
        {message && (
          <p
            className={`mt-3 text-center text-sm font-medium ${
              message.includes("successfully")
                ? "text-green-500"
                : "text-red-500"
            }`}
          >
            {message}
          </p>
        )}
      </div>
    </div>
  );
};

export default UploadProof;

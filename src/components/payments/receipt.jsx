// PaymentReceipt.jsx
import React from "react";
import { jsPDF } from "jspdf";

const PaymentReceipt = ({ payment }) => {
  const generateReceipt = () => {
    if (!payment) return;

    const doc = new jsPDF();

    // Watermark - increased font size and centered
    doc.setFontSize(50); // Larger watermark text size
    doc.setFont("helvetica", "normal");
    doc.setTextColor(200, 200, 200); // Light gray color

    // Get the width of the text to center it
    const text = "Gó~br : success";
    const text1 = "Success";
    const textWidth = doc.getTextWidth(text && text1);
    const pageWidth = doc.internal.pageSize.width;
    const x = (pageWidth - textWidth) / 2; // Calculate center position

    // Add watermark at the center
    doc.text(text, x, 105, { angle: 25, align: "center" });

    // Receipt Header
    doc.setFontSize(18);
    doc.setFont("helvetica", "bold");
    doc.setTextColor(0, 0, 0);
    doc.text("Payment Receipt", 20, 20);

    // Receipt Details
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");

    doc.text(`Status Payment: ${payment.status || "N/A"}`, 20, 30);
    doc.text(`Payment ID: ${payment.paymentId || "N/A"}`, 20, 40);
    doc.text(`Order ID: ${payment.orderId || "N/A"}`, 20, 50);
    doc.text(`Barber Name: ${payment.barberName || "N/A"}`, 20, 60);
    doc.text(`User Email: ${payment.userEmail || "N/A"}`, 20, 70);

    const formattedBookingTime = new Date(payment.createdAt);
    const formattedBookingTimeString = isNaN(formattedBookingTime)
      ? "Invalid Date"
      : formattedBookingTime.toLocaleString("id-ID", {
          timeZone: "Asia/Jakarta",
          weekday: "long",
          year: "numeric",
          month: "long",
          day: "numeric",
          hour: "numeric",
          minute: "numeric",
          second: "numeric",
        });

    doc.text(`Booking Time: ${formattedBookingTimeString} WIB`, 20, 140);

    doc.text(`Amount: ${payment.amount || "N/A"}`, 20, 90);
    doc.text(`Bank Name: ${payment.bankName || "N/A"}`, 20, 100);
    doc.text(`Barber Phone: ${payment.barberPhoneNumber || "N/A"}`, 20, 110);

    doc.text(
      `Created At: ${
        payment.createdAt ? new Date(payment.createdAt).toLocaleString() : "N/A"
      }`,
      20,
      120
    );

    doc.line(20, 135, 180, 135);

    const filename = `${
      payment.userEmail ? payment.userEmail : "payment"
    }_receipt.pdf`;
    doc.save(filename);
  };

  return (
    <div>
      <button
        onClick={generateReceipt}
        className="bg-blue-500 text-white font-semibold py-2 px-6 rounded-md shadow hover:bg-blue-600"
      >
        Download Payment Receipt
      </button>
    </div>
  );
};

export default PaymentReceipt;

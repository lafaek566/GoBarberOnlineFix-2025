import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const PaymentListByBarber = () => {
  const { barberId } = useParams();
  const [payments, setPayments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchPayments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:5001/api/payments/barber/${barberId}`
        );
        setPayments(response.data.payments);
      } catch (err) {
        setError("Gagal mengambil data pembayaran.");
      } finally {
        setLoading(false);
      }
    };

    if (barberId) {
      fetchPayments();
    }
  }, [barberId]);

  const handleUpdateStatus = async (id, status) => {
    if (!id) {
      console.error("Payment ID is undefined");
      return;
    }

    try {
      const response = await axios.put(
        `http://localhost:5001/api/payments/${id}`,
        { status }
      );
      console.log("Status updated successfully:", response.data);

      setPayments((prevPayments) =>
        prevPayments.map((payment) =>
          payment.id === id ? { ...payment, status } : payment
        )
      );
    } catch (err) {
      console.error("Error updating payment status:", err);
    }
  };

  // 🔹 Fungsi untuk mengonversi waktu ke WIB
  const formatToWIB = (isoString) => {
    if (!isoString) return "Invalid Date";

    const date = new Date(isoString);
    return new Intl.DateTimeFormat("id-ID", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      timeZone: "Asia/Jakarta", // ✅ WIB (UTC+7)
    }).format(date);
  };

  return (
    <div className="p-5">
      <h2 className="text-2xl font-bold mb-4">Daftar Pembayaran</h2>

      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}

      {!loading && !error && payments.length === 0 && (
        <p className="text-gray-500">Tidak ada pembayaran untuk barber ini.</p>
      )}

      {!loading && !error && payments.length > 0 && (
        <table className="min-w-full border border-gray-300">
          <thead>
            <tr className="bg-gray-200">
              <th className="border px-4 py-2">Order ID</th>
              <th className="border px-4 py-2">Email User</th>
              <th className="border px-4 py-2">Paket</th>
              <th className="border px-4 py-2">waktu Pesanan</th>
              <th className="border px-4 py-2">Waktu Janji (WIB)</th>
              <th className="border px-4 py-2">Layanan</th>
              <th className="border px-4 py-2">Nama Barber</th>
              <th className="border px-4 py-2">Total</th>
              <th className="border px-4 py-2">Bukti Pembayaran</th>
              <th className="border px-4 py-2">Status</th>
              <th className="border px-4 py-2">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {payments.map((payment) => (
              <tr key={payment.id} className="text-center">
                <td className="border px-4 py-2">{payment.order_id}</td>
                <td className="border px-4 py-2">{payment.userEmail}</td>
                <td className="border px-4 py-2">{payment.paket}</td>
                <td className="border px-4 py-2">
                  {formatToWIB(payment.created_at)}
                </td>
                <td className="border px-4 py-2">
                  {formatToWIB(payment.appointment_time)}
                </td>
                <td className="border px-4 py-2">{payment.service}</td>
                <td className="border px-4 py-2">{payment.barberName}</td>
                <td className="border px-4 py-2">{payment.amount}</td>
                <td className="border px-4 py-2">
                  {payment.proofFile ? (
                    <a
                      href={payment.proofFile}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-500"
                    >
                      Lihat Bukti
                    </a>
                  ) : (
                    "Belum ada bukti"
                  )}
                </td>
                <td className="border px-4 py-2">
                  <span
                    className={
                      payment.status === "completed"
                        ? "text-green-500"
                        : payment.status === "pending"
                        ? "text-yellow-500"
                        : payment.status === "Cancel"
                        ? "text-red-500"
                        : "text-gray-500"
                    }
                  >
                    {payment.status}
                  </span>
                </td>
                <td className="border px-4 py-2 flex gap-2 justify-center">
                  {console.log("Payment Status:", payment.status)}
                  {payment.status.toLowerCase() === "pending" && (
                    <>
                      <button
                        onClick={() =>
                          handleUpdateStatus(payment.id, "completed")
                        }
                        className="px-3 py-1 bg-green-500 text-white rounded hover:bg-green-700"
                      >
                        Complete
                      </button>
                      <button
                        onClick={() => handleUpdateStatus(payment.id, "failed")}
                        className="px-3 py-1 bg-red-500 text-white rounded hover:bg-red-700"
                      >
                        Cancel
                      </button>
                    </>
                  )}
                  {payment.status.toLowerCase() === "completed" && (
                    <>
                      <span className="text-green-500 font-bold">
                        Completed
                      </span>
                      <button
                        onClick={() =>
                          handleUpdateStatus(payment.id, "pending")
                        }
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                      >
                        Mark as Pending
                      </button>
                    </>
                  )}
                  {payment.status.toLowerCase() === "failed" && (
                    <>
                      <span className="text-red-500 font-bold">Cancelled</span>
                      <button
                        onClick={() =>
                          handleUpdateStatus(payment.id, "pending")
                        }
                        className="px-3 py-1 bg-yellow-500 text-white rounded hover:bg-yellow-700"
                      >
                        Mark as Pending
                      </button>
                    </>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default PaymentListByBarber;

import { motion } from "framer-motion";
import React, { useState, useEffect } from "react";
import { lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import AdminDashboard from "./components/admin/AdminDashboard";
import BarberDashboard from "./components/barber/barberDashboard";
import UserDashboard from "./components/user/userDashboard";
import Login from "./components/auth/login";
import RegisterUser from "./components/auth/registerUser";
import RegisterAdminBarber from "./components/auth/registerBarber";
import RegisterAdmin from "./components/auth/registerAdmin";

import BarberList from "./components/barber/BarberDetails";
import Allbarberlist from "./components/admin/barbers/Allbarberlist";
import UserBookingList from "./components/barber/confirm user/bookingList";
import UserPaymentList from "./components/admin/barbers/paymentList.jsx";
import Users from "./components/admin/users/users";

import UserProfile from "./components/admin/users/userid.jsx";
import AllReviews from "./components/barber/confirm user/allReviews";
import LoadingPage from "./components/iconAuth/loading";

import Dashboard from "./components/page/dashboard";
import BarberDetails from "./components/barber/BarberDetails";
import EditBarber from "./components/barber/editbarbers";

import PaymentCheck from "./components/payments/paymentCheck";
import PaymentForm from "./components/payments/FormPayments";
import ListCheckPayment from "./components/payments/Listpayment.jsx";
import ListPayment from "./components/admin/barbers/paymentList.jsx";
import PaymentListByBarber from "./components/barber/confirm user/PaymentListByBarber";

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);
  const AdminDashboard = lazy(() =>
    import("./components/admin/AdminDashboard")
  );
  const BarberDashboard = lazy(() =>
    import("./components/barber/barberDashboard")
  );
  const UserDashboard = lazy(() => import("./components/user/userDashboard"));

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole"); // <- pakai localStorage
    setRole(storedRole || null);
    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout); // Cleanup timer
  }, []);

  if (loading) {
    return <LoadingPage />;
  }

  return (
    <div className="App">
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Dashboard Routes */}
          {(role === "admin" || role === "barber") && (
            <Route path="/barber-dashboard" element={<BarberDashboard />} />
          )}
          {(role === "admin" || role === "user") && (
            <Route path="/user-dashboard" element={<UserDashboard />} />
          )}
          {role === "admin" && (
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          )}

          {/* Registration Routes */}
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-barber" element={<RegisterAdminBarber />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />

          {/* Login Route */}
          <Route path="/login" element={<Login />} />

          {/* User Management */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserProfile />} />

          {/* Booking and Payment */}
          <Route path="/bookings" element={<UserBookingList />} />
          <Route path="/payment/:bookingId" element={<PaymentForm />} />
          <Route path="/payments" element={<UserPaymentList />} />
          <Route path="/payments/:barberId" element={<PaymentListByBarber />} />
          <Route
            path="/payments/:id/status-order"
            element={<ListCheckPayment />}
          />
          <Route
            path="/Listpayments:/id/status-order"
            element={<ListCheckPayment />}
          />
          <Route path="/edit-barber/:id" element={<EditBarber />} />
          <Route path="/barber/:id" element={<BarberDetails />} />
          <Route path="/All-barber-dashboard" element={<Allbarberlist />} />
          <Route path="/check-orders" element={<PaymentCheck />} />

          {/* dashboard*/}
          <Route path="/" element={<Dashboard />} />

          {/* Reviews */}
          <Route path="/reviews" element={<AllReviews />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;

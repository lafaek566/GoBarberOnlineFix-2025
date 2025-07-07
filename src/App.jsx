import React, { useState, useEffect, lazy, Suspense } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Cookies from "js-cookie";
import LoadingPage from "./components/iconAuth/loading";

// Lazy Load Dashboard Components
const AdminDashboard = lazy(() => import("./components/admin/AdminDashboard"));
const BarberDashboard = lazy(() =>
  import("./components/barber/barberDashboard")
);
const UserDashboard = lazy(() => import("./components/user/userDashboard"));

// Auth Pages
import Login from "./components/auth/login";
import RegisterUser from "./components/auth/registerUser";
import RegisterAdminBarber from "./components/auth/registerBarber";
import RegisterAdmin from "./components/auth/registerAdmin";

// Pages and Features
import Dashboard from "./components/page/dashboard";
import BarberDetails from "./components/barber/BarberDetails";
import EditBarber from "./components/barber/editbarbers";
import Allbarberlist from "./components/admin/barbers/Allbarberlist";
import Users from "./components/admin/users/users";
import UserProfile from "./components/admin/users/userid";
import AllReviews from "./components/barber/confirm user/allReviews";

// Booking & Payment
import UserBookingList from "./components/barber/confirm user/bookingList";
import UserPaymentList from "./components/admin/barbers/paymentList";
import PaymentForm from "./components/payments/FormPayments";
import ListCheckPayment from "./components/payments/Listpayment";
import PaymentCheck from "./components/payments/paymentCheck";
import PaymentListByBarber from "./components/barber/confirm user/PaymentListByBarber";

const App = () => {
  const [role, setRole] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = Cookies.get("token");
    const storedRole = Cookies.get("userRole"); // ✅ ambil dari Cookies

    if (token && storedRole) {
      setRole(storedRole);
    }

    const timeout = setTimeout(() => setLoading(false), 1000);
    return () => clearTimeout(timeout);
  }, []);

  if (loading) return <LoadingPage />;

  return (
    <div className="App">
      <Suspense fallback={<LoadingPage />}>
        <Routes>
          {/* Dashboard Role-Based */}
          {role === "admin" && (
            <Route path="/admin-dashboard" element={<AdminDashboard />} />
          )}
          {role === "barber" && (
            <Route path="/barber-dashboard" element={<BarberDashboard />} />
          )}
          {role === "user" && (
            <Route path="/user-dashboard" element={<UserDashboard />} />
          )}

          {/* Auth */}
          <Route path="/login" element={<Login />} />
          <Route path="/register-user" element={<RegisterUser />} />
          <Route path="/register-barber" element={<RegisterAdminBarber />} />
          <Route path="/register-admin" element={<RegisterAdmin />} />

          {/* General */}
          <Route path="/" element={<Dashboard />} />
          <Route path="/barber/:id" element={<BarberDetails />} />
          <Route path="/edit-barber/:id" element={<EditBarber />} />
          <Route path="/All-barber-dashboard" element={<Allbarberlist />} />

          {/* Booking & Payment */}
          <Route path="/bookings" element={<UserBookingList />} />
          <Route path="/payment/:bookingId" element={<PaymentForm />} />
          <Route path="/payments" element={<UserPaymentList />} />
          <Route path="/payments/:barberId" element={<PaymentListByBarber />} />
          <Route
            path="/payments/:id/status-order"
            element={<ListCheckPayment />}
          />
          <Route
            path="/Listpayments/:id/status-order"
            element={<ListCheckPayment />}
          />
          <Route path="/check-orders" element={<PaymentCheck />} />

          {/* Users */}
          <Route path="/users" element={<Users />} />
          <Route path="/users/:userId" element={<UserProfile />} />

          {/* Reviews */}
          <Route path="/reviews" element={<AllReviews />} />

          {/* Fallback: Redirect to Home */}
          <Route path="*" element={<Navigate to="/" />} />
        </Routes>
      </Suspense>
    </div>
  );
};

export default App;

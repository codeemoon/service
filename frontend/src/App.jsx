
import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Home from "./pages/Home";
import ComingSoon from "./pages/ComingSoon";
import RoleLandingPage from "./components/RoleLandingPage";
import Services from "./pages/Services";
import Categories from "./pages/Categories";
import ServiceDetails from "./pages/ServiceDetails";
import CustomerDashboard from "./pages/dashboard/CustomerDashboard";
import AdminDashboard from "./pages/dashboard/AdminDashboard";
import MyBookings from "./pages/MyBookings";
import ProtectedRoute from "./components/ProtectedRoute";
import Checkout from "./pages/Checkout";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Public Routes */}
        <Route index element={<RoleLandingPage />} />
        <Route path="become-partner" element={<ComingSoon />} />
        <Route path="services" element={<Services />} />
        <Route path="categories" element={<Categories />} />
        <Route path="services/:id" element={<ServiceDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected Routes */}
        <Route 
            path="dashboard" 
            element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                    <CustomerDashboard />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="bookings" 
            element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                    <MyBookings />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="checkout/:bookingId" 
            element={
                <ProtectedRoute allowedRoles={["customer", "admin"]}>
                    <Checkout />
                </ProtectedRoute>
            } 
        />
        <Route 
            path="admin" 
            element={
                <ProtectedRoute allowedRoles={["admin"]}>
                    <AdminDashboard />
                </ProtectedRoute>
            } 
        />
        
        <Route path="payment/success" element={<PaymentSuccess />} />
      </Route>
    </Routes>
  );
}

export default App;


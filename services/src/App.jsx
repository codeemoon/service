import { Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Login from "./pages/Login";
import ProviderRegister from "./pages/ProviderRegister";
import ProviderLanding from "./pages/ProviderLanding";
import ProviderDashboard from "./pages/dashboard/ProviderDashboard";
import ProtectedRoute from "./components/ProtectedRoute";
import PaymentSuccess from "./pages/PaymentSuccess";

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* Provider Public Routes */}
        <Route index element={<ProviderLanding />} />
        <Route path="become-partner" element={<ProviderLanding />} />
        <Route path="login" element={<Login />} />
        <Route path="provider-register" element={<ProviderRegister />} />
        <Route path="payment/success" element={<PaymentSuccess />} />
        
        {/* Provider Protected Routes */}
        <Route 
            path="dashboard" 
            element={
                <ProtectedRoute allowedRoles={["provider", "admin"]}>
                    <ProviderDashboard />
                </ProtectedRoute>
            } 
        />
        
        {/* Future routes catch-all */}
        <Route path="*" element={<h1 className="text-3xl text-center mt-20">Page Not Found</h1>} />
      </Route>
    </Routes>
  );
}

export default App;

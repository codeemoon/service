import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import Home from "../pages/Home";
// import ProviderLanding from "../pages/ProviderLanding"; // No longer needed here if we redirect

const RoleLandingPage = () => {
  const { user } = useAuth();

  // If user is a provider, redirect to dashboard
  if (user?.role === "provider") {
    return <Navigate to="/provider" replace />;
  }

  // For customers, admins, and guests, show customer home page
  return <Home />;
};

export default RoleLandingPage;

import { Outlet, useLocation } from "react-router-dom";
import Navbar from "./Navbar";
import Footer from "./Footer";

const Layout = () => {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col font-sans">
      {!isAdminRoute && <Navbar />}
      <main className="flex-grow">
        <Outlet />
      </main>
      {!isAdminRoute && <Footer />}
    </div>
  );
};

export default Layout;

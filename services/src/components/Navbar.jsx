import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Menu, X, User, ChevronDown, MapPin, Search, Sun, Moon } from "lucide-react";
import { useState, useEffect } from "react";
import { useTheme } from "../context/ThemeContext";
import api from "../api/axios";

const Navbar = () => {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  const navigate = useNavigate();
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);


  const handleLogout = () => {
    // Store role before logout clears user state
    const role = user?.role;
    
    // Default to Home for customers and others
    const targetPath = role === "provider" ? "/become-partner" : "/";
    navigate(targetPath);
    setIsProfileOpen(false);

    // Defer logout slightly to allow navigation to unmount ProtectedRoute
    // preventing it from redirecting to /login when user becomes null
    setTimeout(() => {
        logout();
    }, 100);
  };
  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "provider") return "/provider";
    return "/dashboard";
  };

  const isDashboardPage = ["/dashboard", "/provider", "/admin"].includes(location.pathname);
  const isAuthPage = ["/login", "/register", "/provider-register"].includes(location.pathname);

  return (
    <nav className="fixed top-0 w-full z-50 bg-white dark:bg-[#0a0a0a] backdrop-blur-md border-b border-gray-200 dark:border-white/10 h-20 flex items-center transition-colors duration-300">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3">
              <img src="/companyLogo/abcdservices_converted.avif" alt="Helpbro Logo" className="h-10 w-auto object-contain" />
            </Link>

          </div>

          {/* Large Screen Auth Section */}
          <div className="hidden md:flex items-center space-x-6">
            {!user && (
                <Link to="/become-partner" className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors">
                   Become a Service Provider
                </Link>
            )}
            
            {!isAuthPage && (user ? (
              <div className="flex items-center space-x-4">
                {!isDashboardPage && user.role !== "customer" && (
                  <Link 
                    to={getDashboardLink()} 
                    className="bg-blue-600 text-white px-5 py-2.5 rounded-xl font-bold hover:bg-blue-700 transition shadow-lg shadow-blue-500/20"
                  >
                    Dashboard
                  </Link>
                )}
                
                <div className="relative">
                  <button 
                    onClick={() => setIsProfileOpen(!isProfileOpen)}
                    className="flex items-center space-x-3 bg-gray-50 dark:bg-[#111] border border-gray-200 dark:border-gray-800 pl-2 pr-4 py-1.5 rounded-full text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-gray-300 dark:hover:border-gray-700 transition-all hover:bg-gray-100 dark:hover:bg-[#151515]"
                  >
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-xs font-bold text-white uppercase shadow-inner">
                       {user.name?.[0]}
                    </div>
                    <span className="text-sm font-medium">{user.name.split(' ')[0]}</span>
                    <ChevronDown size={14} className={`transition-transform duration-200 ${isProfileOpen ? 'rotate-180' : ''}`} />
                  </button>
                  
                  {isProfileOpen && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setIsProfileOpen(false)}></div>
                      <div className="absolute right-0 mt-3 w-56 bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-2xl shadow-2xl z-50 overflow-hidden py-2">
                         <div className="px-4 py-2 border-b border-gray-100 dark:border-gray-800 text-xs text-gray-500 uppercase font-bold tracking-wider">
                            Account
                         </div>
                        <Link 
                          to="/dashboard?tab=profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          Profile setting
                        </Link>
                        {!isDashboardPage && user.role !== "customer" && (
                          <Link 
                            to={getDashboardLink()} 
                            onClick={() => setIsProfileOpen(false)}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                          >
                            Dashboard
                          </Link>
                        )}
                        <div className="h-px bg-gray-100 dark:bg-gray-800 my-1"></div>
                        <button
                          onClick={handleLogout}
                          className="w-full text-left px-4 py-3 text-sm text-red-500 hover:text-red-600 dark:hover:text-red-400 hover:bg-red-50 dark:hover:bg-red-500/10 transition-colors"
                        >
                          Logout
                        </button>
                      </div>
                    </>
                  )}
                </div>
              </div>
            ) : (
              <div className="flex items-center space-x-6">
                <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white text-sm font-medium transition-colors">
                  Log in
                </Link>
                <Link to="/provider-register" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg shadow-gray-200/50 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Sign Up
                </Link>
              </div>
            ))}
          </div>



          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-1">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="p-2 rounded-md text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {isOpen && (
        <div className="md:hidden absolute top-20 left-0 w-full bg-white dark:bg-[#0a0a0a] border-b border-gray-200 dark:border-gray-800 z-50">
          <div className="px-4 py-6 space-y-4">
            {/* Mobile Location & Search (Removed) */}
            {!user && (
              <Link to="/become-partner" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-300 text-lg font-medium">Become a Service Provider</Link>
            )}

            {user ? (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 space-y-4">
                <div className="flex items-center space-x-3 mb-4">
                   <div className="w-10 h-10 bg-gray-100 dark:bg-gray-800 rounded-full flex items-center justify-center">
                      <User size={20} className="text-gray-500 dark:text-gray-400" />
                   </div>
                   <div>
                      <div className="text-gray-900 dark:text-white font-bold">{user.name}</div>
                      <div className="text-gray-500 text-sm">{user.email}</div>
                   </div>
                </div>
                <Link to="/dashboard?tab=profile" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-300 text-base font-medium">Profile setting</Link>
                {!isDashboardPage && user.role !== "customer" && (
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-300 text-base font-medium">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block text-red-500 text-base font-medium">Logout</button>
              </div>
            ) : (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white text-center py-3 rounded-xl font-bold">Log in</Link>
                <Link to="/provider-register" onClick={() => setIsOpen(false)} className="bg-gray-900 dark:bg-white text-white dark:text-black text-center py-3 rounded-xl font-bold">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

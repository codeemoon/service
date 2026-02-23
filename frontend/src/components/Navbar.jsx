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
  const [searchQuery, setSearchQuery] = useState("");
  const [locationQuery, setLocationQuery] = useState("");
  // "search" | "location" — which mobile input is active
  const [mobileMode, setMobileMode] = useState("search");
  const [locationsList, setLocationsList] = useState([]);

  // Fetch allowed locations
  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const { data } = await api.get("/locations?activeOnly=true");
        setLocationsList(data);
      } catch (error) {
        console.error("Failed to fetch locations", error);
      }
    };
    fetchLocations();
  }, []);

  const handleLocationChange = (val) => {
    setLocationQuery(val);
    const params = new URLSearchParams(location.search);
    if (val) {
      params.set("location", val);
    } else {
      params.delete("location");
    }
    navigate(`/services?${params.toString()}`, { replace: true });
  };


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

  const handleSearch = (e) => {
    e.preventDefault();
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append("search", searchQuery);

    
    if (params.toString()) {
        navigate(`/services?${params.toString()}`);
    }
  };



  const getDashboardLink = () => {
    if (!user) return "/login";
    if (user.role === "admin") return "/admin";
    if (user.role === "provider") return "/provider";
    return "/dashboard";
  };

  const isDashboardPage = ["/dashboard", "/provider", "/admin"].includes(location.pathname);
  const isAuthPage = ["/login", "/register", "/provider-register"].includes(location.pathname);
  const isServicesPage = location.pathname.startsWith("/services");

  return (
    <nav className="fixed top-0 w-full z-50 bg-white/80 dark:bg-[#0a0a0a] backdrop-blur-md border-b border-gray-200 dark:border-white/10 h-20 flex items-center transition-colors duration-300">
      <div className="w-full px-6 lg:px-12">
        <div className="flex justify-between items-center h-full">
          {/* Logo Section */}
          <div className="flex items-center space-x-12">
            <Link to="/" className="flex items-center space-x-3">
              <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20">
                <span className="text-white font-black text-xl">H</span>
              </div>
            </Link>

            {/* Desktop search + location */}
            {!isAuthPage && !isServicesPage && (
            <div className="hidden md:flex items-center space-x-3">
                {/* Location Input */}
                <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 pointer-events-none" />
                    <select
                        value={locationQuery}
                        onChange={(e) => handleLocationChange(e.target.value)}
                        className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 rounded-xl pl-9 pr-8 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#151515] w-44 transition-all appearance-none cursor-pointer"
                    >
                        <option value="">All Areas</option>
                        {locationsList.map(loc => (
                            <option key={loc._id} value={loc.name}>{loc.name}</option>
                        ))}
                    </select>
                    <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
                </div>

                {/* Search Input */}
                <form onSubmit={handleSearch} className="relative group">
                    <input
                        type="text"
                        placeholder="Search for services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 rounded-xl pl-4 pr-10 py-2.5 text-sm focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-[#151515] w-72 transition-all"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-gray-900 dark:hover:text-white group-focus-within:text-blue-500 transition-colors">
                        <Search className="w-4 h-4" />
                    </button>
                </form>
            </div>
            )}
          </div>

          {/* Large Screen Auth Section */}
          <div className="hidden md:flex items-center space-x-6">
            {(!user || user.role === "customer") && (
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
                          to="/bookings" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          All Bookings
                        </Link>
                        <Link 
                          to="/dashboard?tab=profile" 
                          onClick={() => setIsProfileOpen(false)}
                          className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:bg-gray-50 dark:hover:bg-white/5 transition-colors"
                        >
                          Profile Settings
                        </Link>
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
                <Link to="/register" className="bg-gray-900 dark:bg-white text-white dark:text-black px-6 py-2.5 rounded-xl text-sm font-bold hover:bg-gray-800 dark:hover:bg-gray-200 transition-all transform hover:scale-105 shadow-lg shadow-gray-200/50 dark:shadow-[0_0_20px_rgba(255,255,255,0.1)]">
                  Sign Up
                </Link>
              </div>
            ))}
          </div>

          {/* Mobile Animated Search / Location Toggle */}
          {!isAuthPage && !isServicesPage && (
          <>
          <div className="md:hidden flex-1 mx-3 relative overflow-hidden" style={{ height: '36px' }}>
            {/* Search Input (slides in from left when mobileMode === 'search') */}
            <form
              onSubmit={(e) => { handleSearch(e); }}
              className={`absolute inset-0 flex items-center transition-all duration-300 ease-in-out ${
                mobileMode === 'search' ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
              }`}
            >
              <input
                type="text"
                placeholder="Search services..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 rounded-xl pl-4 pr-9 py-2 text-sm focus:outline-none focus:border-blue-500/50 transition-all"
              />
              <button type="submit" className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 hover:text-blue-500 transition-colors">
                <Search className="w-4 h-4" />
              </button>
            </form>

            {/* Location Input (slides in from right when mobileMode === 'location') */}
            <div
              className={`absolute inset-0 flex items-center transition-all duration-300 ease-in-out ${
                mobileMode === 'location' ? 'translate-x-0 opacity-100' : 'translate-x-full opacity-0 pointer-events-none'
              }`}
            >
              <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-blue-400 w-4 h-4 z-10 pointer-events-none" />
              <select
                value={locationQuery}
                onChange={(e) => handleLocationChange(e.target.value)}
                className="w-full bg-gray-100 dark:bg-[#111] border border-blue-500/40 text-gray-900 dark:text-gray-300 rounded-xl pl-9 pr-9 py-2 text-sm focus:outline-none focus:border-blue-500 transition-all appearance-none cursor-pointer"
              >
                <option value="">All Areas</option>
                {locationsList.map(loc => (
                    <option key={loc._id} value={loc.name}>{loc.name}</option>
                ))}
              </select>
              <ChevronDown className="absolute right-8 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              {locationQuery && (
                <button
                  type="button"
                  onClick={() => handleLocationChange("")}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-red-400 transition-colors bg-gray-100 dark:bg-[#111] px-1 rounded-full"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>

          {/* Mobile: Toggle Icon (switches between Search and Location) */}
          <button
            onClick={() => setMobileMode(m => m === 'search' ? 'location' : 'search')}
            className="md:hidden p-2 rounded-lg text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-white/10 transition-all duration-200"
            title={mobileMode === 'search' ? 'Switch to Location' : 'Switch to Search'}
          >
            <div className="relative w-5 h-5">
              <Search
                className={`absolute inset-0 w-5 h-5 transition-all duration-300 ${
                  mobileMode === 'location' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 rotate-90'
                }`}
              />
              <MapPin
                className={`absolute inset-0 w-5 h-5 text-blue-400 transition-all duration-300 ${
                  mobileMode === 'search' ? 'opacity-100 scale-100 rotate-0' : 'opacity-0 scale-50 -rotate-90'
                }`}
              />
            </div>
          </button>
          </>
          )}

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
            {/* Mobile Location & Search */}
            {!isAuthPage && !isServicesPage && (
            <div className="space-y-4 mb-6">

                <form onSubmit={(e) => { handleSearch(e); setIsOpen(false); }} className="relative">
                    <input 
                        type="text" 
                        placeholder="Search for services..." 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-gray-100 dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-900 dark:text-gray-300 rounded-xl pl-4 pr-10 py-3 text-base focus:outline-none focus:border-gray-400 dark:focus:border-gray-600"
                    />
                    <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-500">
                        <Search className="w-5 h-5" />
                    </button>
                </form>
            </div>
            )}
            {(!user || user.role === "customer") && (
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
                <Link to="/bookings" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-300 text-base font-medium">All Bookings</Link>
                <Link to="/dashboard?tab=profile" onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-300 text-base font-medium">Profile setting</Link>
                {!isDashboardPage && user.role !== "customer" && (
                  <Link to={getDashboardLink()} onClick={() => setIsOpen(false)} className="block text-gray-700 dark:text-gray-300 text-base font-medium">Dashboard</Link>
                )}
                <button onClick={handleLogout} className="block text-red-500 text-base font-medium">Logout</button>
              </div>
            ) : (
              <div className="pt-6 border-t border-gray-200 dark:border-gray-800 grid grid-cols-2 gap-4">
                <Link to="/login" onClick={() => setIsOpen(false)} className="bg-gray-100 dark:bg-gray-900 text-gray-900 dark:text-white text-center py-3 rounded-xl font-bold">Log in</Link>
                <Link to="/register" onClick={() => setIsOpen(false)} className="bg-gray-900 dark:bg-white text-white dark:text-black text-center py-3 rounded-xl font-bold">Sign Up</Link>
              </div>
            )}
          </div>
        </div>
      )}
    </nav>
  );
};

export default Navbar;

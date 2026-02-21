import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ServiceCard from "../components/ServiceCard";
import { MapPin, Globe, ArrowRight, Star, Shield, Clock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [locationStatus, setLocationStatus] = useState("pending"); // "pending" | "granted" | "denied"
  const [userLocation, setUserLocation] = useState(null); // { name: string }

  // Step 1: Ask for browser location on mount
  useEffect(() => {
    if (!navigator.geolocation) {
      setLocationStatus("denied");
      return;
    }
    navigator.geolocation.getCurrentPosition(
      async (position) => {
        try {
          const { latitude, longitude } = position.coords;
          // Reverse geocode using OpenStreetMap Nominatim
          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await res.json();
          const address = data.address;
          const district =
            address.state_district ||
            address.city ||
            address.town ||
            address.county ||
            "";
          if (district) {
            setUserLocation({ name: district });
          }
          setLocationStatus("granted");
        } catch {
          setLocationStatus("granted"); // Still mark granted, just no name
        }
      },
      () => {
        setLocationStatus("denied");
      }
    );
  }, []);

  // Step 2: Fetch services once we know location status
  useEffect(() => {
    if (locationStatus === "pending") return;

    const fetchData = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (locationStatus === "granted" && userLocation?.name) {
          params.append("location", userLocation.name);
        }

        const [categoriesRes, servicesRes] = await Promise.all([
          api.get("/categories"),
          api.get(`/services?${params.toString()}`),
        ]);
        setCategories(categoriesRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [locationStatus, userLocation]);

  const handleCategoryClick = (categoryId) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-4 overflow-hidden">
        {/* Background blobs */}
        <div className="absolute top-20 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto text-center relative z-10">
          <div className="inline-flex items-center gap-2 bg-blue-600/10 border border-blue-500/20 rounded-full px-4 py-2 mb-6">
            <Star className="w-4 h-4 text-yellow-400 fill-yellow-400" />
            <span className="text-blue-400 text-sm font-medium">Trusted by 10,000+ customers</span>
          </div>

          <h1 className="text-5xl md:text-7xl font-black text-white mb-6 leading-tight">
            Find the <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-400">right help</span>
            <br />for any job
          </h1>

          <p className="text-gray-400 text-lg md:text-xl mb-10 max-w-2xl mx-auto">
            Connect with verified service professionals near you. From home repairs
            to personal services — we've got you covered.
          </p>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              to="/services"
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200 flex items-center justify-center gap-2 group"
            >
              Browse Services
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/become-partner"
              className="bg-white/5 hover:bg-white/10 border border-white/10 text-white font-bold px-8 py-4 rounded-2xl text-lg transition-all duration-200"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-8 border-y border-gray-800/50">
        <div className="container mx-auto px-4">
          <div className="flex flex-wrap justify-center gap-8 md:gap-16 text-gray-500 text-sm">
            <div className="flex items-center gap-2">
              <Shield className="w-5 h-5 text-green-500" />
              <span>Verified Professionals</span>
            </div>
            <div className="flex items-center gap-2">
              <Star className="w-5 h-5 text-yellow-500" />
              <span>Rated & Reviewed</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="w-5 h-5 text-blue-500" />
              <span>On-Time Guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <MapPin className="w-5 h-5 text-purple-500" />
              <span>Local Experts</span>
            </div>
          </div>
        </div>
      </section>

      {/* Categories Section */}
      <section className="py-16 px-4">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-white">Categories</h2>
            <Link to="/services" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="bg-[#111] h-28 rounded-2xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
              {categories.map((category) => (
                <button
                  key={category._id}
                  onClick={() => handleCategoryClick(category._id)}
                  className="group bg-[#111] hover:bg-[#161616] border border-gray-800 hover:border-blue-500/40 rounded-2xl p-4 text-center transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5"
                >
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="w-14 h-14 object-cover rounded-xl mx-auto mb-3 group-hover:scale-105 transition-transform"
                    />
                  ) : (
                    <div className="w-14 h-14 bg-blue-600/20 rounded-xl mx-auto mb-3 flex items-center justify-center">
                      <span className="text-2xl">🔧</span>
                    </div>
                  )}
                  <p className="text-white text-sm font-semibold group-hover:text-blue-400 transition-colors leading-tight">
                    {category.name}
                  </p>
                </button>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-16 px-4 bg-gradient-to-b from-transparent to-blue-950/10">
        <div className="container mx-auto">
          <div className="flex justify-between items-end mb-8">
            <div>
              <h2 className="text-3xl font-bold text-white">Services</h2>
              {locationStatus === "granted" && userLocation?.name ? (
                <div className="flex items-center gap-1.5 mt-2">
                  <MapPin className="w-4 h-4 text-blue-400" />
                  <span className="text-blue-400 text-sm font-medium">{userLocation.name}</span>
                  <span className="text-gray-500 text-sm">· Near you</span>
                </div>
              ) : locationStatus === "denied" ? (
                <div className="flex items-center gap-1.5 mt-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-gray-500 text-sm">Showing all services</span>
                </div>
              ) : (
                <p className="text-gray-500 mt-2 text-sm">Detecting your location...</p>
              )}
            </div>
            <Link to="/services" className="text-blue-400 hover:text-blue-300 text-sm flex items-center gap-1 transition-colors">
              See all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-[#111] h-80 rounded-2xl animate-pulse border border-white/5" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.slice(0, 8).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Globe className="w-12 h-12 text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500">
                {locationStatus === "granted" && userLocation?.name
                  ? `No services found near ${userLocation.name}. Showing all services.`
                  : "No services available yet."}
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

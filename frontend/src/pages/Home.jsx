import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/axios";
import ServiceCard from "../components/ServiceCard";
import { staticCategories, staticServices } from "../utils/staticData";
import { MapPin, Globe, ArrowRight, Star, Shield, Clock } from "lucide-react";

const Home = () => {
  const navigate = useNavigate();

  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);

  const bannerImages = [
    "pexels-alaxmatias-28513057.webp",
    "pexels-harrun-muhammad-116282236-32467382.webp",
    "pexels-thirdman-7657044.webp",
    "pexels-tima-miroshnichenko-6195274.webp",
    "pexels-tima-miroshnichenko-6873174.webp"
  ];
  const [currentBannerIndex, setCurrentBannerIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentBannerIndex((prev) => (prev + 1) % bannerImages.length);
    }, 2000);
    return () => clearInterval(timer);
  }, []);

  // Fetch services and categories
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const [categoriesRes, servicesRes] = await Promise.all([
          api.get("/categories"),
          api.get(`/services`),
        ]);
        setCategories([...staticCategories, ...categoriesRes.data]);
        setServices([...staticServices, ...servicesRes.data]);
      } catch (error) {
        console.error("Failed to fetch home data", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleCategoryClick = (categoryId) => {
    navigate(`/services?category=${categoryId}`);
  };

  return (
    <div className="min-h-screen">
      {/* Hero Section (Desktop Only) */}
      <section className="hidden md:block relative pt-24 pb-12 md:pt-32 md:pb-20 px-4 overflow-hidden bg-white dark:bg-[#000000]">
        <div className="container mx-auto text-center relative z-10 max-w-4xl">
          <h1 className="text-4xl sm:text-5xl md:text-7xl font-bold text-gray-900 dark:text-white mb-4 md:mb-6 leading-tight">
            Find the <span className="italic text-gray-500 dark:text-gray-400 font-serif">right help</span>
            <br />for any job
          </h1>
          <p className="text-gray-600 dark:text-gray-400 text-base md:text-xl mb-8 md:mb-10 max-w-2xl mx-auto px-2 font-sans tracking-normal">
            Connect with verified service professionals near you. From home repairs
            to personal services — we've got you covered.
          </p>
          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 justify-center">
            <Link
              to="/services"
              className="bg-gray-900 hover:bg-black dark:bg-white dark:hover:bg-gray-200 dark:text-gray-900 text-white font-medium px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-200 flex items-center justify-center gap-2 group border border-transparent"
            >
              Browse Services
              <ArrowRight className="w-4 h-4 md:w-5 md:h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              to="/become-partner"
              className="bg-transparent hover:bg-gray-50 border border-gray-300 text-gray-900 dark:border-gray-700 dark:text-white dark:hover:bg-gray-900 font-medium px-6 py-3 md:px-8 md:py-4 rounded-full text-base md:text-lg transition-all duration-200 flex items-center justify-center group"
            >
              Become a Provider
            </Link>
          </div>
        </div>
      </section>

      {/* Mobile Banner Carousel (Auto-scrolling, Edge-to-Edge) */}
      <section className="block md:hidden pt-20 relative overflow-hidden h-[216px] sm:h-[264px]">
        <div 
          className="flex transition-transform duration-700 ease-in-out h-full"
          style={{ transform: `translateX(-${currentBannerIndex * 100}%)` }}
        >
          {bannerImages.map((img, index) => (
            <div key={index} className="w-full shrink-0 h-full relative">
              <img
                src={`/banner/${img}`}
                alt={`Banner ${index + 1}`}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-black/10" />
            </div>
          ))}
        </div>
        
        {/* Indicators */}
        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-1.5 z-10">
          {bannerImages.map((_, idx) => (
            <div 
              key={idx} 
              className={`h-1.5 rounded-full transition-all duration-300 ${currentBannerIndex === idx ? "w-4 bg-white" : "w-1.5 bg-white/50"}`}
            />
          ))}
        </div>
      </section>

      {/* Categories Section */}
      <section className="pt-6 pb-4 overflow-hidden bg-white dark:bg-[#000000]">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-3 px-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Categories</h2>
            <Link to="/categories" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm flex items-center gap-1 transition-colors font-sans uppercase tracking-widest text-[11px] font-bold">
              View all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="flex gap-3 px-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="bg-gray-100 dark:bg-gray-900 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800 shrink-0 aspect-[4/3] w-[180px] sm:w-[280px]" />
              ))}
            </div>
          ) : (
            <div className="relative w-full flex overflow-hidden">
              {/* Animated Marquee Container - duplicates data x3 for smooth seamless -33% transform */}
              <div className="flex w-max animate-marquee gap-3 px-4">
                {[...categories, ...categories, ...categories].map((category, idx) => (
                  <button
                    key={`${category._id}-${idx}`}
                    onClick={() => handleCategoryClick(category._id)}
                    className="group relative flex-none w-[180px] sm:w-[280px] aspect-[4/3] rounded-2xl overflow-hidden border border-gray-200 dark:border-gray-800 shadow-sm hover:shadow-md transition-all duration-300"
                  >
                    {category.image ? (
                      <img
                        src={category.image}
                        alt={category.name}
                        className="absolute inset-0 w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      />
                    ) : (
                      <div className="absolute inset-0 bg-gray-100 dark:bg-gray-900 flex items-center justify-center transition-transform duration-500 group-hover:scale-110">
                        <span className="text-2xl opacity-50">🔧</span>
                      </div>
                    )}
                    {/* Gradient Overlay */}
                    <div className="absolute inset-x-0 bottom-0 h-3/5 bg-gradient-to-t from-black/90 via-black/40 to-transparent pointer-events-none" />
                    
                    {/* Text */}
                    <p className="absolute bottom-2 inset-x-1 text-white text-[11px] sm:text-xs font-semibold text-center leading-tight pointer-events-none drop-shadow-md">
                      {category.name}
                    </p>
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="pt-2 pb-6 px-4 bg-gray-50 dark:bg-[#0a0a0a] border-t border-gray-200 dark:border-gray-800">
        <div className="container mx-auto">
          <div className="flex justify-between items-center mb-3">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">Services</h2>
            <Link to="/services" className="text-gray-500 hover:text-gray-900 dark:hover:text-white text-sm flex items-center gap-1 transition-colors font-sans uppercase tracking-widest text-[11px] font-bold">
              view all <ArrowRight className="w-4 h-4" />
            </Link>
          </div>

          {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-white dark:bg-gray-900 h-80 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800" />
              ))}
            </div>
          ) : services.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
              {services.slice(0, 8).map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          ) : (
            <div className="text-center py-16">
              <Globe className="w-12 h-12 text-gray-300 dark:text-gray-700 mx-auto mb-3" />
              <p className="text-gray-500 dark:text-gray-400 font-sans">
                No services available yet.
              </p>
            </div>
          )}
        </div>
      </section>
    </div>
  );
};

export default Home;

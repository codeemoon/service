import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowRight, Search, Zap, Shield, Star } from "lucide-react";
import ServiceCard from "../components/ServiceCard";

const Home = () => {
  const [categories, setCategories] = useState([]);
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const bannerData = [
    {
        src: "/banner/pexels-alaxmatias-28513057.jpg",
        title: "Immaculate Cleanliness",
        subtitle: "Experience the joy of a spotless home."
    },
    {
        src: "/banner/pexels-harrun-muhammad-116282236-32467382.jpg",
        title: "Expert Repairs",
        subtitle: "Skilled professionals for every fix."
    },
    {
        src: "/banner/pexels-thirdman-7657044.jpg",
        title: "Beauty & Wellness",
        subtitle: "Salon luxury, right at your doorstep."
    },
    {
        src: "/banner/pexels-tima-miroshnichenko-6195274.jpg",
        title: "Reliable Plumbing",
        subtitle: "Leak-free living, guaranteed."
    },
    {
        src: "/banner/pexels-tima-miroshnichenko-6873174.jpg",
        title: "Electrical Safety",
        subtitle: "Certified electricians for your peace of mind."
    }
  ];

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [categoriesRes, servicesRes] = await Promise.all([
            api.get("/categories"),
            api.get("/services")
        ]);
        setCategories(categoriesRes.data);
        setServices(servicesRes.data);
      } catch (error) {
        console.error("Failed to fetch data", error);
        // Fallback dummy data if API fails or is empty for dev
        if (categories.length === 0) {
            setCategories([
                { _id: 1, name: "Cleaning", description: "Deep clean your home" },
                { _id: 2, name: "Plumbing", description: "Fix leaks instantly" },
                { _id: 3, name: "Electrician", description: "Wiring and repairs" },
                { _id: 4, name: "Salon", description: "Beauty at home" },
            ])
        }
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  // Auto-scroll banner every 3 seconds
  useEffect(() => {
    const interval = setInterval(() => {
        setCurrentImageIndex((prevIndex) => (prevIndex + 1) % bannerData.length);
    }, 3000);
    return () => clearInterval(interval);
  }, [bannerData.length]);

  return (
    <div className="text-white">
      {/* Hero Section - Image Banner */}
      <section className="relative h-[600px] overflow-hidden group">
        {/* Image Slider */}
        <div className="absolute inset-0 w-full h-full">
             {bannerData.map((item, index) => (
                <div 
                    key={index}
                    className={`absolute inset-0 w-full h-full transition-all duration-1000 ease-in-out transform ${
                        currentImageIndex === index 
                            ? 'opacity-100 scale-100' 
                            : 'opacity-0 scale-105' 
                    }`}
                >
                     <img 
                        src={item.src} 
                        alt={item.title} 
                        className="w-full h-full object-cover"
                    />
                    {/* Modern Gradient Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-[#050505] via-black/40 to-transparent"></div>
                    
                    {/* Text Content */}
                    <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-4">
                        <div className={`transition-all duration-1000 delay-300 transform ${currentImageIndex === index ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                            <h1 className="text-5xl md:text-7xl font-black bg-clip-text text-transparent bg-gradient-to-b from-white to-gray-400 mb-4 tracking-tight drop-shadow-2xl">
                                {item.title}
                            </h1>
                            <p className="text-xl md:text-2xl text-white/90 font-light tracking-wide max-w-2xl mx-auto drop-shadow-md">
                                {item.subtitle}
                            </p>
                        </div>
                    </div>
                </div>
            ))}
        </div>
        
        {/* Slide Indicators */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex space-x-3 z-20">
            {bannerData.map((_, index) => (
                <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`w-2 h-2 rounded-full transition-all duration-300 ${
                        currentImageIndex === index ? 'w-8 bg-white' : 'bg-white/40 hover:bg-white/60'
                    }`}
                />
            ))}
        </div>
      </section>

      {/* Categories Grid (One Page Love Style) */}
      <section className="py-20 bg-[#0a0a0a]">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12 border-b border-gray-800 pb-6">
            <div>
              <h2 className="text-3xl font-bold bg-white text-transparent bg-clip-text">Categories</h2>
              <p className="text-gray-400 mt-2">Explore our most popular services</p>
            </div>
            <Link to="/services" className="text-gray-400 hover:text-white transition-colors flex items-center font-medium">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {[1, 2, 3].map((i) => (
                    <div key={i} className="h-64 bg-gray-900 rounded-xl animate-pulse"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {categories.map((category) => (
                <Link 
                  to={`/services?category=${category._id}`} 
                  key={category._id}
                  className="group relative block bg-[#111] rounded-2xl overflow-hidden hover:-translate-y-2 transition-transform duration-300 border border-gray-800 hover:border-gray-700"
                >
                  <div className="aspect-w-16 aspect-h-10 bg-gray-900 relative">
                     {/* Placeholder or actual image */}
                     {category.image ? (
                        <img src={category.image} alt={category.name} className="w-full h-64 object-cover opacity-80 group-hover:opacity-100 transition-opacity" />
                     ) : (
                        <div className="w-full h-64 flex items-center justify-center bg-gray-800 text-gray-600">
                            <span className="text-4xl font-bold opacity-30">{category.name[0]}</span>
                        </div>
                     )}
                     <div className="absolute inset-0 bg-gradient-to-t from-black/90 to-transparent"></div>
                  </div>
                  
                  <div className="absolute bottom-0 left-0 right-0 p-6">
                    <h3 className="text-xl font-bold text-white mb-2">{category.name}</h3>
                    <p className="text-sm text-gray-400 line-clamp-2">{category.description || "Top rated professionals."}</p>
                    <div className="mt-4 flex items-center text-[#ff4d4d] text-sm font-bold opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
                        Explore <ArrowRight className="ml-1 w-4 h-4" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Services Section */}
      <section className="py-20 bg-[#050505] border-t border-gray-900">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-end mb-12">
            <div>
              <h2 className="text-3xl font-bold bg-white text-transparent bg-clip-text">Services</h2>
              <p className="text-gray-400 mt-2">Book the best professionals for your needs</p>
            </div>
            <Link to="/services" className="text-gray-400 hover:text-white transition-colors flex items-center font-medium">
              View all <ArrowRight className="ml-1 w-4 h-4" />
            </Link>
          </div>

          {loading ? (
             <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4].map((i) => (
                    <div key={i} className="bg-[#111] h-80 rounded-2xl animate-pulse border border-white/5"></div>
                ))}
             </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {services.map((service) => (
                <ServiceCard key={service._id} service={service} />
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Features/Stats Section */}
      <section className="py-24 border-t border-gray-900 bg-[#050505]">
          <div className="container mx-auto px-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
                  <div className="p-6">
                      <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-blue-500">
                          <Shield className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Safe & Verified</h3>
                      <p className="text-gray-400 leading-relaxed">Every professional goes through a rigorous background check and skill verification process.</p>
                  </div>
                  <div className="p-6">
                      <div className="w-16 h-16 bg-purple-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-purple-500">
                          <Zap className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">Instant Booking</h3>
                      <p className="text-gray-400 leading-relaxed">Book a service in less than 60 seconds. Our algorithm finds the best match for you instantly.</p>
                  </div>
                  <div className="p-6">
                      <div className="w-16 h-16 bg-yellow-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-yellow-500">
                          <Star className="w-8 h-8" />
                      </div>
                      <h3 className="text-xl font-bold mb-3">High Quality</h3>
                      <p className="text-gray-400 leading-relaxed">Rated 4.8/5 by thousands of happy customers. We ensure top-notch service quality.</p>
                  </div>
              </div>
          </div>
      </section>
    </div>
  );
};

export default Home;


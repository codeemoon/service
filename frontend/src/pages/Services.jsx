import { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ServiceCard from "../components/ServiceCard";
import { Search, Filter } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const categoryId = searchParams.get("category");
  const searchParam = searchParams.get("search");
  const locationParam = searchParams.get("location");
  
  const [searchTerm, setSearchTerm] = useState(searchParam || "");

  useEffect(() => {
    setSearchTerm(searchParam || "");
  }, [searchParam]);

  useEffect(() => {
    const fetchServices = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams();
        if (categoryId) params.append("category", categoryId);
        if (searchParam) params.append("search", searchParam);
        if (locationParam) params.append("location", locationParam);

        const { data } = await api.get(`/services?${params.toString()}`);
        setServices(data);
      } catch (error) {
        console.error("Failed to fetch services", error);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, [categoryId, searchParam, locationParam]);

  // Backend handles filtering now
  const filteredServices = services;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-10 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-white mb-2">Find a Professional</h1>
                <p className="text-gray-400">Browse top-rated experts for your needs</p>
            </div>
            
            <div className="relative w-full md:w-96">
                <input 
                    type="text" 
                    placeholder="Search for services..." 
                    className="w-full bg-[#111] border border-white/10 rounded-xl px-5 py-3 pl-12 text-white focus:outline-none focus:border-blue-500 transition-colors"
                    value={searchTerm}
                    onChange={(e) => {
                        setSearchTerm(e.target.value);
                        // Debounce could be added here, currently relies on Enter or explicit search
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                             // Update URL triggers fetch
                             const params = new URLSearchParams(searchParams);
                             if (searchTerm.trim()) {
                                 params.set("search", searchTerm);
                             } else {
                                 params.delete("search");
                             }
                             // Keep category/location if they exist
                             navigate(`/services?${params.toString()}`);
                        }
                    }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
        </div>

        {/* Content */}
        {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-[#111] h-80 rounded-2xl animate-pulse border border-white/5"></div>
                ))}
            </div>
        ) : filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                {filteredServices.map(service => (
                    <ServiceCard key={service._id} service={service} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20">
                <div className="bg-[#111] inline-flex p-4 rounded-full mb-4">
                    <Filter className="w-8 h-8 text-gray-600" />
                </div>
                <h3 className="text-xl font-bold text-white mb-2">No services found</h3>
                <p className="text-gray-500">Try adjusting your search or filters.</p>
            </div>
        )}
      </div>
    </div>
  );
};

export default Services;

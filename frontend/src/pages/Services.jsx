import { useState, useEffect, useMemo } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import ServiceCard from "../components/ServiceCard";
import { Search, Filter, ChevronDown } from "lucide-react";

const SORT_OPTIONS = [
  { key: "default",    label: "Default" },
  { key: "price_asc",  label: "Price: Low → High" },
  { key: "price_desc", label: "Price: High → Low" },
  { key: "rating",     label: "Top Rated" },
];

const PRICE_RANGES = [
  { key: "all",       label: "All Prices",  min: 0,   max: Infinity },
  { key: "u50",       label: "Under ₹50",   min: 0,   max: 50 },
  { key: "u150",      label: "Under ₹150",  min: 0,   max: 150 },
  { key: "u350",      label: "Under ₹350",  min: 0,   max: 350 },
  { key: "u500",      label: "Under ₹500",  min: 0,   max: 500 },
  { key: "above500",  label: "Above ₹500",  min: 500, max: Infinity },
];

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const [sortKey, setSortKey] = useState("default");
  const [priceRange, setPriceRange] = useState("all");

  const categoryId   = searchParams.get("category");
  const searchParam  = searchParams.get("search");
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
        if (categoryId)    params.append("category", categoryId);
        if (searchParam)   params.append("search", searchParam);
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

  // Client-side filter + sort
  const sortedServices = useMemo(() => {
    const range = PRICE_RANGES.find(r => r.key === priceRange) || PRICE_RANGES[0];
    let list = services.filter(s => s.price >= range.min && s.price < range.max);
    if (sortKey === "price_asc")  return [...list].sort((a, b) => a.price - b.price);
    if (sortKey === "price_desc") return [...list].sort((a, b) => b.price - a.price);
    if (sortKey === "rating")     return [...list].sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0));
    return list;
  }, [services, sortKey, priceRange]);

  return (
    <div className="min-h-screen pt-[76px] pb-12 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header & Search */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-3 gap-4">
            <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Find a Professional</h1>
            </div>
            
            <div className="relative w-full md:w-96">
                <input
                    type="text"
                    placeholder="Search for services..."
                    className="w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-xl px-5 py-3 pl-12 text-gray-900 dark:text-white focus:outline-none focus:border-blue-500 transition-colors shadow-sm placeholder:text-gray-400 dark:placeholder:text-gray-500"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter") {
                             const params = new URLSearchParams(searchParams);
                             if (searchTerm.trim()) {
                                 params.set("search", searchTerm);
                             } else {
                                 params.delete("search");
                             }
                             navigate(`/services?${params.toString()}`);
                        }
                    }}
                />
                <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-500 w-5 h-5" />
            </div>
        </div>

        {/* Filter & Sort Bar */}
        <div className="flex flex-wrap items-center gap-3 mb-6">

          {/* Price Range Dropdown */}
          <div className="relative">
            <select
              value={priceRange}
              onChange={(e) => setPriceRange(e.target.value)}
              className="appearance-none bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-xl pl-4 pr-9 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm"
            >
              {PRICE_RANGES.map(r => (
                <option key={r.key} value={r.key}>{r.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Sort Dropdown */}
          <div className="relative">
            <select
              value={sortKey}
              onChange={(e) => setSortKey(e.target.value)}
              className="appearance-none bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 text-sm rounded-xl pl-4 pr-9 py-2.5 focus:outline-none focus:border-blue-500 cursor-pointer hover:border-gray-300 dark:hover:border-gray-700 transition-colors shadow-sm"
            >
              {SORT_OPTIONS.map(o => (
                <option key={o.key} value={o.key}>{o.label}</option>
              ))}
            </select>
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500 pointer-events-none" />
          </div>

          {/* Active filter tag */}
          {priceRange !== "all" && (
            <span className="flex items-center gap-1.5 bg-blue-600/20 border border-blue-500/30 text-blue-400 text-xs font-medium px-3 py-1.5 rounded-full">
              {PRICE_RANGES.find(r => r.key === priceRange)?.label}
              <button onClick={() => setPriceRange("all")} className="hover:text-white transition-colors">✕</button>
            </span>
          )}

          {/* Result count */}
          {!loading && (
            <span className="ml-auto text-xs text-gray-600">
              {sortedServices.length} service{sortedServices.length !== 1 ? "s" : ""}
            </span>
          )}
        </div>

        {/* Content */}
        {loading ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
                    <div key={i} className="bg-white dark:bg-[#111] h-80 rounded-2xl animate-pulse border border-gray-200 dark:border-gray-800 shadow-sm"></div>
                ))}
            </div>
        ) : sortedServices.length > 0 ? (
            <div className="grid grid-cols-3 sm:grid-cols-3 lg:grid-cols-4 gap-3 sm:gap-6">
                {sortedServices.map(service => (
                    <ServiceCard key={service._id} service={service} />
                ))}
            </div>
        ) : (
            <div className="text-center py-20 bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl mt-6 shadow-sm">
                <div className="bg-gray-100 dark:bg-gray-900 inline-flex p-5 rounded-full mb-5 shadow-inner">
                    <Filter className="w-8 h-8 text-gray-400 dark:text-gray-600" />
                </div>
                {locationParam ? (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                      No services in <span className="text-blue-500 dark:text-blue-400">{locationParam}</span>
                    </h3>
                    <p className="text-gray-500 dark:text-gray-400 mb-6">There are no service providers in this location yet.</p>
                    <button
                      onClick={() => navigate("/services")}
                      className="text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 underline underline-offset-2 transition-colors font-medium"
                    >
                      Show all services instead
                    </button>
                  </>
                ) : (
                  <>
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">No services found</h3>
                    <p className="text-gray-500 dark:text-gray-400">Try adjusting your search or filters.</p>
                  </>
                )}
            </div>
        )}
      </div>
    </div>
  );
};

export default Services;


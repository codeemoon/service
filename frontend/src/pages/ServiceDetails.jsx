import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Star, MapPin, Clock, ArrowLeft, ArrowRight, CheckCircle, Calendar } from "lucide-react";
import BookingModal from "../components/BookingModal";
import ServiceCard from "../components/ServiceCard";
import { staticServices } from "../utils/staticData";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);
  const [showDescription, setShowDescription] = useState(false);

  const [showProviderServices, setShowProviderServices] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
        if (id.startsWith("srv_static_")) {
          const staticService = staticServices.find(s => s._id === id);
          if (staticService) {
            setService({ ...staticService, name: staticService.title, duration: staticService.duration || 60 });
            setProviderServices([]);
            setReviews([]);
          }
          return;
        }

        const serviceRes = await api.get(`/services/${id}`);
        setService(serviceRes.data);

        // Fetch other services from the same provider
        if (serviceRes.data.provider) {
            const providerId = serviceRes.data.provider._id || serviceRes.data.provider;
            const servicesRes = await api.get(`/services?provider=${providerId}`);
            setProviderServices(servicesRes.data.filter(s => s._id !== id));
        }

        const reviewsRes = await api.get(`/reviews/${id}`);
        setReviews(reviewsRes.data);
      } catch (error) {
        console.error("Failed to fetch service details", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetails();
  }, [id]);

  if (loading) return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center text-gray-900 dark:text-white">Loading...</div>;
  if (!service) return <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center text-gray-900 dark:text-white">Service not found</div>;

  return (
    <div className="min-h-screen pt-24 pb-12 bg-gray-50 dark:bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-5xl">
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Col: Unified Single Card */}
            <div className="md:col-span-2">
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden shadow-sm relative">
                    {/* Top Header Image */}
                    
                    {/* Embedded Back Button */}
                    <Link 
                        to="/services" 
                        className="absolute top-4 left-4 z-20 w-10 h-10 bg-black/30 hover:bg-black/50 backdrop-blur-md rounded-full flex items-center justify-center text-white transition-all shadow-md"
                    >
                        <ArrowLeft className="w-5 h-5" />
                    </Link>

                    {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-64 sm:h-80 object-cover" />
                    ) : (
                        <div className="w-full h-64 sm:h-80 bg-gray-100 dark:bg-gray-900 flex items-center justify-center">
                            <span className="text-6xl font-bold text-gray-300 dark:text-gray-800">{service.name[0]}</span>
                        </div>
                    )}

                    {/* Content Section */}
                    <div className="p-5 sm:p-6">
                    <div className="flex justify-between items-start mb-2">
                        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">{service.name || service.title}</h1>
                    </div>

                    <div className="mb-5">
                        <div className={`relative overflow-hidden transition-all duration-300 ${showDescription ? 'max-h-[1000px]' : 'max-h-24'}`}>
                            <p className="text-gray-600 dark:text-gray-400 text-lg leading-relaxed">{service.description}</p>
                            {!showDescription && (
                                <div className="absolute bottom-0 w-full h-12 bg-gradient-to-t from-white dark:from-[#111] to-transparent"></div>
                            )}
                        </div>
                        <button 
                            onClick={() => setShowDescription(!showDescription)}
                            className="text-blue-600 dark:text-blue-500 font-bold text-sm mt-2 hover:underline focus:outline-none"
                        >
                            {showDescription ? "Show Less" : "Read More"}
                        </button>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center">
                            <Clock className="w-6 h-6 text-blue-600 dark:text-blue-500 mr-3" />
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Duration</p>
                                <p className="text-gray-900 dark:text-white font-bold">{service.duration} mins</p>
                            </div>
                        </div>
                        <div className="bg-gray-50 dark:bg-gray-900/50 p-4 rounded-2xl border border-gray-100 dark:border-gray-800/50 flex items-center">
                            <Calendar className="w-6 h-6 text-green-600 dark:text-green-500 mr-3" />
                            <div>
                                <p className="text-gray-500 dark:text-gray-400 text-xs font-medium uppercase tracking-wider mb-1">Availability</p>
                                <p className="text-gray-900 dark:text-white font-bold">Mon - Sun</p>
                            </div>
                        </div>
                    </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Booking Card & Reviews */}
            <div className="md:col-span-1 sticky top-[100px] h-fit self-start -mt-8">
                <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl p-5 sm:p-6 transition-all duration-300 shadow-sm hover:shadow-md">
                    <p className="text-gray-500 dark:text-gray-400 mb-1 text-sm">Total Price</p>
                    <div className="text-3xl font-bold text-gray-900 dark:text-white mb-4 sm:mb-6">₹{service.price}</div>
                    
                    <div className="space-y-3 mb-5 sm:mb-6">
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" /> Professional Service
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" /> Secure Payment
                        </div>
                        <div className="flex items-center text-gray-600 dark:text-gray-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-600 dark:text-blue-500" /> 100% Satisfaction Guarantee
                        </div>
                    </div>

                    {id.startsWith("srv_static_") ? (
                        <div className="w-full bg-gray-200 dark:bg-gray-800 text-gray-500 font-bold py-3 sm:py-4 rounded-xl text-center cursor-not-allowed">
                            Demo Service - Cannot Book
                        </div>
                    ) : (
                        <button 
                            onClick={() => setShowBookingModal(true)}
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 sm:py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/20"
                        >
                            Book Now
                        </button>
                    )}
                </div>

                {/* Reviews Section (Right Column) */}
                <div className="mt-5">
                    <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-4">Reviews</h3>
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.slice(0, visibleReviews).map(review => (
                                <div key={review._id} className="bg-white dark:bg-[#111] p-5 rounded-2xl border border-gray-200 dark:border-gray-800 shadow-sm">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-bold text-gray-900 dark:text-white text-sm">{review.customer?.name || "Anonymous"}</div>
                                        <div className="flex text-yellow-500 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-200 dark:text-gray-700"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600 dark:text-gray-400 text-sm">{review.comment}</p>
                                </div>
                            ))}
                            
                            {visibleReviews < reviews.length ? (
                                <button 
                                    onClick={() => setVisibleReviews(prev => prev + 3)}
                                    className="w-full py-3 bg-white dark:bg-gray-900 hover:bg-gray-50 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-xl font-bold text-sm transition-colors border border-gray-200 dark:border-gray-800 shadow-sm"
                                >
                                    Load More
                                </button>
                            ) : (
                                <p className="text-center text-gray-500 dark:text-gray-600 text-sm mt-4">No more reviews</p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-white dark:bg-[#111] p-6 rounded-2xl border border-gray-200 dark:border-gray-800 text-center shadow-sm">
                            <p className="text-gray-500 italic text-sm">No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* More from this Provider */}
      {providerServices.length > 0 && (
          <div className="container mx-auto px-4 max-w-5xl mt-8 border-t border-gray-200 dark:border-gray-800 pt-8">
              {!showProviderServices ? (
                  <button 
                    onClick={() => setShowProviderServices(true)}
                    className="w-full py-4 bg-white dark:bg-[#111] hover:bg-gray-50 dark:hover:bg-[#1a1a1a] border border-gray-200 dark:border-gray-800 rounded-2xl text-gray-900 dark:text-white font-bold transition-all flex items-center justify-center text-lg shadow-sm"
                  >
                    More services from {service.provider?.name} <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
              ) : (
                <div className="animate-fade-in-down">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">More from {service.provider?.name}</h2>
                        <button 
                            onClick={() => setShowProviderServices(false)}
                            className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white text-sm"
                        >
                            Hide
                        </button>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {providerServices.map(service => (
                            <ServiceCard key={service._id} service={service} />
                        ))}
                    </div>
                </div>
              )}
          </div>
      )}

      {showBookingModal && (
        <BookingModal 
            service={service} 
            onClose={() => setShowBookingModal(false)} 
        />
      )}
    </div>
  );
};

export default ServiceDetails;

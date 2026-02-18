import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import api from "../api/axios";
import { Star, MapPin, Clock, ArrowLeft, ArrowRight, CheckCircle } from "lucide-react";
import BookingModal from "../components/BookingModal";
import ServiceCard from "../components/ServiceCard";

const ServiceDetails = () => {
  const { id } = useParams();
  const [service, setService] = useState(null);
  const [providerServices, setProviderServices] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showBookingModal, setShowBookingModal] = useState(false);
  const [visibleReviews, setVisibleReviews] = useState(3);

  const [showProviderServices, setShowProviderServices] = useState(false);

  useEffect(() => {
    const fetchDetails = async () => {
      try {
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

  if (loading) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Loading...</div>;
  if (!service) return <div className="min-h-screen bg-[#0a0a0a] flex items-center justify-center text-white">Service not found</div>;

  return (
    <div className="min-h-screen pt-20 pb-12">
      <div className="container mx-auto px-4 max-w-5xl">
        <Link to="/services" className="inline-flex items-center text-gray-400 hover:text-white mb-6 transition-colors">
            <ArrowLeft className="w-4 h-4 mr-2" /> Back to Services
        </Link>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Left Col: Image & Info */}
            <div className="md:col-span-2 space-y-8">
                <div className="rounded-2xl overflow-hidden border border-gray-800 bg-[#111]">
                    {service.image ? (
                        <img src={service.image} alt={service.name} className="w-full h-96 object-cover" />
                    ) : (
                        <div className="w-full h-96 bg-gray-900 flex items-center justify-center">
                            <span className="text-6xl font-bold text-gray-800">{service.name[0]}</span>
                        </div>
                    )}
                </div>

                <div>
                    <div className="flex justify-between items-start mb-4">
                        <h1 className="text-4xl font-bold text-white">{service.name}</h1>
                        <div className="flex items-center bg-yellow-500/10 text-yellow-500 px-3 py-1.5 rounded-lg border border-yellow-500/20">
                            <Star className="w-5 h-5 mr-1 fill-current" />
                            <span className="font-bold">{service.rating || "New"}</span>
                            <span className="text-gray-500 text-sm ml-1">({service.numReviews || 0} reviews)</span>
                        </div>
                    </div>

                    <p className="text-gray-400 text-lg leading-relaxed mb-6">{service.description}</p>
                    
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-[#111] p-4 rounded-xl border border-gray-800 flex items-center">
                            <Clock className="w-6 h-6 text-blue-500 mr-3" />
                            <div>
                                <p className="text-gray-400 text-sm">Duration</p>
                                <p className="text-white font-bold">{service.duration} mins</p>
                            </div>
                        </div>
                        <div className="bg-[#111] p-4 rounded-xl border border-gray-800 flex items-center">
                            <CheckCircle className="w-6 h-6 text-green-500 mr-3" />
                            <div>
                                <p className="text-gray-400 text-sm">Availability</p>
                                <p className="text-white font-bold">Mon - Sun</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Right Col: Booking Card & Reviews */}
            <div className="md:col-span-1 sticky top-24 h-fit self-start">
                <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 transition-all duration-300">
                    <p className="text-gray-400 mb-1">Total Price</p>
                    <div className="text-4xl font-bold text-white mb-6">₹{service.price}</div>
                    
                    <div className="space-y-4 mb-6">
                        <div className="flex items-center text-gray-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Professional Service
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> Secure Payment
                        </div>
                        <div className="flex items-center text-gray-400 text-sm">
                            <CheckCircle className="w-4 h-4 mr-2 text-blue-500" /> 100% Satisfaction Guarantee
                        </div>
                    </div>

                    <button 
                        onClick={() => setShowBookingModal(true)}
                        className="w-full bg-[#ff4d4d] hover:bg-[#ff3333] text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-red-500/20"
                    >
                        Book Now
                    </button>
                    
                    <p className="text-xs text-gray-500 text-center mt-4">No hidden fees. Cancel anytime.</p>
                </div>

                {/* Reviews Section (Right Column) */}
                <div className="mt-8">
                    <h3 className="text-xl font-bold text-white mb-6">Reviews</h3>
                    {reviews.length > 0 ? (
                        <div className="space-y-4">
                            {reviews.slice(0, visibleReviews).map(review => (
                                <div key={review._id} className="bg-[#111] p-5 rounded-xl border border-gray-800">
                                    <div className="flex items-center justify-between mb-2">
                                        <div className="font-bold text-white text-sm">{review.customer?.name || "Anonymous"}</div>
                                        <div className="flex text-yellow-500 text-xs">
                                            {[...Array(5)].map((_, i) => (
                                                <Star key={i} className={`w-3 h-3 ${i < review.rating ? "fill-current" : "text-gray-700"}`} />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-400 text-sm">{review.comment}</p>
                                </div>
                            ))}
                            
                            {visibleReviews < reviews.length ? (
                                <button 
                                    onClick={() => setVisibleReviews(prev => prev + 3)}
                                    className="w-full py-3 bg-gray-900 hover:bg-gray-800 text-gray-300 rounded-xl font-bold text-sm transition-colors border border-gray-800"
                                >
                                    Load More
                                </button>
                            ) : (
                                <p className="text-center text-gray-600 text-sm mt-4">No more reviews</p>
                            )}
                        </div>
                    ) : (
                        <div className="bg-[#111] p-6 rounded-xl border border-gray-800 text-center">
                            <p className="text-gray-500 italic text-sm">No reviews yet.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* More from this Provider */}
      {providerServices.length > 0 && (
          <div className="container mx-auto px-4 max-w-5xl mt-16 border-t border-gray-800 pt-12">
              {!showProviderServices ? (
                  <button 
                    onClick={() => setShowProviderServices(true)}
                    className="w-full py-4 bg-[#111] hover:bg-[#1a1a1a] border border-gray-800 rounded-2xl text-white font-bold transition-all flex items-center justify-center text-lg"
                  >
                    View more services from {service.provider?.name} <ArrowRight className="ml-2 w-5 h-5" />
                  </button>
              ) : (
                <div className="animate-fade-in-down">
                    <div className="flex justify-between items-end mb-8">
                        <h2 className="text-2xl font-bold text-white">More from {service.provider?.name}</h2>
                        <button 
                            onClick={() => setShowProviderServices(false)}
                            className="text-gray-400 hover:text-white text-sm"
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

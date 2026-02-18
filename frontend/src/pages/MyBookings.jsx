import { useState, useEffect } from "react";
import api from "../api/axios";
import { 
  Calendar, 
  MapPin, 
  Clock, 
  User, 
  Mail, 
  Phone, 
  CalendarDays, 
  XCircle, 
  Star, 
  CreditCard, 
  CheckCircle2, 
  ChevronRight,
  Info
} from "lucide-react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
import ReviewModal from "../components/ReviewModal";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState(null);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  const handleCancelBooking = async (id) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;
    try {
      await api.put(`/bookings/${id}/status`, { status: "cancelled" });
      toast.success("Booking cancelled");
      fetchBookings();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to cancel booking");
    }
  };

  const openReviewModal = (booking) => {
    setSelectedBooking(booking);
    setShowReviewModal(true);
  };

  const getStatusDetails = (status) => {
    switch (status) {
      case "pending": return { color: "text-yellow-500", bg: "bg-yellow-500/10", border: "border-yellow-500/20", icon: <Clock size={14} /> };
      case "accepted": return { color: "text-blue-500", bg: "bg-blue-500/10", border: "border-blue-500/20", icon: <CheckCircle2 size={14} /> };
      case "completed": return { color: "text-green-500", bg: "bg-green-500/10", border: "border-green-500/20", icon: <CheckCircle2 size={14} /> };
      case "rejected": 
      case "cancelled": return { color: "text-red-500", bg: "bg-red-500/10", border: "border-red-500/20", icon: <XCircle size={14} /> };
      default: return { color: "text-gray-500", bg: "bg-gray-500/10", border: "border-gray-500/20", icon: <Info size={14} /> };
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#0a0a0a]">
      <div className="container mx-auto px-4 max-w-5xl">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-10 gap-4">
            <div>
                <nav className="flex items-center space-x-2 text-sm text-gray-500 mb-2">
                    <Link to="/" className="hover:text-white transition-colors">Home</Link>
                    <ChevronRight size={14} />
                    <span className="text-gray-300">My Bookings</span>
                </nav>
                <h1 className="text-4xl font-black text-white tracking-tight">Your Bookings</h1>
                <p className="text-gray-500 mt-2">Manage and track all your service appointments in one place.</p>
            </div>
            <div className="flex items-center space-x-4 bg-[#111] p-1.5 rounded-2xl border border-gray-800 shadow-xl">
                 <div className="px-4 py-2 text-sm font-medium text-gray-400">
                    Total: <span className="text-white font-bold">{bookings.length}</span>
                 </div>
                 <Link to="/services" className="bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl text-sm font-bold transition-all shadow-lg shadow-red-600/20 flex items-center space-x-2">
                    <span>Book New Service</span>
                 </Link>
            </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-1 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-48 bg-[#111] border border-gray-800 rounded-3xl animate-pulse"></div>
            ))}
          </div>
        ) : bookings.length > 0 ? (
          <div className="grid grid-cols-1 gap-8">
            {bookings.map((booking) => {
                const status = getStatusDetails(booking.status);
                const isPaid = booking.status === "completed"; // Simplified logic as per current implementation

                return (
                  <div 
                    key={booking._id} 
                    className="bg-[#111] border border-gray-800 rounded-[2.5rem] overflow-hidden hover:border-gray-700 transition-all group flex flex-col md:flex-row shadow-2xl relative"
                  >
                    {/* Background Accent */}
                    <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-bl from-white/5 to-transparent pointer-events-none"></div>

                    {/* Image Section */}
                    <div className="md:w-72 p-4 flex-shrink-0">
                        <div className="relative h-56 md:h-full w-full rounded-[2rem] overflow-hidden border border-gray-800 shadow-2xl group-hover:border-red-500/20 transition-colors">
                            {booking.service?.image ? (
                                <img src={booking.service.image} alt={booking.service.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-1000 ease-out" />
                            ) : (
                                <div className="w-full h-full flex items-center justify-center text-gray-700 bg-gray-900">
                                    <CalendarDays size={64} strokeWidth={1} />
                                </div>
                            )}
                            <div className={`absolute top-4 left-4 px-3 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest border backdrop-blur-xl shadow-2xl flex items-center space-x-2 ${status.bg} ${status.color} ${status.border}`}>
                                <div className={`w-1.5 h-1.5 rounded-full bg-current animate-pulse`}></div>
                                <span>{booking.status}</span>
                            </div>
                        </div>
                    </div>

                    {/* Content Section */}
                    <div className="flex-grow p-6 md:p-8 md:pl-2 flex flex-col">
                        <div className="flex justify-between items-start">
                            <div className="flex-grow">
                                <h3 className="text-3xl md:text-4xl font-black text-white group-hover:text-red-500 transition-colors duration-300 tracking-tight leading-none mb-4">
                                    {booking.service?.name}
                                </h3>
                                
                                {/* Info Grid */}
                                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-8">
                                    {/* Date/Time */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-blue-600/10 border border-blue-500/20 flex items-center justify-center text-blue-500 shrink-0">
                                            <Calendar size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Scheduled For</p>
                                            <p className="text-white font-bold text-sm">
                                                {new Date(booking.scheduledDate).toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                                                <span className="text-gray-500 mx-1.5">•</span>
                                                {new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                                            </p>
                                        </div>
                                    </div>

                                    {/* Location */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                                            <MapPin size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Location</p>
                                            <p className="text-white font-bold text-sm line-clamp-1">{booking.address}</p>
                                        </div>
                                    </div>

                                    {/* Provider */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-green-600/10 border border-green-500/20 flex items-center justify-center text-green-500 shrink-0">
                                            <User size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Partner</p>
                                            <p className="text-white font-bold text-sm">{booking.provider?.name}</p>
                                            <p className="text-gray-500 text-xs font-medium">{booking.provider?.phone}</p>
                                        </div>
                                    </div>

                                    {/* Order Details (Status/Price combined) */}
                                    <div className="flex items-start space-x-3">
                                        <div className="w-10 h-10 rounded-2xl bg-purple-600/10 border border-purple-500/20 flex items-center justify-center text-purple-500 shrink-0">
                                            <CreditCard size={18} />
                                        </div>
                                        <div>
                                            <p className="text-[10px] font-black text-gray-600 uppercase tracking-widest mb-0.5">Payment</p>
                                            <p className="text-white font-bold text-sm flex items-center">
                                                ₹{booking.price}
                                                <span className={`ml-2 text-[9px] px-2 py-0.5 rounded-full border ${isPaid ? 'border-green-500/20 text-green-500 bg-green-500/5' : 'border-yellow-500/20 text-yellow-500 bg-yellow-500/5'}`}>
                                                    {isPaid ? "PAID" : "PENDING"}
                                                </span>
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Composed Action Area */}
                        <div className="mt-8 flex flex-col sm:flex-row items-center gap-4 justify-between border-t border-gray-800/30 pt-6">
                            <div className="flex items-center gap-3">
                                {booking.status === "pending" && (
                                    <button 
                                        onClick={() => handleCancelBooking(booking._id)}
                                        className="h-12 px-6 rounded-2xl text-sm font-black text-gray-400 hover:text-red-500 hover:bg-red-500/5 transition-all active:scale-95 flex items-center gap-2 border border-transparent hover:border-red-500/20"
                                    >
                                        <XCircle size={18} />
                                        <span>Cancel Request</span>
                                    </button>
                                )}
                                
                                {booking.status === "completed" && (
                                    <button 
                                        onClick={() => openReviewModal(booking)}
                                        className="h-12 px-10 rounded-2xl text-sm font-black bg-gradient-to-r from-red-600 to-[#ff4d4d] text-white hover:shadow-[0_0_30px_rgba(255,77,77,0.4)] transition-all duration-300 flex items-center gap-2 active:scale-95 hover:scale-105 group/rate shadow-xl shadow-red-900/20"
                                    >
                                        <Star size={18} className="group-hover/rate:rotate-45 transition-transform duration-500" />
                                        <span>Rate</span>
                                    </button>
                                )}
                            </div>

                            {booking.notes && (
                                <div className="flex items-center gap-2 text-gray-500 bg-gray-900/50 px-4 py-2 rounded-xl border border-gray-800/50">
                                    <Info size={14} className="text-blue-500" />
                                    <span className="text-xs font-medium italic line-clamp-1 truncate max-w-[200px]">"{booking.notes}"</span>
                                </div>
                            )}
                        </div>
                    </div>
                  </div>
                );
            })}
          </div>
        ) : (
          <div className="text-center py-24 bg-[#111] rounded-[3rem] border border-gray-800 shadow-2xl relative overflow-hidden">
            <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"></div>
            <div className="w-24 h-24 bg-gray-900 rounded-full flex items-center justify-center mx-auto mb-8 border border-gray-800 ring-8 ring-gray-900/50 shadow-inner">
                <CalendarDays size={40} className="text-gray-600" />
            </div>
            <h3 className="text-3xl font-black text-white mb-4">No bookings found</h3>
            <p className="text-gray-500 mb-10 max-w-md mx-auto leading-relaxed">It seems you haven't made any service bookings yet. Explore our top-rated services and get your tasks done today!</p>
            <Link to="/services" className="bg-[#ff4d4d] hover:bg-[#ff3333] text-white px-10 py-5 rounded-2xl font-black transition-all shadow-2xl shadow-red-500/30 inline-block hover:scale-105 active:scale-95">
                Find Services Now
            </Link>
          </div>
        )}
      </div>

      {showReviewModal && selectedBooking && (
        <ReviewModal 
            booking={selectedBooking} 
            onClose={() => setShowReviewModal(false)}
            onReviewSubmitted={fetchBookings}
        />
      )}
    </div>
  );
};

export default MyBookings;

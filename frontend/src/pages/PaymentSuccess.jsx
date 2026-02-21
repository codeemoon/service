import { useEffect, useState } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { CheckCircle, Home, Calendar, Clock, MapPin, Loader } from "lucide-react";

const PaymentSuccess = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const bookingId = searchParams.get("bookingId");
  
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (bookingId) {
      fetchBookingDetails();
    }
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
        // Fetch all bookings and find the one (since we don't have a single GET endpoint yet)
        const response = await api.get("/bookings"); 
        const foundBooking = response.data.find(b => b._id === bookingId);
        setBooking(foundBooking);
    } catch (error) {
      console.error("Failed to fetch booking", error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader className="animate-spin" size={48} />
    </div>
  );

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative">
      {/* Background Glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-green-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 max-w-md w-full text-center space-y-8 relative z-10 shadow-2xl">
        
        <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center mx-auto text-green-500 mb-6">
            <CheckCircle size={48} />
        </div>

        <div>
            <h1 className="text-3xl font-bold text-white mb-2">Payment Successful!</h1>
            <p className="text-gray-400">Your service has been booked successfully.</p>
        </div>

        {booking && (
            <div className="bg-[#0a0a0a] border border-gray-800 rounded-2xl p-6 text-left space-y-4">
                <div className="flex items-center space-x-4 pb-4 border-b border-gray-800">
                    {booking.service?.image && (
                         <img src={booking.service.image} alt="" className="w-16 h-16 rounded-xl object-cover" />
                    )}
                    <div>
                        <h3 className="font-bold text-white">{booking.service?.name}</h3>
                        <p className="text-blue-500 font-bold">₹{booking.price}</p>
                    </div>
                </div>
                
                <div className="space-y-3 pt-2">
                    <div className="flex items-center text-gray-400 text-sm">
                        <Calendar className="w-4 h-4 mr-3 text-gray-600" />
                        {new Date(booking.scheduledDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center text-gray-400 text-sm">
                        <Clock className="w-4 h-4 mr-3 text-gray-600" />
                        {new Date(booking.scheduledDate).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </div>
                     <div className="flex items-start text-gray-400 text-sm">
                        <MapPin className="w-4 h-4 mr-3 text-gray-600 mt-1" />
                        <span className="flex-1">{booking.address}</span>
                    </div>
                </div>
            </div>
        )}

        <button 
            onClick={() => navigate("/")}
            className="w-full bg-white text-black font-bold py-4 rounded-xl hover:bg-gray-200 transition-colors flex items-center justify-center"
        >
            <Home className="mr-2" size={20} />
            Go to Home
        </button>

      </div>
    </div>
  );
};

export default PaymentSuccess;

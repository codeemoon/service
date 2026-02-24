import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import api from "../api/axios";
import { load } from "@cashfreepayments/cashfree-js";
import { toast } from "react-hot-toast";
import { Loader, CheckCircle, AlertTriangle, ShieldCheck } from "lucide-react";

const Checkout = () => {
  const { bookingId } = useParams();
  const navigate = useNavigate();
  const [booking, setBooking] = useState(null);
  const [loading, setLoading] = useState(true);
  const [processingPayment, setProcessingPayment] = useState(false);
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initializeSDK = async () => {
      const cf = await load({
        mode: "sandbox", 
      });
      setCashfree(cf);
    };
    initializeSDK();
    fetchBookingDetails();
  }, [bookingId]);

  const fetchBookingDetails = async () => {
    try {
      // We need an endpoint to get single booking details. 
      // Assuming GET /bookings returns list, but we might need to filter or use a specific endpoint.
      // If we don't have a specific GET /bookings/:id, we might need to rely on the user's list or add it.
      // For now, let's assume valid booking info is needed.
      // Actually, looking at booking.controller.js, getBookings returns all. 
      // We might need to fetch all and find one, or better, add a specific endpoint.
      // Let's try to fetch all and filter for now to avoid backend changes if possible, 
      // but a direct fetch is better.
      // WAIT: The previous logs showed api.post("/payments/pay", { bookingId }) works with just ID.
      // I will assume I can get booking details via a standard GET /bookings (and filter client side) 
      // or simply display generic info if I can't fetch it easily.
      // Let's try to fetch the specific booking if the API supports it, otherwise fallback.
      
      const response = await api.get("/bookings"); 
      const foundBooking = response.data.find(b => b._id === bookingId);
      
      if (foundBooking) {
        setBooking(foundBooking);
      } else {
        toast.error("Booking not found");
        navigate("/dashboard");
      }
    } catch (error) {
      console.error("Error fetching booking:", error);
      toast.error("Failed to load booking details");
    } finally {
      setLoading(false);
    }
  };

  const handlePayment = async () => {
    if (!cashfree) {
      toast.error("Payment SDK not loaded");
      return;
    }
    
    setProcessingPayment(true);

    try {
      // 1. Create Order
      const response = await api.post("/payments/pay", { bookingId });
      
      if (response.data.payment_session_id) {
        const checkoutOptions = {
          paymentSessionId: response.data.payment_session_id,
          redirectTarget: "_self",
        };
        
        // 2. Open Checkout
        cashfree.checkout(checkoutOptions);
      } else {
        toast.error("Failed to initiate payment session");
      }

    } catch (error) {
      console.error("Payment Error:", error);
      toast.error(error.response?.data?.message || "Payment initiation failed");
    } finally {
      setProcessingPayment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center">
        <Loader className="animate-spin text-blue-500" size={48} />
      </div>
    );
  }

  if (!booking) return null;

  const basePrice = booking.price || 0;
  const gst = basePrice * 0.18;
  const total = basePrice + gst;

  return (
    <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-6 relative overflow-hidden">
        {/* Background Gradients */}
        <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-br from-blue-900/10 to-purple-900/10 pointer-events-none"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-blue-600/20 blur-[120px] rounded-full pointer-events-none"></div>

      <div className="max-w-4xl w-full grid grid-cols-1 md:grid-cols-2 gap-8 relative z-10">
        
        {/* Order Summary */}
        <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 shadow-2xl space-y-6">
            <h2 className="text-3xl font-bold bg-gradient-to-r from-white to-gray-400 bg-clip-text text-transparent">Order Summary</h2>
            
            <div className="space-y-4">
                <div className="flex items-start space-x-4 bg-white/5 p-4 rounded-2xl border border-white/10">
                    {booking.service?.image && (
                        <img src={booking.service.image} alt="Service" className="w-20 h-20 rounded-xl object-cover" />
                    )}
                    <div>
                        <h3 className="font-bold text-lg text-white">{booking.service?.name || "Service Name"}</h3>
                        <p className="text-gray-400 text-sm mt-1">{booking.scheduledDate ? new Date(booking.scheduledDate).toLocaleString() : "Date TBD"}</p>
                        <p className="text-gray-500 text-xs mt-2 truncate w-48">{booking.address}</p>
                    </div>
                </div>

                <div className="pt-4 space-y-3 border-t border-gray-800">
                    <div className="flex justify-between text-gray-400">
                        <span>Service Checkup</span>
                        <span>₹{basePrice.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>GST (18%)</span>
                        <span>₹{gst.toFixed(2)}</span>
                    </div>
                    <div className="flex justify-between text-gray-400">
                        <span>Platform Fee</span>
                        <span>₹0.00</span>
                    </div>
                </div>

                <div className="pt-4 border-t border-gray-800 flex justify-between items-center">
                    <span className="text-xl font-bold text-white">Total Pay</span>
                    <span className="text-2xl font-bold text-green-400">₹{total.toFixed(2)}</span>
                </div>
            </div>
        </div>

        {/* Payment Section */}
        <div className="flex flex-col justify-center space-y-6">
            <div className="bg-[#111] border border-gray-800 rounded-3xl p-8 shadow-2xl text-center space-y-6">
                <div className="w-16 h-16 bg-blue-500/10 rounded-full flex items-center justify-center mx-auto text-blue-500 mb-4">
                    <ShieldCheck size={32} />
                </div>
                
                <div>
                    <h3 className="text-2xl font-bold text-white mb-2">Secure Checkout</h3>
                    <p className="text-gray-400 text-sm">Complete your payment securely via Cashfree.</p>
                </div>

                <button 
                    onClick={handlePayment}
                    disabled={processingPayment}
                    className="w-full bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-500 hover:to-blue-600 text-white font-bold py-4 rounded-xl transition-all shadow-lg hover:shadow-blue-500/25 flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed group"
                >
                    {processingPayment ? (
                        <>
                            <Loader className="animate-spin mr-2" size={20} />
                            Processing...
                        </>
                    ) : (
                        "Pay Now"
                    )}
                </button>

                <p className="text-xs text-gray-600">
                    By proceeding, you agree to our Terms of Service. <br/> 
                    Secure 256-bit SSL Encrypted payment.
                </p>
            </div>

            <div className="bg-yellow-500/10 border border-yellow-500/20 p-4 rounded-2xl flex items-start space-x-3">
                <AlertTriangle className="text-yellow-500 shrink-0" size={20} />
                <p className="text-yellow-200/80 text-sm leading-relaxed">
                    This is a <span className="font-bold text-yellow-400">Test Mode</span> transaction. 
                    No real money will be deducted. You can use test card credentials or UPI to complete the flow.
                </p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default Checkout;

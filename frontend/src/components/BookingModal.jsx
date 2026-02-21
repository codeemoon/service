import { useState, useEffect } from "react";
import { X, Calendar, MapPin, CreditCard, Loader } from "lucide-react";
import api from "../api/axios";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { load } from "@cashfreepayments/cashfree-js";

const BookingModal = ({ service, onClose }) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);
  const [cashfree, setCashfree] = useState(null);
  
  // Slot State
  const [slots, setSlots] = useState([]);
  const [loadingSlots, setLoadingSlots] = useState(false);

  const [formData, setFormData] = useState({
    date: "",
    time: "",
    address: "",
    notes: "",
  });

  useEffect(() => {
    const initializeSDK = async () => {
        const cf = await load({
            mode: "sandbox" // or "production"
        });
        setCashfree(cf);
    };
    initializeSDK();
  }, []);

  const fetchSlots = async (date) => {
      if (!date) return;
      setLoadingSlots(true);
      try {
          // Format date as YYYY-MM-DD if not already
          const { data } = await api.get(`/services/${service._id}/slots?date=${date}`);
          setSlots(data);
      } catch (error) {
          console.error("Failed to fetch slots", error);
          toast.error("Could not load available times");
      } finally {
          setLoadingSlots(false);
      }
  };

  const handleBooking = async () => {
    if (!user) {
      toast.error("Please login to book a service");
      navigate("/login");
      return;
    }

    if (!cashfree) {
        toast.error("Payment SDK failed to load. Please verify internet connection.");
        return;
    }

    try {
      setLoading(true);
      
      // Combine Date and Time
      const scheduledDateTime = new Date(`${formData.date}T${formData.time}`);

      // Step 1: Create Booking
      const bookResponse = await api.post("/bookings", {
        serviceId: service._id,
        scheduledDate: scheduledDateTime,
        address: formData.address,
        notes: formData.notes,
      });

      const bookingId = bookResponse.data._id;
      
      toast.success("Booking Created! Redirecting to checkout...");
      onClose();
      navigate(`/checkout/${bookingId}`); // Redirect to checkout page

    } catch (error) {
      console.error("Booking failed", error);
      toast.error(error.response?.data?.message || "Booking failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-[#111] border border-gray-800 w-full max-w-lg rounded-2xl shadow-2xl relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-800">
          <h3 className="text-xl font-bold text-white">Book Service</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-white transition-colors">
            <X size={24} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6 space-y-6">
          {step === 1 && (
              <div className="space-y-4">
               {/* Detail Header */}
                <div className="bg-blue-900/20 border border-blue-500/20 p-4 rounded-xl flex items-start space-x-4">
                  {service.image && <img src={service.image} alt="" className="w-16 h-16 rounded-lg object-cover" />}
                  <div>
                    <h4 className="text-white font-bold">{service.name}</h4>
                    <p className="text-blue-400 font-bold">₹{service.price}</p>
                    <p className="text-gray-500 text-xs mt-1">Duration: {service.duration} mins</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Select Date</label>
                  <div className="relative">
                      <Calendar className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                      <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]} // Disable past dates
                          className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500"
                          value={formData.date}
                          onChange={(e) => {
                            setFormData({...formData, date: e.target.value, time: ""}); // Reset time when date changes
                            fetchSlots(e.target.value);
                          }}
                      />
                  </div>
                </div>

                {/* Slot Selection */}
                {formData.date && (
                    <div>
                        <label className="block text-gray-400 text-sm font-medium mb-2">Select Time Slot</label>
                        {loadingSlots ? (
                            <div className="text-gray-500 text-sm text-center py-2">Loading slots...</div>
                        ) : slots.length > 0 ? (
                            <div className="grid grid-cols-4 gap-2 max-h-40 overflow-y-auto custom-scrollbar">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setFormData({...formData, time: slot})}
                                        className={`py-2 px-1 rounded-lg text-sm font-medium transition-all
                                            ${formData.time === slot 
                                                ? "bg-blue-600 text-white shadow-lg shadow-blue-500/30" 
                                                : "bg-[#0a0a0a] border border-gray-700 text-gray-300 hover:border-blue-500"
                                            }
                                        `}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-red-400 text-sm text-center py-2 bg-red-900/10 rounded-lg">
                                No slots available for this date.
                            </div>
                        )}
                    </div>
                )}


                {/* Address */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Address</label>
                  <div className="relative">
                      <MapPin className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                      <textarea 
                          className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                          placeholder="Enter your full address..."
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-400 text-sm font-medium mb-2">Additional Notes (Optional)</label>
                  <div className="relative">
                      <CreditCard className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                      <textarea 
                          className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg py-3 pl-10 pr-4 text-white focus:outline-none focus:border-blue-500 min-h-[80px]"
                          placeholder="Special instructions..."
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                  </div>
                </div>

               <button 
                onClick={() => setStep(2)}
                disabled={!formData.date || !formData.time || !formData.address}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-6">
               <div className="w-16 h-16 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-4 text-green-500">
                   <CreditCard size={32} />
               </div>
               <h4 className="text-xl font-bold text-white mb-2">Payment Summary</h4>
               <p className="text-gray-400 mb-6">Total Amount: <span className="text-white font-bold text-lg">${service.price}</span></p>
               
               <p className="text-sm text-gray-500 mb-8 bg-gray-900/50 p-4 rounded-lg">
                 You are about to be redirected to the secure payment gateway.
               </p>

               <button 
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-green-600 hover:bg-green-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center"
              >
                {loading ? <Loader className="animate-spin mr-2" /> : "Confirm & Pay"}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                className="mt-4 text-gray-400 hover:text-white text-sm"
              >
                Back to Details
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default BookingModal;

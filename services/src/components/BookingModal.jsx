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
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" onClick={onClose}></div>
      <div className="bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 w-full max-w-lg rounded-3xl shadow-2xl relative z-10 overflow-hidden">
        
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-100 dark:border-gray-800">
          <h3 className="text-xl font-bold text-gray-900 dark:text-white">Book Service</h3>
          <button onClick={onClose} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white transition-colors bg-gray-100 dark:bg-gray-800 p-2 rounded-full">
            <X size={20} className="stroke-[3]" />
          </button>
        </div>

        {/* Body */}
        <div className="p-5 sm:p-6 space-y-4 max-h-[80vh] overflow-y-auto custom-scrollbar">
          {step === 1 && (
              <div className="space-y-3">
               {/* Detail Header */}
                <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-100 dark:border-blue-500/20 p-4 rounded-2xl flex items-start space-x-4">
                  {service.image && <img src={service.image} alt="" className="w-16 h-16 rounded-xl object-cover shadow-sm" />}
                  <div>
                    <h4 className="text-gray-900 dark:text-white font-bold">{service.name}</h4>
                    <p className="text-blue-600 dark:text-blue-400 font-bold">₹{service.price}</p>
                    <p className="text-gray-500 dark:text-gray-400 text-xs mt-1">Duration: {service.duration} mins</p>
                  </div>
                </div>

                {/* Date Selection */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Select Date</label>
                  <div className="relative">
                      <Calendar className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5"/>
                      <input 
                          type="date" 
                          min={new Date().toISOString().split('T')[0]} // Disable past dates
                          className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl py-3 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm"
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
                    <div className="animate-fade-in">
                        <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Select Time Slot</label>
                        {loadingSlots ? (
                            <div className="text-gray-500 text-sm text-center py-4 flex items-center justify-center">
                                <Loader className="w-4 h-4 mr-2 animate-spin" /> Loading slots...
                            </div>
                        ) : slots.length > 0 ? (
                            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3 max-h-48 overflow-y-auto custom-scrollbar p-1">
                                {slots.map(slot => (
                                    <button
                                        key={slot}
                                        onClick={() => setFormData({...formData, time: slot})}
                                        className={`py-2 px-2 rounded-xl text-sm font-bold transition-all
                                            ${formData.time === slot 
                                                ? "bg-blue-600 text-white shadow-md shadow-blue-500/30 scale-105 border-transparent" 
                                                : "bg-white dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 text-gray-700 dark:text-gray-300 hover:border-blue-500 hover:text-blue-600 dark:hover:text-blue-400"
                                            }
                                        `}
                                    >
                                        {slot}
                                    </button>
                                ))}
                            </div>
                        ) : (
                            <div className="text-red-600 dark:text-red-400 text-sm text-center py-4 bg-red-50 dark:bg-red-900/10 rounded-xl border border-red-100 dark:border-red-900/30 font-medium">
                                No slots available for this date.
                            </div>
                        )}
                    </div>
                )}


                {/* Address */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Address</label>
                  <div className="relative">
                      <MapPin className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5"/>
                      <textarea 
                          className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm min-h-[80px] resize-none"
                          placeholder="Enter your full address..."
                          value={formData.address}
                          onChange={(e) => setFormData({...formData, address: e.target.value})}
                      />
                  </div>
                </div>

                {/* Notes */}
                <div>
                  <label className="block text-gray-700 dark:text-gray-300 text-sm font-bold mb-2">Additional Notes <span className="text-gray-400 text-xs font-normal">(Optional)</span></label>
                  <div className="relative">
                      <CreditCard className="absolute left-4 top-3.5 text-gray-400 dark:text-gray-500 w-5 h-5"/>
                      <textarea 
                          className="w-full bg-gray-50 dark:bg-[#0a0a0a] border border-gray-200 dark:border-gray-800 rounded-xl py-2 pl-12 pr-4 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500 transition-all shadow-sm min-h-[60px] resize-none"
                          placeholder="Special instructions..."
                          value={formData.notes}
                          onChange={(e) => setFormData({...formData, notes: e.target.value})}
                      />
                  </div>
                </div>

               <button 
                onClick={() => setStep(2)}
                disabled={!formData.date || !formData.time || !formData.address}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-blue-500/20"
              >
                Proceed to Payment
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="text-center py-8">
               <div className="w-16 h-16 bg-green-50 dark:bg-green-500/10 rounded-full flex items-center justify-center mx-auto mb-6 text-green-600 dark:text-green-500 shadow-sm border border-green-100 dark:border-green-500/20">
                   <CreditCard size={32} />
               </div>
               <h4 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Payment Summary</h4>
               <p className="text-gray-600 dark:text-gray-400 mb-8">Total Amount: <span className="text-blue-600 dark:text-blue-400 font-bold text-xl">₹{service.price}</span></p>
               
               <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mb-8 bg-gray-50 dark:bg-gray-900/50 p-4 rounded-xl border border-gray-100 dark:border-gray-800">
                 You are about to be redirected to the secure payment gateway.
               </p>

               <button 
                onClick={handleBooking}
                disabled={loading}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center shadow-lg hover:shadow-blue-500/20"
              >
                {loading ? <Loader className="animate-spin mr-2" /> : "Confirm & Pay"}
              </button>
              
              <button 
                onClick={() => setStep(1)}
                className="mt-6 text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white font-bold text-sm transition-colors"
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

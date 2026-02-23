import { useState, useEffect } from "react";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Check, Loader, User, Mail, Lock, Phone, MapPin, Map, Hash } from "lucide-react";
import { load } from "@cashfreepayments/cashfree-js";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const PLANS = [
  {
    key: "free",
    name: "Free",
    price: null,
    priceLabel: "Free forever",
    highlight: false,
    badge: null,
    points: [
      { real: true,  text: "Earn 70% of every service price" },
      { real: false, text: "Up to 3 active service listings" },
      { real: false, text: "Standard visibility in search" },
      { real: false, text: "Basic customer support" },
      { real: false, text: "Access to booking dashboard" },
    ],
  },
  {
    key: "basic",
    name: "Basic",
    price: 350,
    priceLabel: "₹350 / month",
    highlight: true,
    badge: "Most Popular",
    points: [
      { real: true,  text: "Earn 80% of every service price" },
      { real: false, text: "Up to 15 active service listings" },
      { real: false, text: "Enhanced search visibility" },
      { real: false, text: "Priority customer support" },
      { real: false, text: "Featured in category pages" },
    ],
  },
  {
    key: "premium",
    name: "Premium",
    price: 500,
    priceLabel: "₹500 / month",
    highlight: false,
    badge: "Best Value",
    points: [
      { real: true,  text: "Earn 90% of every service price" },
      { real: false, text: "Unlimited service listings" },
      { real: false, text: "Top placement in search results" },
      { real: false, text: "24/7 dedicated support" },
      { real: false, text: "Verified badge on your profile" },
    ],
  },
];

const ProviderRegister = () => {
  const [searchParams] = useSearchParams();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  
  // OTP Verification States
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "provider",
    phone: "",
    city: "",
    area: "",
    zipCode: "",
    plan: "free",
  });

  const { register } = useAuth();
  const navigate = useNavigate();
  const [cashfree, setCashfree] = useState(null);

  useEffect(() => {
    const initCashfree = async () => {
      const instance = await load({
        mode: "sandbox", 
      });
      setCashfree(instance);
    };
    initCashfree();
  }, []);

  // Handle return from payment
  useEffect(() => {
    const orderId = searchParams.get("order_id");
    if (orderId) {
      // Restore form data from localStorage
      const savedData = localStorage.getItem("pending_registration");
      if (savedData) {
        setFormData(JSON.parse(savedData));
        localStorage.removeItem("pending_registration");
      }
      setPaymentSuccess(true);
      setStep(2); // Stay on plan selection but show success
    }
  }, [searchParams]);

  const handlePay = async () => {
    if (!cashfree) return toast.error("Payment SDK not loaded");
    
    // Save form data to localStorage so it persists after redirect
    localStorage.setItem("pending_registration", JSON.stringify(formData));

    setIsLoading(true);
    try {
      const selectedPlan = PLANS.find(p => p.key === formData.plan);
      const response = await api.post("/payments/plan-pay", {
        amount: selectedPlan.price,
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        plan: formData.plan
      });

      if (response.data.payment_session_id) {
          cashfree.checkout({
            paymentSessionId: response.data.payment_session_id,
            redirectTarget: "_self" 
          });
      }
    } catch (error) {
      console.error("Payment initiation failed:", error.response?.data || error.message);
      const errorMsg = error.response?.data?.error?.message || error.response?.data?.message || "Failed to initiate payment";
      toast.error(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    if (e) e.preventDefault();
    setIsLoading(true);
    try {
      const success = await register(formData);
      if (success) navigate("/provider");
    } finally {
      setIsLoading(false);
    }
  };

  const handleNext = async (e) => {
    if (e) e.preventDefault();
    
    // Validate required fields for Step 1
    if (!formData.name || !formData.email || !formData.password || !formData.city || !formData.area || !formData.zipCode) {
      return toast.error("Please fill all required fields");
    }

    setIsLoading(true);
    try {
      const { data } = await api.post("/auth/check-email", { email: formData.email });
      if (!data.exists) {
        setStep(2);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Something went wrong");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSendOtp = async () => {
    if (!formData.email) return toast.error("Please enter an email address first");
    
    // Simple regex check before hitting API
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(formData.email)) return toast.error("Please enter a valid email address");

    setEmailVerifying(true);
    try {
      const response = await api.post("/auth/send-otp", { email: formData.email });
      setOtpSent(true);
      toast.success(response.data?.message || "OTP sent successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to send OTP");
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleVerifyOtp = async () => {
    if (!otpCode || otpCode.length !== 6) return toast.error("Please enter a valid 6-digit OTP");

    setEmailVerifying(true);
    try {
      const response = await api.post("/auth/verify-email", { email: formData.email, otp: otpCode });
      setEmailVerified(true);
      setOtpSent(false); // Hide OTP input on success
      toast.success(response.data?.message || "Email verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setEmailVerifying(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden font-sans">
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className={`w-full ${step === 2 ? "max-w-4xl" : "max-w-[480px]"} bg-[#0f0f0f]/90 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 relative z-10 my-8 transition-all duration-300`}>

        {/* ── STEP 1: Registration form ── */}
        {step === 1 && (
          <>
            <div className="text-center mb-10">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
                 <span className="text-white font-black text-3xl">P</span>
              </div>
              <h2 className="text-4xl font-black text-white tracking-tight mb-2">Register as Provider</h2>
              <p className="text-gray-400 font-medium text-sm">Join HelpBro to offer top-tier services</p>
            </div>
            <form onSubmit={handleNext} className="space-y-5">
              {/* Full Name */}
              <div className="space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Full Name</label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                  <input type="text" required
                    className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner"
                    placeholder="John Doe" value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })} />
                </div>
              </div>

              {/* Email Address */}
              <div className="space-y-2">
                <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
                <div className="relative group">
                   <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                   <input type="email" required disabled={emailVerified || otpSent}
                     className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                     placeholder="name@example.com" value={formData.email}
                     onChange={(e) => {
                       setFormData({ ...formData, email: e.target.value });
                       if (emailVerified) setEmailVerified(false);
                     }} />
                </div>
                
                <div className="flex justify-end pt-1">
                   {emailVerified ? (
                     <div className="flex items-center gap-2 text-green-500 px-4 py-2 bg-green-500/10 rounded-xl border border-green-500/20">
                       <Check className="w-4 h-4 block" />
                       <span className="font-bold text-xs block">Verified</span>
                     </div>
                   ) : !otpSent && (
                     <button type="button" onClick={handleSendOtp} disabled={emailVerifying || !formData.email}
                       className="px-5 py-2 transition-all bg-white hover:bg-gray-200 text-black rounded-xl font-black text-xs tracking-wide shadow-[0_0_15px_rgba(255,255,255,0.1)] hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 disabled:opacity-50 flex items-center justify-center">
                       {emailVerifying ? <Loader className="animate-spin w-4 h-4 mr-2" /> : null}
                       {emailVerifying ? "Sending OTP..." : "Verify Email"}
                     </button>
                   )}
                </div>

                {/* OTP Field (Conditionally shown) */}
                {otpSent && !emailVerified && (
                   <div className="mt-4 p-5 bg-blue-900/10 border border-blue-500/30 rounded-2xl animate-fade-in-down">
                     <label className="block text-blue-400 text-[10px] font-black mb-3 uppercase tracking-widest text-center">Enter 6-digit OTP</label>
                     <div className="flex flex-col gap-4">
                       <input type="text" maxLength={6}
                         className="w-full px-4 py-4 bg-black/60 border border-blue-500/50 rounded-xl focus:outline-none focus:border-blue-400 text-white text-center font-black tracking-[0.5em] text-xl shadow-inner"
                         placeholder="------" value={otpCode}
                         onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} />
                       <button type="button" onClick={handleVerifyOtp} disabled={emailVerifying || otpCode.length !== 6}
                         className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-800 disabled:text-gray-500 text-white rounded-xl font-bold transition-colors shadow-lg shadow-green-600/20 disabled:shadow-none flex items-center justify-center">
                         {emailVerifying ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : "Verify OTP"}
                       </button>
                     </div>
                     <p className="text-xs text-gray-400 mt-5 text-center font-medium">
                        Didn't receive it? <button type="button" onClick={handleSendOtp} className="text-blue-400 hover:text-blue-300 transition-colors font-bold underline decoration-blue-400/30 underline-offset-4 ml-1">Resend OTP</button>
                     </p>
                   </div>
                )}
              </div>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
                <div className="space-y-2">
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Password</label>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input type="password" required
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner"
                      placeholder="••••••••" value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })} />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Phone</label>
                  <div className="relative group">
                    <Phone className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text"
                      className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner"
                      placeholder="+91 98765" value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })} />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
                <div className="space-y-2">
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">City</label>
                  <div className="relative group">
                    <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" required
                      className="w-full pl-9 pr-3 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner text-sm"
                      placeholder="Mumbai" value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Area</label>
                  <div className="relative group">
                    <Map className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" required
                      className="w-full pl-9 pr-3 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner text-sm"
                      placeholder="Andheri" value={formData.area}
                      onChange={(e) => setFormData({ ...formData, area: e.target.value })} />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Zip Code</label>
                  <div className="relative group">
                    <Hash className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                    <input type="text" required
                      className="w-full pl-9 pr-3 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner text-sm"
                      placeholder="400001" value={formData.zipCode}
                      onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })} />
                  </div>
                </div>
              </div>

              <button type="button" onClick={handleNext} disabled={isLoading || !emailVerified}
                title={!emailVerified ? "Please verify your email first" : ""}
                className="w-full bg-white text-black font-black py-4 px-4 rounded-2xl hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex justify-center items-center gap-2 transform active:scale-95 disabled:opacity-50 mt-8">
                {isLoading ? <Loader className="animate-spin w-5 h-5" /> : "Next →"}
              </button>
            </form>
            
            {/* Divider */}
            <div className="relative flex justify-center py-8 items-center">
                <div className="absolute inset-0 flex items-center px-4">
                   <div className="w-full border-t border-gray-800"></div>
                </div>
                <span className="relative bg-[#0f0f0f] px-4 text-xs font-black uppercase tracking-widest text-gray-500">
                   Already a Provider?
                </span>
            </div>

            <div className="text-center flex items-center justify-center gap-2">
              <span className="text-gray-400 text-sm font-medium">Access your dashboard</span>
              <Link to="/login" className="text-white text-sm font-bold border-b border-white hover:text-gray-300 hover:border-gray-300 transition-colors pb-0.5">
                Log in
              </Link>
            </div>
          </>
        )}

        {/* ── STEP 2: Plan selection ── */}
        {step === 2 && (
          <>
            {!paymentSuccess && (
              <button onClick={() => setStep(1)} className="text-gray-500 hover:text-white text-sm mb-6 flex items-center gap-1 transition-colors font-bold uppercase tracking-widest absolute top-8 left-8">
                ← Back
              </button>
            )}
            
            {paymentSuccess ? (
              <div className="text-center py-8">
                <div className="w-24 h-24 bg-green-500/20 rounded-full flex items-center justify-center mx-auto mb-6 shadow-[0_0_30px_rgba(34,197,94,0.3)]">
                  <Check className="w-12 h-12 text-green-500" />
                </div>
                <h2 className="text-4xl font-black text-white tracking-tight mb-2">Payment Successful!</h2>
                <p className="text-gray-400 mb-8 font-medium">Click below to activate your account and start offering services.</p>
                
                <button 
                  onClick={handleSubmit}
                  disabled={isLoading}
                  className="w-full max-w-sm mx-auto bg-green-600 hover:bg-green-700 hover:shadow-[0_0_20px_rgba(34,197,94,0.4)] text-white font-black py-4 px-4 rounded-2xl transition-all transform active:scale-95 flex items-center justify-center gap-2"
                >
                  {isLoading ? <Loader className="animate-spin" /> : "Go to Dashboard"}
                </button>
              </div>
            ) : (
              <div className="mt-8">
                <h2 className="text-4xl font-black text-white text-center tracking-tight mb-2">Choose Your Plan</h2>
                <p className="text-gray-500 text-center font-medium text-sm mb-10">Select the plan that fits your business. You can upgrade anytime.</p>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-10">
                  {PLANS.map((plan) => {
                    const selected = formData.plan === plan.key;
                    return (
                      <button key={plan.key} type="button"
                        onClick={() => setFormData({ ...formData, plan: plan.key })}
                        className={`relative text-left rounded-3xl p-6 md:p-8 border-2 transition-all duration-300 transform ${
                          selected
                            ? plan.highlight
                              ? "border-blue-500 bg-gradient-to-b from-blue-600/20 to-[#0f0f0f] scale-[1.03] shadow-[0_20px_40px_-10px_rgba(59,130,246,0.3)] z-10"
                              : "border-blue-500 bg-blue-600/10 scale-105 shadow-[0_20px_40px_-10px_rgba(59,130,246,0.15)] z-10"
                            : plan.highlight
                              ? "border-purple-700/50 bg-black/40 hover:border-purple-600/70 hover:scale-[1.02]"
                              : "border-gray-800/80 bg-black/40 hover:border-gray-600 hover:scale-[1.02]"
                        }`}>

                        {/* Badge */}
                        {plan.badge && (
                          <span className={`absolute -top-3.5 left-1/2 -translate-x-1/2 text-[10px] font-black px-4 py-1.5 rounded-full uppercase tracking-widest shadow-lg whitespace-nowrap ${
                            plan.highlight ? "bg-gradient-to-r from-blue-500 to-blue-700 text-white" : "bg-gradient-to-r from-purple-500 to-purple-700 text-white"
                          }`}>{plan.badge}</span>
                        )}

                        <h3 className={`text-xl font-black mb-2 ${selected ? "text-white" : "text-gray-300"}`}>
                          {plan.name}
                        </h3>

                        {/* Price */}
                        <div className="mb-6">
                          {plan.price ? (
                            <>
                              <span className="text-3xl font-black text-white">₹{plan.price}</span>
                              <span className="text-gray-500 font-medium text-sm"> / month</span>
                            </>
                          ) : (
                            <span className="text-3xl font-black text-gray-400">Free</span>
                          )}
                        </div>

                        <ul className="space-y-4">
                          {plan.points.map((pt, i) => (
                            <li key={i} className="flex items-start gap-3 text-sm">
                              <Check className={`w-4 h-4 mt-0.5 flex-shrink-0 font-bold ${
                                pt.real ? "text-green-400" : "text-gray-700"
                              }`} />
                              <span className={pt.real ? "text-white font-bold" : "text-gray-500 font-medium leading-relaxed"}>
                                {pt.text}
                              </span>
                            </li>
                          ))}
                        </ul>

                        {selected && (
                          <div className="mt-6 pt-4 border-t border-blue-500/20 text-xs font-black text-blue-400 flex items-center gap-2 uppercase tracking-widest">
                            <span className="w-2 h-2 rounded-full bg-blue-400 inline-block animate-pulse" /> Selected
                          </div>
                        )}
                      </button>
                    );
                  })}
                </div>

                <div className="max-w-md mx-auto">
                  {(() => {
                    const selectedPlan = PLANS.find(p => p.key === formData.plan);
                    const isProvider = formData.role === "provider";
                    
                    if (isProvider && selectedPlan?.price) {
                      return (
                        <button 
                          type="button"
                          onClick={handlePay}
                          disabled={isLoading}
                          className="w-full bg-gradient-to-r from-blue-600 to-blue-800 hover:from-blue-500 hover:to-blue-700 text-white font-black py-4 px-4 rounded-2xl transition-all transform active:scale-95 shadow-[0_0_20px_rgba(59,130,246,0.3)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                          {isLoading ? <Loader className="animate-spin" /> : `Pay ${selectedPlan.priceLabel} & Continue`}
                        </button>
                      );
                    } else {
                      return (
                        <button 
                          type="button"
                          onClick={handleSubmit}
                          disabled={isLoading}
                          className="w-full bg-white text-black font-black py-4 px-4 rounded-2xl hover:bg-gray-200 transition-all transform active:scale-95 shadow-[0_0_20px_rgba(255,255,255,0.2)] flex items-center justify-center gap-2 uppercase tracking-widest text-sm"
                        >
                          {isLoading ? <Loader className="animate-spin" /> : "Create Free Account"}
                        </button>
                      );
                    }
                  })()}
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default ProviderRegister;

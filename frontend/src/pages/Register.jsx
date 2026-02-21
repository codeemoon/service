import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { Loader, Check, Mail, Lock } from "lucide-react";
import api from "../api/axios";

const Register = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  
  // OTP Verification States
  const [emailVerifying, setEmailVerifying] = useState(false);
  const [otpSent, setOtpSent] = useState(false);
  const [emailVerified, setEmailVerified] = useState(false);
  const [otpCode, setOtpCode] = useState("");

  const [isLoading, setIsLoading] = useState(false);

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleVerifyEmail = async () => {
    if (!email) return toast.error("Please enter your email");

    setEmailVerifying(true);
    try {
      // Check if user already exists
      try {
        const { data } = await api.post("/auth/check-email", { email });
        if (data.exists) {
           toast.error("Account already exists. Please log in instead.");
           setEmailVerifying(false);
           return;
        }
      } catch (checkErr) {
        if (checkErr.response?.data?.exists) {
           toast.error("Account already exists. Please log in instead.");
           setEmailVerifying(false);
           return;
        }
      }

      // If new, send OTP
      await api.post("/auth/send-otp", { email });
      toast.success("OTP sent to your email!");
      setOtpSent(true);
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
      await api.post("/auth/verify-email", { email, otp: otpCode });
      setEmailVerified(true);
      setOtpSent(false); // Hide OTP field
      toast.success("Email verified successfully!");
    } catch (error) {
      toast.error(error.response?.data?.message || "Invalid or expired OTP");
    } finally {
      setEmailVerifying(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password are required");

    setIsLoading(true);

    try {
       // Registration Flow
       if (!emailVerified) {
          toast.error("Please click 'Verify Email' first to create a new account.");
          setIsLoading(false);
          return;
       }
       if (password !== confirmPassword) {
          toast.error("Passwords do not match!");
          setIsLoading(false);
          return;
       }

       await api.post("/auth/register", {
          email,
          password,
          role: "customer"
       });
       toast.success("Account created successfully!");
       
       // Auto-login after registration
       const user = await login(email, password);
       if (user) navigate("/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Registration failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden font-sans">
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[480px] bg-[#0f0f0f]/90 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 relative z-10 my-8">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
             <span className="text-white font-black text-3xl">H</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Register with us</h2>
          <p className="text-gray-400 font-medium text-sm">Join HelpBro to book top-tier services</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Email Field with Verify Button */}
          <div className="space-y-2">
            <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
            <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
               <input type="email" required disabled={emailVerified || otpSent}
                 className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                 placeholder="name@example.com" value={email}
                 onChange={(e) => {
                   setEmail(e.target.value);
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
                 <button type="button" onClick={handleVerifyEmail} disabled={emailVerifying || !email}
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
                    Didn't receive it? <button type="button" onClick={handleVerifyEmail} className="text-blue-400 hover:text-blue-300 transition-colors font-bold underline decoration-blue-400/30 underline-offset-4 ml-1">Resend OTP</button>
                 </p>
               </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-5 pt-2">
            {/* Password */}
            <div className="space-y-2">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input type="password" required
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner"
                  placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-2">
              <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Confirm</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
                <input type="password" required
                  className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner"
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading || (!emailVerified && email)}
            className="w-full bg-white text-black font-black py-4 px-4 rounded-2xl hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex justify-center items-center gap-2 transform active:scale-95 disabled:opacity-50 mt-8">
            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : "Sign Up"}
          </button>
        </form>
        
        {/* Divider */}
        <div className="relative flex justify-center py-8 items-center">
            <div className="absolute inset-0 flex items-center px-4">
               <div className="w-full border-t border-gray-800"></div>
            </div>
            <span className="relative bg-[#0f0f0f] px-4 text-xs font-black uppercase tracking-widest text-gray-500">
               Or connect with
            </span>
        </div>

        {/* Google Auth */}
        <div className="flex justify-center transition-transform hover:scale-105 active:scale-95 duration-200">
            <GoogleLogin
                onSuccess={async (credentialResponse) => {
                    const user = await googleLogin(credentialResponse.credential);
                    if (user) {
                        if (user.role === "admin") navigate("/admin");
                        else if (user.role === "provider") navigate("/provider");
                        else navigate("/");
                    }
                }}
                onError={() => {
                    console.log('Login Failed');
                    toast.error("Google Login Failed");
                }}
                theme="filled_black"
                shape="pill"
                width="340px"
            />
        </div>

        {/* Login Links */}
        <div className="mt-10 pt-8 border-t border-gray-800/50 text-center flex items-center justify-center gap-2">
           <span className="text-gray-400 text-sm font-medium">Already have an account?</span>
           <Link to="/login" className="text-white text-sm font-bold border-b border-white hover:text-gray-300 hover:border-gray-300 transition-colors pb-0.5">
              Sign In
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

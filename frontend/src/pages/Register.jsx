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
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden font-sans">
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 right-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 left-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[480px] bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-3xl p-6 sm:p-8 rounded-[2rem] shadow-xl dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 relative z-10 my-4">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Register with us</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-3">
          {/* Email Field with Verify Button */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
            <div className="relative group">
               <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
               <input type="email" required disabled={emailVerified || otpSent}
                 className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white transition-all shadow-inner disabled:opacity-50 disabled:cursor-not-allowed"
                 placeholder="name@example.com" value={email}
                 onChange={(e) => {
                   setEmail(e.target.value);
                   if (emailVerified) setEmailVerified(false);
                 }} />
            </div>
               
            <div className="flex justify-end pt-1">
               {emailVerified ? (
                 <div className="flex items-center gap-2 text-green-600 dark:text-green-500 px-4 py-2 bg-green-50 dark:bg-green-500/10 rounded-xl border border-green-200 dark:border-green-500/20">
                   <Check className="w-4 h-4 block" />
                   <span className="font-bold text-xs block">Verified</span>
                 </div>
               ) : !otpSent && (
                 <button type="button" onClick={handleVerifyEmail} disabled={emailVerifying || !email}
                   className="px-5 py-2 transition-all bg-gray-900 text-white dark:bg-white dark:hover:bg-gray-200 dark:text-black rounded-xl font-black text-xs tracking-wide shadow-md dark:shadow-[0_0_15px_rgba(255,255,255,0.1)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] active:scale-95 disabled:opacity-50 flex items-center justify-center">
                   {emailVerifying ? <Loader className="animate-spin w-4 h-4 mr-2" /> : null}
                   {emailVerifying ? "Sending OTP..." : "Verify Email"}
                 </button>
               )}
            </div>
            
            {/* OTP Field (Conditionally shown) */}
            {otpSent && !emailVerified && (
               <div className="mt-4 p-5 bg-blue-50 dark:bg-blue-900/10 border border-blue-100 dark:border-blue-500/30 rounded-2xl animate-fade-in-down">
                 <label className="block text-blue-600 dark:text-blue-400 text-[10px] font-black mb-3 uppercase tracking-widest text-center">Enter 6-digit OTP</label>
                 <div className="flex flex-col gap-4">
                   <input type="text" maxLength={6}
                     className="w-full px-4 py-4 bg-white dark:bg-black/60 border border-gray-200 dark:border-blue-500/50 rounded-xl focus:outline-none focus:border-blue-500 dark:focus:border-blue-400 text-gray-900 dark:text-white text-center font-black tracking-[0.5em] text-xl shadow-inner"
                     placeholder="------" value={otpCode}
                     onChange={(e) => setOtpCode(e.target.value.replace(/\D/g, ''))} />
                   <button type="button" onClick={handleVerifyOtp} disabled={emailVerifying || otpCode.length !== 6}
                     className="w-full px-6 py-4 bg-green-600 hover:bg-green-700 disabled:bg-gray-200 dark:disabled:bg-gray-800 text-white disabled:text-gray-400 dark:disabled:text-gray-500 rounded-xl font-bold transition-colors shadow-lg shadow-green-600/20 disabled:shadow-none flex items-center justify-center">
                     {emailVerifying ? <Loader className="animate-spin w-5 h-5 mx-auto" /> : "Verify OTP"}
                   </button>
                 </div>
                 <p className="text-xs text-gray-500 dark:text-gray-400 mt-5 text-center font-medium">
                    Didn't receive it? <button type="button" onClick={handleVerifyEmail} className="text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300 transition-colors font-bold underline decoration-blue-600/30 dark:decoration-blue-400/30 underline-offset-4 ml-1">Resend OTP</button>
                 </p>
               </div>
            )}
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-0">
            {/* Password */}
            <div className="space-y-1.5">
              <label className="block text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Password</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input type="password" required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white transition-all shadow-inner"
                  placeholder="••••••••" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="block text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Confirm</label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
                <input type="password" required
                  className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white transition-all shadow-inner"
                  placeholder="••••••••" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} />
              </div>
            </div>
          </div>

          {/* Submit */}
          <button type="submit" disabled={isLoading || (!emailVerified && email)}
            className="w-full bg-blue-600 dark:bg-white text-white dark:text-black font-black py-3.5 px-4 rounded-xl hover:bg-blue-700 dark:hover:bg-gray-200 dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex justify-center items-center gap-2 transform active:scale-95 disabled:opacity-50 mt-4 shadow-md">
            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : "Sign Up"}
          </button>
        </form>
        
        {/* Divider */}
        <div className="relative flex justify-center py-4 items-center">
            <div className="absolute inset-0 flex items-center px-2">
               <div className="w-full border-t border-gray-200 dark:border-gray-800"></div>
            </div>
            <span className="relative bg-white dark:bg-[#0f0f0f] px-4 text-xs font-black uppercase tracking-widest text-gray-400 dark:text-gray-500">
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
                width="280px"
            />
        </div>

        {/* Login Links */}
        <div className="mt-5 pt-4 border-t border-gray-200 dark:border-gray-800/50 text-center flex items-center justify-center gap-2">
           <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">Already have an account?</span>
           <Link to="/login" className="text-gray-900 dark:text-white text-sm font-bold border-b border-gray-900 dark:border-white hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-600 dark:hover:border-gray-300 transition-colors pb-0.5">
              Sign In
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Register;

import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";
import { Loader, Mail, Lock } from "lucide-react";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const { login, googleLogin, silentLogout } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password are required");

    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
         if (user.role !== "customer") {
             silentLogout();
             toast.error("Access denied. Please use the provider portal to log in.");
             return;
         }
         navigate("/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden font-sans">
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-400/20 dark:bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-400/20 dark:bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[440px] bg-white/90 dark:bg-[#0f0f0f]/90 backdrop-blur-3xl p-6 sm:p-8 rounded-[2rem] shadow-xl dark:shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-gray-200 dark:border-white/5 relative z-10">
        <div className="text-center mb-6">
          <h2 className="text-3xl font-black text-gray-900 dark:text-white tracking-tight">Welcome Back</h2>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Email */}
          <div className="space-y-1.5">
            <label className="block text-gray-400 dark:text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 dark:text-gray-500 w-4 h-4 group-focus-within:text-blue-500 transition-colors" />
              <input type="email" required
                className="w-full pl-10 pr-4 py-3 bg-gray-50 dark:bg-black/50 border border-gray-200 dark:border-gray-800 rounded-xl focus:outline-none focus:border-blue-500/50 focus:bg-white dark:focus:bg-black text-gray-900 dark:text-white transition-all shadow-inner"
                placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

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

          {/* Submit */}
          <button type="submit" disabled={isLoading}
            className="w-full bg-blue-600 dark:bg-white text-white dark:text-black font-black py-3.5 px-4 rounded-xl hover:bg-blue-700 dark:hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(37,99,235,0.2)] dark:hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex justify-center items-center gap-2 transform active:scale-95 disabled:opacity-50 mt-6 shadow-md">
            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : "Sign In"}
          </button>
        </form>
        
        {/* Divider */}
        <div className="relative flex justify-center py-6 items-center">
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
                        if (user.role !== "customer") {
                            silentLogout();
                            toast.error("Access denied. Please use the provider portal to log in.");
                            return;
                        }
                        navigate("/");
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

        {/* Registration Links */}
        <div className="mt-8 pt-6 border-t border-gray-200 dark:border-gray-800/50 text-center flex items-center justify-center gap-2">
           <span className="text-gray-500 dark:text-gray-400 text-sm font-medium">New to HelpBro?</span>
           <Link to="/register" className="text-gray-900 dark:text-white text-sm font-bold border-b border-gray-900 dark:border-white hover:text-gray-600 dark:hover:text-gray-300 hover:border-gray-600 dark:hover:border-gray-300 transition-colors pb-0.5">
              Create an account
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

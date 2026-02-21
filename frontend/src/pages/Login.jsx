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

  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !password) return toast.error("Email and password are required");

    setIsLoading(true);

    try {
      const user = await login(email, password);
      if (user) {
         navigate(user.role === "admin" ? "/admin" : user.role === "provider" ? "/provider" : "/");
      }
    } catch (error) {
      toast.error(error.response?.data?.message || "Login failed");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#050505] flex items-center justify-center pt-24 pb-12 px-4 relative overflow-hidden font-sans">
      {/* Background Glowing Accents */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-600/10 rounded-full blur-[140px] pointer-events-none"></div>
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/10 rounded-full blur-[140px] pointer-events-none"></div>

      <div className="w-full max-w-[440px] bg-[#0f0f0f]/90 backdrop-blur-3xl p-8 sm:p-12 rounded-[2.5rem] shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] border border-white/5 relative z-10">
        <div className="text-center mb-10">
          <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/20">
             <span className="text-white font-black text-3xl">H</span>
          </div>
          <h2 className="text-4xl font-black text-white tracking-tight mb-2">Welcome Back</h2>
          <p className="text-gray-400 font-medium text-sm">Sign in to your account to continue</p>
        </div>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Email */}
          <div className="space-y-2">
            <label className="block text-gray-500 text-[10px] font-black uppercase tracking-[0.2em]">Email Address</label>
            <div className="relative group">
              <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 w-5 h-5 group-focus-within:text-blue-500 transition-colors" />
              <input type="email" required
                className="w-full pl-12 pr-4 py-4 bg-black/50 border border-gray-800 rounded-2xl focus:outline-none focus:border-blue-500/50 focus:bg-black text-white transition-all shadow-inner"
                placeholder="name@example.com" value={email} onChange={(e) => setEmail(e.target.value)} />
            </div>
          </div>

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

          {/* Submit */}
          <button type="submit" disabled={isLoading}
            className="w-full bg-white text-black font-black py-4 px-4 rounded-2xl hover:bg-gray-200 hover:shadow-[0_0_20px_rgba(255,255,255,0.2)] transition-all flex justify-center items-center gap-2 transform active:scale-95 disabled:opacity-50 mt-8">
            {isLoading ? <Loader className="animate-spin w-5 h-5" /> : "Sign In"}
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

        {/* Registration Links */}
        <div className="mt-10 pt-8 border-t border-gray-800/50 text-center flex items-center justify-center gap-2">
           <span className="text-gray-400 text-sm font-medium">New to HelpBro?</span>
           <Link to="/register" className="text-white text-sm font-bold border-b border-white hover:text-gray-300 hover:border-gray-300 transition-colors pb-0.5">
              Create an account
           </Link>
        </div>
      </div>
    </div>
  );
};

export default Login;

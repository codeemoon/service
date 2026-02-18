import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { GoogleLogin } from "@react-oauth/google";
import { toast } from "react-hot-toast";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const { login, googleLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const user = await login(formData.email, formData.password);
    if (user) {
      if (user.role === "admin") {
          navigate("/admin");
      } else if (user.role === "provider") {
          navigate("/provider");
      } else {
          navigate("/");
      }
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#111] p-8 rounded-2xl shadow-xl mt-10 border border-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-tight">Welcome Back</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Email Address</label>
          <input
            type="email"
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
            placeholder="name@example.com"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Password</label>
          <input
            type="password"
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
          />
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-[1.02]"
        >
          Sign In
        </button>
        
        <div className="relative flex py-2 items-center">
            <div className="flex-grow border-t border-gray-700"></div>
            <span className="flex-shrink-0 mx-4 text-gray-500 text-sm">Or continue with</span>
            <div className="flex-grow border-t border-gray-700"></div>
        </div>

        <div className="flex justify-center">
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
                shape="circle"
                width="100%"
            />
        </div>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        Don't have an account?{" "}
        <Link to="/register" className="text-white hover:underline font-medium">
          Sign up
        </Link>
      </p>
    </div>
  );
};

export default Login;

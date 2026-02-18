import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    role: "customer",
    phone: "",
    city: "",
    district: "",
    zipCode: "",
  });
  const { register } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const success = await register(formData);
    if (success) {
      navigate("/login");
    }
  };

  return (
    <div className="max-w-md mx-auto bg-[#111] p-8 rounded-2xl shadow-xl mt-10 border border-gray-800">
      <h2 className="text-3xl font-bold mb-6 text-center text-white tracking-tight">Create Account</h2>
      <form onSubmit={handleSubmit} className="space-y-5">
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Full Name</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
            placeholder="John Doe"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          />
        </div>
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
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">Phone</label>
          <input
            type="text"
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
            placeholder="+1 234 567 890"
            value={formData.phone}
            onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          />
        </div>
        <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">City</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
                placeholder="New York"
                value={formData.city}
                onChange={(e) => setFormData({ ...formData, city: e.target.value })}
              />
            </div>
            <div>
              <label className="block text-gray-400 text-sm font-medium mb-2">Zip Code</label>
              <input
                type="text"
                required
                className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
                placeholder="10001"
                value={formData.zipCode}
                onChange={(e) => setFormData({ ...formData, zipCode: e.target.value })}
              />
            </div>
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">District</label>
          <input
            type="text"
            required
            className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white transition-colors placeholder-gray-600"
            placeholder="Brooklyn"
            value={formData.district}
            onChange={(e) => setFormData({ ...formData, district: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-gray-400 text-sm font-medium mb-2">I am a</label>
          <div className="relative">
            <select
              className="w-full px-4 py-3 bg-[#0a0a0a] border border-gray-700 rounded-lg focus:outline-none focus:border-blue-500 text-white appearance-none transition-colors"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value })}
            >
              <option value="customer">Customer</option>
              <option value="provider">Service Provider</option>
            </select>
            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-gray-400">
               <svg className="fill-current h-4 w-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M9.293 12.95l.707.707L15.657 8l-1.414-1.414L10 10.828 5.757 6.586 4.343 8z"/></svg>
            </div>
          </div>
        </div>
        <button
          type="submit"
          className="w-full bg-white text-black font-bold py-3 px-4 rounded-lg hover:bg-gray-200 transition-all transform hover:scale-[1.02] mt-2"
        >
          Create Account
        </button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-400">
        Already have an account?{" "}
        <Link to="/login" className="text-white hover:underline font-medium">
          Log in
        </Link>
      </p>
    </div>
  );
};

export default Register;

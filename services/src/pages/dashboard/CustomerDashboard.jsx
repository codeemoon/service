import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Link, useSearchParams } from "react-router-dom";
import { Calendar, MapPin, Clock, User, Mail, Phone, CalendarDays, ShieldCheck, XCircle, Star } from "lucide-react";
import { useAuth } from "../../context/AuthContext";
import { toast } from "react-hot-toast";
import ReviewModal from "../../components/ReviewModal";

const CustomerDashboard = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { user } = useAuth();
  
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchBookings();
  }, []);

  const fetchBookings = async () => {
    try {
      const { data } = await api.get("/bookings");
      setBookings(data);
    } catch (error) {
      console.error("Failed to fetch bookings", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen pt-28 pb-20 bg-[#050505]">
      <div className="container mx-auto px-4 max-w-6xl">
        <div className="flex flex-col md:flex-row justify-between items-end mb-16 gap-6">
            <div>
              <div className="flex items-center space-x-3 mb-2">
                <div className="w-8 h-1 bg-red-600 rounded-full"></div>
                <span className="text-red-500 font-black text-xs uppercase tracking-[0.3em]">Identity Hub</span>
              </div>
              <h1 className="text-5xl md:text-6xl font-black text-white tracking-tighter leading-none">Settings.</h1>
              <p className="text-gray-500 mt-4 font-medium text-lg max-w-md">Refine your profile, secure your account, and track your activity.</p>
            </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Profile Overview - Left Column */}
          <div className="lg:col-span-4 space-y-8">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-[3rem] p-10 text-center shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative overflow-hidden group">
                  {/* Glass Accent */}
                  <div className="absolute -top-10 -right-10 w-40 h-40 bg-blue-600/10 rounded-full blur-3xl group-hover:bg-blue-600/20 transition-colors"></div>
                  
                  <div className="relative inline-block mb-8">
                    <div className="w-32 h-32 bg-gradient-to-tr from-blue-700 to-purple-600 rounded-full flex items-center justify-center text-4xl font-black text-white shadow-2xl relative z-10 group-hover:scale-105 transition-transform duration-700">
                        {user?.name?.[0]}
                    </div>
                    {/* Animated Ring */}
                    <div className="absolute inset-[-8px] border border-blue-500/20 rounded-full animate-[spin_10s_linear_infinite]"></div>
                    <div className="absolute inset-[-12px] border border-white/5 rounded-full"></div>
                  </div>

                  <h2 className="text-3xl font-black text-white mb-2 tracking-tight">{user?.name}</h2>
                  <div className="inline-flex items-center px-4 py-1.5 rounded-full bg-gray-900 border border-gray-800 text-[10px] font-black text-gray-400 uppercase tracking-widest mb-10">
                    {user?.role} Account
                  </div>

                  <div className="pt-8 border-t border-gray-800/50 flex flex-col items-center space-y-3">
                      <div className="flex items-center text-gray-500 text-sm font-bold uppercase tracking-widest bg-black/40 px-5 py-2.5 rounded-2xl border border-gray-800/50">
                        <CalendarDays className="w-4 h-4 mr-3 text-blue-500" />
                        Est. {new Date(user?.createdAt).toLocaleDateString(undefined, { month: 'short', year: 'numeric' })}
                      </div>
                  </div>
              </div>

              <div className="bg-[#0f0f0f] border border-gray-800 rounded-[2.5rem] p-8 shadow-xl relative overflow-hidden group">
                  <h3 className="text-white font-black text-[10px] uppercase tracking-[0.3em] mb-6 flex items-center">
                      <ShieldCheck className="w-4 h-4 mr-3 text-green-500" /> Security
                  </h3>
                  <button className="w-full text-left p-5 rounded-2xl bg-black border border-gray-800 text-gray-400 hover:text-white hover:border-red-500/40 transition-all text-sm font-black flex justify-between items-center group/btn shadow-inner">
                      <span>Change Password</span>
                      <div className="w-8 h-8 rounded-full bg-gray-900 border border-gray-800 flex items-center justify-center group-hover/btn:bg-red-600 group-hover/btn:border-red-600 transition-all">
                        <span className="text-lg group-hover/btn:translate-x-0.5 transition-transform">→</span>
                      </div>
                  </button>
              </div>
          </div>

          {/* Profile Details - Right Column */}
          <div className="lg:col-span-8 space-y-10">
              <div className="bg-[#0f0f0f] border border-gray-800 rounded-[3rem] p-10 md:p-12 shadow-[0_30px_60px_-15px_rgba(0,0,0,0.5)] relative">
                  <div className="flex items-center justify-between mb-12">
                     <h3 className="text-2xl font-black text-white tracking-tight flex items-center">
                        Personal Info
                        <div className="ml-4 w-12 h-0.5 bg-gray-800"></div>
                     </h3>
                     <User className="text-gray-800" size={24} />
                  </div>

                  <div className="space-y-10">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
                          <div className="group">
                              <label className="block text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 group-hover:text-blue-500 transition-colors">Legal Name</label>
                              <div className="flex items-center bg-black border border-gray-800 rounded-[1.5rem] p-5 text-white font-bold transition-all group-hover:border-gray-700 shadow-inner">
                                  <div className="w-10 h-10 rounded-xl bg-blue-600/10 flex items-center justify-center text-blue-500 mr-4 border border-blue-500/20 shadow-lg shadow-blue-500/5">
                                    <User size={18} />
                                  </div>
                                  <span className="text-xl tracking-tight">{user?.name}</span>
                              </div>
                          </div>
                          <div className="group">
                              <label className="block text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 group-hover:text-red-500 transition-colors">Electronic Mail</label>
                              <div className="flex items-center bg-black border border-gray-800 rounded-[1.5rem] p-5 text-white font-bold transition-all group-hover:border-gray-700 shadow-inner">
                                  <div className="w-10 h-10 rounded-xl bg-red-600/10 flex items-center justify-center text-red-500 mr-4 border border-red-500/20 shadow-lg shadow-red-500/5">
                                    <Mail size={18} />
                                  </div>
                                  <span className="truncate max-w-[180px]">{user?.email}</span>
                              </div>
                          </div>
                      </div>

                      <div className="group">
                          <label className="block text-gray-600 text-[10px] font-black uppercase tracking-[0.3em] mb-4 group-hover:text-green-500 transition-colors">Communication Channel</label>
                          <div className="flex items-center bg-black border border-gray-800 rounded-[1.5rem] p-5 text-white font-bold transition-all group-hover:border-gray-700 shadow-inner">
                              <div className="w-10 h-10 rounded-xl bg-green-600/10 flex items-center justify-center text-green-500 mr-4 border border-green-500/20 shadow-lg shadow-green-500/5">
                                <Phone size={18} />
                              </div>
                              <span className="text-xl tracking-widest">{user?.phone || "000 000 0000"}</span>
                          </div>
                      </div>
                  </div>
              </div>

              {/* Account Activity Stats */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0f0f0f] border border-gray-800 rounded-[2.5rem] p-8 text-center shadow-xl group hover:border-blue-500/40 transition-all hover:-translate-y-2 duration-500">
                      <div className="text-5xl font-black text-white mb-3 group-hover:scale-110 transition-transform duration-500">{bookings.length}</div>
                      <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-blue-500 transition-colors">Total Orders</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-gray-800 rounded-[2.5rem] p-8 text-center shadow-xl group hover:border-green-500/40 transition-all hover:-translate-y-2 duration-500">
                      <div className="text-5xl font-black text-green-500 mb-3 group-hover:scale-110 transition-transform duration-500">
                          {bookings.filter(b => b.status === 'completed').length}
                      </div>
                      <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-green-500 transition-colors">Fulfilled</div>
                  </div>
                  <div className="bg-[#0f0f0f] border border-gray-800 rounded-[2.5rem] p-8 text-center shadow-xl group hover:border-yellow-500/40 transition-all hover:-translate-y-2 duration-500">
                      <div className="text-5xl font-black text-yellow-500 mb-3 group-hover:scale-110 transition-transform duration-500">
                          {bookings.filter(b => ['pending', 'accepted'].includes(b.status)).length}
                      </div>
                      <div className="text-gray-500 text-[10px] font-black uppercase tracking-[0.3em] group-hover:text-yellow-500 transition-colors">In-Progress</div>
                  </div>
              </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CustomerDashboard;

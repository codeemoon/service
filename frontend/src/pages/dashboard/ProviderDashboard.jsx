import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Briefcase, Calendar, Wallet, Plus, Edit2, Trash2, Check, Loader, Image as ImageIcon, X, Clock } from "lucide-react";
import { toast } from "react-hot-toast";
import { convertToWebp } from "../../utils/convertToWebp";
import { useAuth } from "../../context/AuthContext";

const ProviderDashboard = () => {
  const { logout } = useAuth();
  const [activeTab, setActiveTab] = useState("bookings");
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Service Modal State
  const [showServiceModal, setShowServiceModal] = useState(false);
  const [editingService, setEditingService] = useState(null);
  const [categories, setCategories] = useState([]);
  const [serviceForm, setServiceForm] = useState({
    name: "",
    description: "",
    price: "",
    duration: "",
    category: "",
    startTime: "09:00",
    endTime: "17:00",
    image: null
  });
  const [savingService, setSavingService] = useState(false);
  
  // My Services State
  const [myServices, setMyServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  // Wallet State
  const [walletData, setWalletData] = useState({ walletBalance: null, plan: "free", rate: 0.70 });

  useEffect(() => {
    fetchCategories();
    fetchWallet();
  }, []);

  useEffect(() => {
    if (activeTab === "services") {
      fetchMyServices();
    } else if (activeTab === "bookings") {
      fetchBookings();
    }
  }, [activeTab]);

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

  const fetchWallet = async () => {
    try {
      const { data } = await api.get("/admin/wallet");
      setWalletData({ walletBalance: data.walletBalance, plan: data.plan ?? "free", rate: data.rate ?? 0.70 });
    } catch (error) {
      console.error("Failed to fetch wallet", error);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      console.error("Failed to fetch categories");
    }
  };

  const fetchMyServices = async () => {
    setLoadingServices(true);
    try {
      const { data } = await api.get("/services/provider/me");
      setMyServices(data);
    } catch (error) {
      console.error("Failed to fetch my services");
      toast.error("Failed to load services");
    } finally {
      setLoadingServices(false);
    }
  };

  const updateStatus = async (id, status) => {
    try {
      await api.put(`/bookings/${id}/status`, { status });
      toast.success(`Booking ${status}!`);
      fetchBookings();
    } catch (error) {
      toast.error("Failed to update status");
    }
  };

  const handleSaveService = async (e) => {
    e.preventDefault();
    setSavingService(true);
    
    try {
      const formData = new FormData();
      formData.append("name", serviceForm.name);
      formData.append("description", serviceForm.description);
      formData.append("price", serviceForm.price);
      formData.append("duration", serviceForm.duration);
      formData.append("category", serviceForm.category);
      formData.append("startTime", serviceForm.startTime);
      formData.append("endTime", serviceForm.endTime);
      if (serviceForm.image) {
        formData.append("image", serviceForm.image);
      }

      if (editingService) {
        await api.put(`/services/${editingService._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service updated!");
      } else {
        await api.post("/services", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Service created!");
      }
      
      setShowServiceModal(false);
      setServiceForm({ name: "", description: "", price: "", duration: "", category: "", startTime: "09:00", endTime: "17:00", image: null });
      setEditingService(null);
      fetchMyServices();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save service");
    } finally {
      setSavingService(false);
    }
  };

  const handleEditService = (service) => {
    setEditingService(service);
    setServiceForm({
      name: service.name,
      description: service.description,
      price: service.price,
      duration: service.duration,
      category: service.category._id || service.category,
      startTime: service.startTime || "09:00",
      endTime: service.endTime || "17:00",
      image: null
    });
    setShowServiceModal(true);
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success("Service deleted!");
      fetchMyServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  const handleDeleteAccount = async () => {
    if (!confirm("Are you sure? This will delete your account and all your services permanently.")) return;
    try {
      await api.delete("/users/me");
      toast.success("Account deleted");
      logout();
      window.location.href = "/";
    } catch (error) {
      toast.error("Failed to delete account");
    }
  };

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold text-white">Provider Dashboard</h1>
            <button onClick={handleDeleteAccount} className="text-red-500 hover:text-red-400 font-bold text-sm bg-red-500/10 px-4 py-2 rounded-lg border border-red-500/20 hover:bg-red-500/20 transition">
                Delete Account
            </button>
        </div>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-gray-800">
          <TabButton active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} icon={<Calendar className="w-4 h-4" />} label="Booking Requests" />
          <TabButton active={activeTab === "services"} onClick={() => setActiveTab("services")} icon={<Briefcase className="w-4 h-4" />} label="My Services" />
        </div>

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            {/* Wallet Card */}
            <div className="bg-gradient-to-r from-green-950/60 to-emerald-900/30 border border-green-800/40 rounded-2xl p-5 mb-6 flex items-center gap-5">
              <div className="w-14 h-14 rounded-2xl bg-green-600/20 border border-green-500/20 flex items-center justify-center flex-shrink-0">
                <Wallet className="w-7 h-7 text-green-400" />
              </div>
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-0.5">
                  <p className="text-green-400/70 text-xs font-semibold uppercase tracking-wider">My Wallet Balance</p>
                  <span className={`text-xs font-bold px-2 py-0.5 rounded-full capitalize ${
                    walletData.plan === "premium" ? "bg-yellow-500/20 text-yellow-400" :
                    walletData.plan === "basic"   ? "bg-blue-500/20 text-blue-400" :
                                                    "bg-gray-700 text-gray-400"
                  }`}>{walletData.plan}</span>
                </div>
                <p className="text-3xl font-black text-green-300">
                  {walletData.walletBalance === null ? (
                    <span className="text-gray-600 text-xl">Loading...</span>
                  ) : (
                    <>₹{walletData.walletBalance.toLocaleString('en-IN')}</>
                  )}
                </p>
                <p className="text-gray-600 text-xs mt-1">
                  You earn <span className="text-green-500 font-bold">{Math.round((walletData.rate ?? 0.7) * 100)}%</span> of every completed booking
                </p>
              </div>
            </div>

            {loading ? (
              <div className="text-white">Loading...</div>
            ) : bookings.length > 0 ? (
              <div className="space-y-4">
                {bookings.map((booking) => (
                  <div key={booking._id} className="bg-[#111] border border-gray-800 rounded-xl p-6 flex flex-col md:flex-row justify-between items-center">
                    <div>
                      <h3 className="text-xl font-bold text-white mb-1">{booking.service?.name}</h3>
                      <p className="text-gray-400 text-sm mb-2">Customer: <span className="text-white">{booking.customer?.name}</span></p>
                      <div className="flex items-center text-gray-500 text-sm">
                        <Clock className="w-4 h-4 mr-1" />
                        {new Date(booking.scheduledDate).toLocaleString()}
                      </div>
                    </div>

                    <div className="flex items-center space-x-4 mt-4 md:mt-0">
                      <StatusBadge status={booking.status} />

                      {booking.status === "pending" && (
                        <>
                          <button onClick={() => updateStatus(booking._id, "accepted")} className="bg-green-600/20 text-green-500 p-2 rounded-full hover:bg-green-600 hover:text-white transition" title="Accept">
                            <Check size={20} />
                          </button>
                          <button onClick={() => updateStatus(booking._id, "rejected")} className="bg-red-600/20 text-red-500 p-2 rounded-full hover:bg-red-600 hover:text-white transition" title="Reject">
                            <X size={20} />
                          </button>
                        </>
                      )}
                      
                      {booking.status === "accepted" && (
                        <button onClick={() => updateStatus(booking._id, "completed")} className="bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-bold hover:bg-blue-700 transition">
                          Mark Complete
                        </button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">No booking requests yet.</p>
            )}
          </div>
        )}

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">My Services</h2>
              <button onClick={() => { setEditingService(null); setServiceForm({ name: "", description: "", price: "", duration: "", category: "", startTime: "09:00", endTime: "17:00", image: null }); setShowServiceModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Add Service
              </button>
            </div>

            {loadingServices ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : myServices.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {myServices.map(service => (
                  <div key={service._id} className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                    <img src={service.image || "https://via.placeholder.com/300"} alt={service.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{service.name}</h3>
                        <div className="flex space-x-2">
                          <button onClick={() => handleEditService(service)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition">
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button onClick={() => handleDeleteService(service._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                      <p className="text-gray-400 text-sm mt-1 line-clamp-2">{service.description}</p>
                      <div className="flex justify-between items-center mt-4">
                        <span className="text-blue-500 font-bold">${service.price}</span>
                        <span className="text-gray-500 text-xs">{service.duration} mins</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">
                        Category: {service.category?.name || "Unknown"} <br/>
                        Hours: {service.startTime} - {service.endTime}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <p className="text-gray-500">You haven't added any services yet.</p>
            )}
          </div>
        )}

        {/* Service Modal */}
        {showServiceModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowServiceModal(false)}></div>
            <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-lg relative z-10 p-6 max-h-[90vh] overflow-y-auto">
              <h2 className="text-2xl font-bold text-white mb-6">{editingService ? "Edit Service" : "Add New Service"}</h2>
              
              <form onSubmit={handleSaveService} className="space-y-4">
                {/* 1. Name */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Service Name</label>
                  <input type="text" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={serviceForm.name} onChange={(e) => setServiceForm({...serviceForm, name: e.target.value})} required />
                </div>
                
                {/* 2. Category */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Category</label>
                  <select className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={serviceForm.category} onChange={(e) => setServiceForm({...serviceForm, category: e.target.value})} required>
                    <option value="">Select Category</option>
                    {categories.map(cat => (
                      <option key={cat._id} value={cat._id}>{cat.name}</option>
                    ))}
                  </select>
                </div>

                {/* 3. Start Time & End Time */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Start Time</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                        <input type="time" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-blue-500 outline-none" value={serviceForm.startTime} onChange={(e) => setServiceForm({...serviceForm, startTime: e.target.value})} required />
                    </div>
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">End Time</label>
                    <div className="relative">
                        <Clock className="absolute left-3 top-3 text-gray-500 w-5 h-5"/>
                        <input type="time" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 pl-10 text-white focus:border-blue-500 outline-none" value={serviceForm.endTime} onChange={(e) => setServiceForm({...serviceForm, endTime: e.target.value})} required />
                    </div>
                  </div>
                </div>

                {/* 4. Price & Duration */}
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Price ($)</label>
                    <input type="number" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={serviceForm.price} onChange={(e) => setServiceForm({...serviceForm, price: e.target.value})} required />
                  </div>
                  <div>
                    <label className="block text-gray-400 text-sm mb-1">Duration (mins)</label>
                    <input type="number" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={serviceForm.duration} onChange={(e) => setServiceForm({...serviceForm, duration: e.target.value})} required />
                  </div>
                </div>

                {/* 5. Description */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Description</label>
                  <textarea className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={serviceForm.description} onChange={(e) => setServiceForm({...serviceForm, description: e.target.value})} required />
                </div>

                {/* 6. Image */}
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Service Image</label>
                  <div className="border border-gray-700 border-dashed rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition relative group">
                    <input type="file" accept="image/*" className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const webp = await convertToWebp(file);
                          setServiceForm({ ...serviceForm, image: webp });
                        } catch {
                          setServiceForm({ ...serviceForm, image: file });
                        }
                      }}
                    />
                    {serviceForm.image ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(serviceForm.image)}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Click to change</span>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-green-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> {serviceForm.image.name}
                        </div>
                      </div>
                    ) : editingService?.image ? (
                      <div className="relative">
                        <img
                          src={editingService.image}
                          alt="Current"
                          className="w-full h-40 object-cover opacity-70"
                        />
                        <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Click to change image</span>
                        </div>
                      </div>
                    ) : (
                      <div className="p-8 text-gray-500 flex flex-col items-center gap-2">
                        <ImageIcon className="w-10 h-10 opacity-40" />
                        <span className="text-sm">Click to upload image</span>
                      </div>
                    )}
                  </div>
                </div>

                <div className="flex justify-end space-x-3 mt-6">
                  <button type="button" onClick={() => setShowServiceModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={savingService} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
                    {savingService ? <Loader className="animate-spin" /> : editingService ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors border-b-2 ${active ? "text-blue-500 border-blue-500" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
    {icon}
    <span>{label}</span>
  </button>
);

const StatusBadge = ({ status }) => (
  <span className={`px-3 py-1 rounded-full text-xs font-bold border 
    ${status === 'pending' ? 'text-yellow-500 border-yellow-500' : ''}
    ${status === 'accepted' ? 'text-blue-500 border-blue-500' : ''}
    ${status === 'completed' ? 'text-green-500 border-green-500' : ''}
    ${status === 'rejected' ? 'text-red-500 border-red-500' : ''}
  `}>
    {status.toUpperCase()}
  </span>
);

export default ProviderDashboard;

import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, FolderTree, Plus, Edit2, Trash2, X, Check, Loader, Image as ImageIcon, ChevronRight, MapPin, Phone, Mail, Wallet } from "lucide-react";
import { toast } from "react-hot-toast";
import { convertToWebp } from "../../utils/convertToWebp";

const AdminDashboard = () => {
  const [activeTab, setActiveTab] = useState("stats");
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  // Categories State
  const [categories, setCategories] = useState([]);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [categoryForm, setCategoryForm] = useState({ name: "", description: "", image: null });
  const [savingCategory, setSavingCategory] = useState(false);

  // Bookings State
  const [allBookings, setAllBookings] = useState([]);
  const [loadingBookings, setLoadingBookings] = useState(false);

  // Providers State
  const [allProviders, setAllProviders] = useState([]);
  const [loadingProviders, setLoadingProviders] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState(null); // provider object
  const [providerServices, setProviderServices] = useState([]);
  const [loadingProviderServices, setLoadingProviderServices] = useState(false);

  // Locations State
  const [locations, setLocations] = useState([]);
  const [newLocationName, setNewLocationName] = useState("");
  const [addingLocation, setAddingLocation] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "bookings") fetchAllBookings();
    if (activeTab === "providers") fetchAllProviders();
    if (activeTab === "locations") fetchLocations();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch {
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch {
      toast.error("Failed to load categories");
    }
  };

  const fetchLocations = async () => {
    try {
      const { data } = await api.get("/locations");
      setLocations(data);
    } catch {
      toast.error("Failed to load locations");
    }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await api.get("/bookings");
      setAllBookings(data);
    } catch {
      toast.error("Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchAllProviders = async () => {
    setLoadingProviders(true);
    try {
      const { data } = await api.get("/admin/providers");
      setAllProviders(data);
    } catch {
      toast.error("Failed to load providers");
    } finally {
      setLoadingProviders(false);
    }
  };

  const fetchProviderServices = async (providerId) => {
    setLoadingProviderServices(true);
    try {
      const { data } = await api.get(`/services?provider=${providerId}`);
      setProviderServices(data);
    } catch {
      toast.error("Failed to load provider services");
    } finally {
      setLoadingProviderServices(false);
    }
  };

  const handleSaveCategory = async (e) => {
    e.preventDefault();
    setSavingCategory(true);
    try {
      const formData = new FormData();
      formData.append("name", categoryForm.name);
      formData.append("description", categoryForm.description);
      if (categoryForm.image) {
        formData.append("image", categoryForm.image);
      }

      if (editingCategory) {
        await api.put(`/categories/${editingCategory._id}`, formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category updated!");
      } else {
        await api.post("/categories", formData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Category created!");
      }
      setShowCategoryModal(false);
      setCategoryForm({ name: "", description: "", image: null });
      setEditingCategory(null);
      fetchCategories();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to save category");
    } finally {
      setSavingCategory(false);
    }
  };

  const handleDeleteCategory = async (id) => {
    if (!confirm("Are you sure you want to delete this category?")) return;
    try {
      await api.delete(`/categories/${id}`);
      toast.success("Category deleted!");
      fetchCategories();
    } catch {
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || "", image: null });
    setShowCategoryModal(true);
  };

  const handleAddLocation = async (e) => {
    e.preventDefault();
    if (!newLocationName.trim()) return;
    setAddingLocation(true);
    try {
      await api.post("/locations", { name: newLocationName });
      toast.success("Location added!");
      setNewLocationName("");
      fetchLocations();
    } catch (error) {
      toast.error(error.response?.data?.message || "Failed to add location");
    } finally {
      setAddingLocation(false);
    }
  };

  const handleToggleLocation = async (id) => {
    try {
      await api.patch(`/locations/${id}/toggle`);
      toast.success("Location status updated!");
      fetchLocations();
    } catch {
      toast.error("Failed to update location");
    }
  };

  const handleDeleteLocation = async (id) => {
    if (!window.confirm("Are you sure you want to delete this location?")) return;
    try {
      await api.delete(`/locations/${id}`);
      toast.success("Location deleted!");
      fetchLocations();
    } catch {
      toast.error("Failed to delete location");
    }
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus}!`);
      fetchAllBookings();
    } catch {
      toast.error("Failed to update booking");
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-white text-center">Loading Admin Dashboard...</div>;
  if (!stats) return <div className="min-h-screen pt-24 text-red-500 text-center">Failed to load data. Are you an admin?</div>;

  return (
    <div className="flex h-screen bg-[#0a0a0a] overflow-hidden">
      
      {/* Sidebar */}
      <aside className="w-64 bg-[#111] border-r border-gray-800 flex flex-col hidden md:flex">
        <div className="p-6 border-b border-gray-800">
          <h1 className="text-2xl font-black text-white tracking-tight">Admin<span className="text-blue-500">Panel</span></h1>
        </div>
        
        <nav className="flex-1 p-4 space-y-2 overflow-y-auto">
          <p className="px-4 text-xs font-semibold text-gray-500 uppercase tracking-wider mb-2 mt-2">Menu</p>
          <button 
            onClick={() => setActiveTab("stats")} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "stats" ? "bg-blue-600/10 text-blue-500" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`}
          >
            <TrendingUp className="w-5 h-5" />
            <span>Overview</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("categories")} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "categories" ? "bg-blue-600/10 text-blue-500" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`}
          >
            <FolderTree className="w-5 h-5" />
            <span>Categories</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("bookings")} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "bookings" ? "bg-blue-600/10 text-blue-500" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`}
          >
            <Calendar className="w-5 h-5" />
            <span>All Bookings</span>
          </button>
          
          <button 
            onClick={() => setActiveTab("providers")} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "providers" ? "bg-blue-600/10 text-blue-500" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`}
          >
            <Users className="w-5 h-5" />
            <span>Service Providers</span>
          </button>

          <button 
            onClick={() => setActiveTab("locations")} 
            className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl font-medium transition-all ${activeTab === "locations" ? "bg-blue-600/10 text-blue-500" : "text-gray-400 hover:bg-gray-800/50 hover:text-gray-200"}`}
          >
            <MapPin className="w-5 h-5" />
            <span>Areas</span>
          </button>
        </nav>
      </aside>

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto relative">
        <div className="p-8 max-w-7xl mx-auto">

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<Users className="text-blue-500" />} label="Total Users" value={stats.totalUsers} subValue={`${stats.totalProviders} Providers • ${stats.totalCustomers} Customers`} />
              <StatCard icon={<Briefcase className="text-purple-500" />} label="Total Services" value={stats.totalServices} />
              <StatCard icon={<Calendar className="text-yellow-500" />} label="Total Bookings" value={stats.totalBookings} />
              <StatCard icon={<DollarSign className="text-green-500" />} label="Total Revenue" value={`₹${stats.totalRevenue}`} />
            </div>

            <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
              <div className="p-6 border-b border-gray-800">
                <h3 className="text-xl font-bold text-white flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2 text-blue-500" /> Recent Activity
                </h3>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left text-gray-400">
                  <thead className="bg-gray-900/50 text-gray-500 uppercase text-xs font-bold">
                    <tr>
                      <th className="px-6 py-4">Service</th>
                      <th className="px-6 py-4">Customer</th>
                      <th className="px-6 py-4">Status</th>
                      <th className="px-6 py-4">Date</th>
                      <th className="px-6 py-4">Amount</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-800">
                    {stats.recentBookings.map((booking) => (
                      <tr key={booking._id} className="hover:bg-gray-900/30 transition-colors">
                        <td className="px-6 py-4 font-medium text-white">{booking.service?.name || "Unknown Service"}</td>
                        <td className="px-6 py-4">{booking.customer?.name || "Guest"}</td>
                        <td className="px-6 py-4">
                          <StatusBadge status={booking.status} />
                        </td>
                        <td className="px-6 py-4 text-sm">{new Date(booking.createdAt).toLocaleDateString()}</td>
                        <td className="px-6 py-4 text-white font-bold">${booking.price}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {stats.recentBookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings yet.</div>}
            </div>
          </>
        )}

        {/* Categories Tab */}
        {activeTab === "categories" && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-white">Manage Categories</h2>
              <button onClick={() => { setEditingCategory(null); setCategoryForm({ name: "", description: "", image: null }); setShowCategoryModal(true); }} className="bg-blue-600 text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
                <Plus className="w-5 h-5 mr-2" /> Add Category
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {categories.map(category => (
                <div key={category._id} className="bg-[#111] border border-gray-800 rounded-xl p-6">
                  <div className="flex justify-between items-start mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-white">{category.name}</h3>
                      <p className="text-gray-400 text-sm mt-1">{category.description || "No description"}</p>
                    </div>
                    <div className="flex space-x-2">
                      <button onClick={() => handleEditCategory(category)} className="p-2 text-blue-500 hover:bg-blue-500/10 rounded-lg transition">
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button onClick={() => handleDeleteCategory(category._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition">
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                  {category.image && <img src={category.image} alt={category.name} className="w-full h-32 object-cover rounded-lg" />}
                </div>
              ))}
            </div>

            {categories.length === 0 && <div className="text-center text-gray-500 py-12">No categories yet. Create one to get started!</div>}
          </div>
        )}

        {/* Bookings Tab */}
        {activeTab === "bookings" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Bookings</h2>
            {loadingBookings ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <div className="bg-[#111] border border-gray-800 rounded-2xl overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left text-gray-400">
                    <thead className="bg-gray-900/50 text-gray-500 uppercase text-xs font-bold">
                      <tr>
                        <th className="px-6 py-4">Service</th>
                        <th className="px-6 py-4">Customer</th>
                        <th className="px-6 py-4">Provider</th>
                        <th className="px-6 py-4">Status</th>
                        <th className="px-6 py-4">Date</th>
                        <th className="px-6 py-4">Amount</th>
                        <th className="px-6 py-4">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-800">
                      {allBookings.map((booking) => (
                        <tr key={booking._id} className="hover:bg-gray-900/30 transition-colors">
                          <td className="px-6 py-4 font-medium text-white">{booking.service?.name || "Unknown"}</td>
                          <td className="px-6 py-4">{booking.customer?.name || "Unknown"}</td>
                          <td className="px-6 py-4">{booking.provider?.name || "Unknown"}</td>
                          <td className="px-6 py-4">
                            <StatusBadge status={booking.status} />
                          </td>
                          <td className="px-6 py-4 text-sm">{new Date(booking.scheduledDate).toLocaleDateString()}</td>
                          <td className="px-6 py-4 text-white font-bold">${booking.price}</td>
                          <td className="px-6 py-4">
                            <select value={booking.status} onChange={(e) => handleUpdateBookingStatus(booking._id, e.target.value)} className="bg-gray-900 border border-gray-700 text-white text-sm rounded-lg px-2 py-1">
                              <option value="pending">Pending</option>
                              <option value="accepted">Accepted</option>
                              <option value="completed">Completed</option>
                              <option value="rejected">Rejected</option>
                              <option value="cancelled">Cancelled</option>
                            </select>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
                {allBookings.length === 0 && <div className="p-8 text-center text-gray-500">No bookings found.</div>}
              </div>
            )}
          </div>
        )}

        {/* Providers Tab */}
        {activeTab === "providers" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Service Providers</h2>
            {loadingProviders ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[1,2,3,4,5,6].map(i => <div key={i} className="bg-[#111] h-36 rounded-2xl animate-pulse border border-white/5" />)}
              </div>
            ) : allProviders.length === 0 ? (
              <div className="text-center text-gray-500 py-16">No service providers registered yet.</div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {allProviders.map(provider => (
                  <button
                    key={provider._id}
                    onClick={() => {
                      setSelectedProvider(provider);
                      fetchProviderServices(provider._id);
                    }}
                    className="relative bg-[#111] border border-gray-800 hover:border-blue-500/50 rounded-2xl p-5 text-left transition-all duration-200 hover:shadow-lg hover:shadow-blue-500/5 group"
                  >
                    <div className="flex items-center gap-4 mb-3">
                      <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                        {provider.name?.charAt(0).toUpperCase()}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="text-white font-bold text-lg truncate group-hover:text-blue-400 transition-colors">{provider.name}</h3>
                        <p className="text-gray-500 text-xs truncate">{provider.email}</p>
                      </div>
                      <ChevronRight className="w-5 h-5 text-gray-600 group-hover:text-blue-400 group-hover:translate-x-0.5 transition-all" />
                    </div>
                    {/* Wallet badge */}
                    <div className="flex items-center gap-1.5 bg-green-600/10 border border-green-500/20 rounded-xl px-3 py-2 mb-3">
                      <Wallet className="w-4 h-4 text-green-400 flex-shrink-0" />
                      <span className="text-xs text-green-300 font-medium">Wallet</span>
                      <span className="ml-auto text-green-400 font-bold text-sm">₹{provider.walletBalance?.toLocaleString('en-IN') ?? '0'}</span>
                    </div>
                    <div className="flex flex-wrap gap-3 text-xs text-gray-500">
                      {(provider.city || provider.area) && (
                        <span className="flex items-center gap-1">
                          <MapPin className="w-3 h-3" /> {provider.area || provider.city}
                        </span>
                      )}
                      {provider.phone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3" /> {provider.phone}
                        </span>
                      )}
                      <span className="ml-auto bg-blue-600/20 text-blue-400 border border-blue-500/20 px-2 py-0.5 rounded-full font-medium">
                        {provider.serviceCount} service{provider.serviceCount !== 1 ? 's' : ''}
                      </span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Locations Tab */}
        {activeTab === "locations" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">Manage Areas (Raipur)</h2>
            <div className="bg-[#111] border border-gray-800 rounded-2xl p-6 mb-8 max-w-xl shadow-lg shadow-black/50">
              <form onSubmit={handleAddLocation} className="flex gap-4">
                <input
                  type="text"
                  placeholder="Enter new area..."
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="flex-1 bg-[#0a0a0a] border border-gray-700 rounded-xl px-4 py-3 text-white focus:border-blue-500 outline-none transition-colors"
                  required
                />
                <button
                  type="submit"
                  disabled={addingLocation}
                  className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-xl transition-colors disabled:opacity-50 flex items-center gap-2"
                >
                  <Plus className="w-5 h-5" /> Add
                </button>
              </form>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div key={loc._id} className="bg-[#111] border border-gray-800 rounded-xl p-5 flex items-center justify-between hover:border-gray-700 transition-colors">
                  <div className="flex items-center gap-3">
                    <MapPin className={`w-5 h-5 ${loc.isActive ? 'text-blue-500' : 'text-gray-600'}`} />
                    <span className={`font-bold ${loc.isActive ? 'text-white' : 'text-gray-500 line-through'}`}>{loc.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => handleToggleLocation(loc._id)}
                      className={`text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors ${loc.isActive ? 'bg-red-500/10 text-red-400 border-red-500/20 hover:bg-red-500/20' : 'bg-green-500/10 text-green-400 border-green-500/20 hover:bg-green-500/20'}`}
                    >
                      {loc.isActive ? 'Disable' : 'Enable'}
                    </button>
                    <button onClick={() => handleDeleteLocation(loc._id)} className="p-1.5 text-gray-500 hover:bg-red-500/10 hover:text-red-500 rounded-lg transition">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            {locations.length === 0 && <div className="text-gray-500 text-center py-12">No areas added yet. Add one above!</div>}
          </div>
        )}

        {/* Provider Services Slide-in Panel */}
        {selectedProvider && (
          <div className="fixed inset-0 z-50 flex">
            {/* Backdrop */}
            <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={() => setSelectedProvider(null)} />
            {/* Panel */}
            <div className="relative ml-auto w-full max-w-xl bg-[#0e0e0e] border-l border-gray-800 h-full overflow-y-auto z-10 flex flex-col">
              {/* Panel Header */}
              <div className="sticky top-0 bg-[#0e0e0e] border-b border-gray-800 p-6 flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg flex-shrink-0">
                  {selectedProvider.name?.charAt(0).toUpperCase()}
                </div>
                <div className="flex-1">
                  <h2 className="text-xl font-bold text-white">{selectedProvider.name}</h2>
                  <div className="flex flex-wrap gap-3 mt-1 text-xs text-gray-500">
                    <span className="flex items-center gap-1"><Mail className="w-3 h-3" />{selectedProvider.email}</span>
                    {selectedProvider.phone && <span className="flex items-center gap-1"><Phone className="w-3 h-3" />{selectedProvider.phone}</span>}
                    {(selectedProvider.city || selectedProvider.area) && <span className="flex items-center gap-1"><MapPin className="w-3 h-3" />{selectedProvider.area || selectedProvider.city}</span>}
                  </div>
                </div>
                <button onClick={() => setSelectedProvider(null)} className="p-2 rounded-lg text-gray-500 hover:text-white hover:bg-white/5 transition">
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Services List */}
              <div className="p-6 flex-1">
                <h3 className="text-gray-400 text-sm font-semibold uppercase tracking-wider mb-4">
                  Services ({providerServices.length})
                </h3>
                {loadingProviderServices ? (
                  <div className="space-y-4">
                    {[1,2,3].map(i => <div key={i} className="bg-[#111] h-28 rounded-xl animate-pulse border border-white/5" />)}
                  </div>
                ) : providerServices.length === 0 ? (
                  <div className="text-center py-16 text-gray-600">
                    <Briefcase className="w-10 h-10 mx-auto mb-3 opacity-30" />
                    <p>This provider has no services yet.</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {providerServices.map(service => (
                      <div key={service._id} className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden flex items-stretch">
                        {service.image ? (
                          <img src={service.image} alt={service.name} className="w-24 h-24 object-cover flex-shrink-0 self-center m-3 rounded-lg" />
                        ) : (
                          <div className="w-24 h-24 bg-gray-900 flex items-center justify-center flex-shrink-0 self-center m-3 rounded-lg">
                            <Briefcase className="w-8 h-8 text-gray-700" />
                          </div>
                        )}
                        <div className="py-3 pr-4 flex-1 min-w-0">
                          <div className="flex justify-between items-start mb-1 gap-2">
                            <h4 className="text-white font-bold text-sm leading-tight">{service.name}</h4>
                            <span className="text-blue-400 font-bold text-sm whitespace-nowrap">₹{service.price}</span>
                          </div>
                          <p className="text-gray-500 text-xs mb-2 line-clamp-2 leading-relaxed">{service.description}</p>
                          <div className="flex flex-wrap gap-1.5 text-xs">
                            <span className="bg-gray-800 text-gray-400 px-2 py-0.5 rounded-md">{service.duration} min</span>
                            {service.category?.name && <span className="bg-blue-600/10 text-blue-400 px-2 py-0.5 rounded-md">{service.category.name}</span>}
                            <span className={`px-2 py-0.5 rounded-md ${
                              service.availability !== false ? 'bg-green-600/10 text-green-400' : 'bg-red-600/10 text-red-400'
                            }`}>
                              {service.availability !== false ? 'Available' : 'Unavailable'}
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Category Modal */}
        {showCategoryModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-black/80 backdrop-blur-sm" onClick={() => setShowCategoryModal(false)}></div>
            <div className="bg-[#111] border border-gray-800 rounded-2xl w-full max-w-md relative z-10 p-6">
              <h2 className="text-2xl font-bold text-white mb-6">{editingCategory ? "Edit Category" : "Add Category"}</h2>
              <form onSubmit={handleSaveCategory} className="space-y-4">
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Name</label>
                  <input type="text" className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={categoryForm.name} onChange={(e) => setCategoryForm({ ...categoryForm, name: e.target.value })} required />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Description</label>
                  <textarea className="w-full bg-[#0a0a0a] border border-gray-700 rounded-lg p-3 text-white focus:border-blue-500 outline-none" value={categoryForm.description} onChange={(e) => setCategoryForm({ ...categoryForm, description: e.target.value })} />
                </div>
                <div>
                  <label className="block text-gray-400 text-sm mb-1">Category Image</label>
                  <div className="border border-gray-700 border-dashed rounded-xl overflow-hidden cursor-pointer hover:border-blue-500 transition relative group">
                    <input
                      type="file"
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer z-10"
                      onChange={async (e) => {
                        const file = e.target.files[0];
                        if (!file) return;
                        try {
                          const webp = await convertToWebp(file);
                          setCategoryForm({ ...categoryForm, image: webp });
                        } catch {
                          setCategoryForm({ ...categoryForm, image: file });
                        }
                      }}
                    />
                    {categoryForm.image ? (
                      <div className="relative">
                        <img
                          src={URL.createObjectURL(categoryForm.image)}
                          alt="Preview"
                          className="w-full h-40 object-cover"
                        />
                        <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center">
                          <span className="text-white text-sm font-medium">Click to change</span>
                        </div>
                        <div className="absolute bottom-2 left-2 bg-black/60 text-green-400 text-xs px-2 py-1 rounded-md flex items-center gap-1">
                          <Check className="w-3 h-3" /> {categoryForm.image.name}
                        </div>
                      </div>
                    ) : editingCategory?.image ? (
                      <div className="relative">
                        <img
                          src={editingCategory.image}
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
                  <button type="button" onClick={() => setShowCategoryModal(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
                  <button type="submit" disabled={savingCategory} className="bg-blue-600 text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition flex items-center">
                    {savingCategory ? <Loader className="animate-spin" /> : editingCategory ? "Update" : "Create"}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}
        
        </div>
      </main>
    </div>
  );
};

const StatCard = ({ icon, label, value, subValue }) => (
  <div className="bg-[#111] p-6 rounded-2xl border border-gray-800 hover:border-gray-700 transition-all">
    <div className="flex items-center justify-between mb-4">
      <div className="p-3 bg-gray-900 rounded-xl">{icon}</div>
    </div>
    <div className="text-3xl font-bold text-white mb-1">{value}</div>
    <div className="text-gray-500 text-sm font-medium">{label}</div>
    {subValue && <div className="text-gray-600 text-xs mt-2">{subValue}</div>}
  </div>
);

const StatusBadge = ({ status }) => (
  <span className={`px-2 py-1 rounded-full text-xs font-bold border 
    ${status === 'completed' ? 'text-green-500 border-green-500/20 bg-green-500/10' : ''}
    ${status === 'pending' ? 'text-yellow-500 border-yellow-500/20 bg-yellow-500/10' : ''}
    ${status === 'accepted' ? 'text-blue-500 border-blue-500/20 bg-blue-500/10' : ''}
    ${status === 'cancelled' || status === 'rejected' ? 'text-red-500 border-red-500/20 bg-red-500/10' : ''}
  `}>
    {status.toUpperCase()}
  </span>
);

export default AdminDashboard;

import { useState, useEffect } from "react";
import api from "../../api/axios";
import { Users, Briefcase, Calendar, DollarSign, TrendingUp, FolderTree, Plus, Edit2, Trash2, X, Check, Loader, Image as ImageIcon } from "lucide-react";
import { toast } from "react-hot-toast";

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

  // Services State
  const [allServices, setAllServices] = useState([]);
  const [loadingServices, setLoadingServices] = useState(false);

  useEffect(() => {
    fetchStats();
  }, []);

  useEffect(() => {
    if (activeTab === "categories") fetchCategories();
    if (activeTab === "bookings") fetchAllBookings();
    if (activeTab === "services") fetchAllServices();
  }, [activeTab]);

  const fetchStats = async () => {
    try {
      const { data } = await api.get("/admin/stats");
      setStats(data);
    } catch (error) {
      console.error("Failed to fetch admin stats", error);
      toast.error("Failed to load stats");
    } finally {
      setLoading(false);
    }
  };

  const fetchCategories = async () => {
    try {
      const { data } = await api.get("/categories");
      setCategories(data);
    } catch (error) {
      toast.error("Failed to load categories");
    }
  };

  const fetchAllBookings = async () => {
    setLoadingBookings(true);
    try {
      const { data } = await api.get("/bookings");
      setAllBookings(data);
    } catch (error) {
      toast.error("Failed to load bookings");
    } finally {
      setLoadingBookings(false);
    }
  };

  const fetchAllServices = async () => {
    setLoadingServices(true);
    try {
      const { data } = await api.get("/services");
      setAllServices(data);
    } catch (error) {
      toast.error("Failed to load services");
    } finally {
      setLoadingServices(false);
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
    } catch (error) {
      toast.error("Failed to delete category");
    }
  };

  const handleEditCategory = (category) => {
    setEditingCategory(category);
    setCategoryForm({ name: category.name, description: category.description || "", image: null });
    setShowCategoryModal(true);
  };

  const handleUpdateBookingStatus = async (bookingId, newStatus) => {
    try {
      await api.put(`/bookings/${bookingId}/status`, { status: newStatus });
      toast.success(`Booking ${newStatus}!`);
      fetchAllBookings();
    } catch (error) {
      toast.error("Failed to update booking");
    }
  };

  const handleDeleteService = async (serviceId) => {
    if (!confirm("Are you sure you want to delete this service?")) return;
    try {
      await api.delete(`/services/${serviceId}`);
      toast.success("Service deleted!");
      fetchAllServices();
    } catch (error) {
      toast.error("Failed to delete service");
    }
  };

  if (loading) return <div className="min-h-screen pt-24 text-white text-center">Loading Admin Dashboard...</div>;
  if (!stats) return <div className="min-h-screen pt-24 text-red-500 text-center">Failed to load data. Are you an admin?</div>;

  return (
    <div className="min-h-screen pt-24 pb-12">
      <div className="container mx-auto px-4">
        <h1 className="text-3xl font-bold text-white mb-8">Admin Dashboard</h1>

        {/* Tabs */}
        <div className="flex space-x-2 mb-8 border-b border-gray-800">
          <TabButton active={activeTab === "stats"} onClick={() => setActiveTab("stats")} icon={<TrendingUp className="w-4 h-4" />} label="Overview" />
          <TabButton active={activeTab === "categories"} onClick={() => setActiveTab("categories")} icon={<FolderTree className="w-4 h-4" />} label="Categories" />
          <TabButton active={activeTab === "bookings"} onClick={() => setActiveTab("bookings")} icon={<Calendar className="w-4 h-4" />} label="All Bookings" />
          <TabButton active={activeTab === "services"} onClick={() => setActiveTab("services")} icon={<Briefcase className="w-4 h-4" />} label="All Services" />
        </div>

        {/* Stats Tab */}
        {activeTab === "stats" && (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
              <StatCard icon={<Users className="text-blue-500" />} label="Total Users" value={stats.totalUsers} subValue={`${stats.totalProviders} Providers • ${stats.totalCustomers} Customers`} />
              <StatCard icon={<Briefcase className="text-purple-500" />} label="Total Services" value={stats.totalServices} />
              <StatCard icon={<Calendar className="text-yellow-500" />} label="Total Bookings" value={stats.totalBookings} />
              <StatCard icon={<DollarSign className="text-green-500" />} label="Total Revenue" value={`$${stats.totalRevenue}`} />
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

        {/* Services Tab */}
        {activeTab === "services" && (
          <div>
            <h2 className="text-2xl font-bold text-white mb-6">All Services</h2>
            {loadingServices ? (
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {allServices.map(service => (
                  <div key={service._id} className="bg-[#111] border border-gray-800 rounded-xl overflow-hidden">
                    <img src={service.image || "https://via.placeholder.com/300"} alt={service.name} className="w-full h-48 object-cover" />
                    <div className="p-4">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-white">{service.name}</h3>
                        <button onClick={() => handleDeleteService(service._id)} className="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition">
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                      <p className="text-gray-400 text-sm mb-3 line-clamp-2">{service.description}</p>
                      <div className="flex justify-between items-center">
                        <span className="text-blue-500 font-bold">${service.price}</span>
                        <span className="text-gray-500 text-xs">{service.duration} mins</span>
                      </div>
                      <div className="mt-2 text-xs text-gray-600">Provider: {service.provider?.name || "Unknown"}</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
            {allServices.length === 0 && <div className="text-center text-gray-500 py-12">No services available.</div>}
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
                  <div className="border border-gray-700 border-dashed rounded-lg p-6 text-center cursor-pointer hover:border-blue-500 transition relative">
                    <input 
                      type="file" 
                      accept="image/*"
                      className="absolute inset-0 opacity-0 cursor-pointer"
                      onChange={(e) => setCategoryForm({ ...categoryForm, image: e.target.files[0] })}
                    />
                    {categoryForm.image ? (
                      <div className="text-green-500 flex items-center justify-center">
                        <Check className="mr-2" /> {categoryForm.image.name}
                      </div>
                    ) : editingCategory?.image ? (
                      <div className="text-blue-500 flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span>Current image set. Click to change.</span>
                      </div>
                    ) : (
                      <div className="text-gray-500 flex flex-col items-center">
                        <ImageIcon className="w-8 h-8 mb-2" />
                        <span>Click to upload image</span>
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
    </div>
  );
};

const TabButton = ({ active, onClick, icon, label }) => (
  <button onClick={onClick} className={`flex items-center space-x-2 px-4 py-3 font-medium transition-colors border-b-2 ${active ? "text-blue-500 border-blue-500" : "text-gray-500 border-transparent hover:text-gray-300"}`}>
    {icon}
    <span>{label}</span>
  </button>
);

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

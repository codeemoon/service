import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../api/axios";
import { ArrowLeft } from "lucide-react";
import { staticCategories } from "../utils/staticData";

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await api.get("/categories");
        setCategories([...staticCategories, ...data]);
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchCategories();
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-[#0a0a0a] pt-[80px] pb-16 px-4">
      <div className="container mx-auto max-w-6xl">
        <Link to="/" className="inline-flex items-center text-gray-500 hover:text-gray-900 dark:hover:text-white mb-6 transition-colors font-medium text-sm">
          <ArrowLeft className="w-4 h-4 mr-2" /> Back to Home
        </Link>
        
        <h1 className="text-3xl sm:text-4xl font-black text-gray-900 dark:text-white mb-8 tracking-tight uppercase">OUR categories</h1>

        {loading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="bg-gray-200 dark:bg-gray-800 rounded-3xl animate-pulse aspect-[4/3]" />
            ))}
          </div>
        ) : categories.length > 0 ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6">
            {categories.map((category) => (
              <Link
                key={category._id}
                to={`/services?category=${category._id}`}
                className="group flex flex-col w-full bg-white dark:bg-[#111] border border-gray-200 dark:border-gray-800 rounded-3xl overflow-hidden hover:border-blue-500/50 hover:shadow-lg hover:shadow-blue-500/5 transition-all duration-300"
              >
                <div className="relative w-full aspect-[4/3] overflow-hidden border-b border-gray-100 dark:border-gray-800">
                  {category.image ? (
                    <img
                      src={category.image}
                      alt={category.name}
                      className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  ) : (
                    <div className="absolute inset-0 bg-gray-50 dark:bg-[#0a0a0a] flex items-center justify-center transition-transform duration-700 group-hover:scale-105">
                      <span className="text-4xl opacity-50">🔧</span>
                    </div>
                  )}
                </div>
                
                {/* Content Below Image */}
                <div className="p-4 text-center bg-white dark:bg-[#111]">
                  <h3 className="text-sm sm:text-base font-bold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors truncate">
                    {category.name}
                  </h3>
                </div>
              </Link>
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white dark:bg-[#111] rounded-3xl border border-gray-200 dark:border-gray-800">
            <span className="text-6xl mb-4 block">🔍</span>
            <p className="text-xl text-gray-500 dark:text-gray-400 font-medium">No categories found.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default Categories;

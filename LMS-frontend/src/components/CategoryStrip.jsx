import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGuestCategories } from "../api/public";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function CategoryStrip() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        const data = await getGuestCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  const handleClick = (categoryId) => {
    navigate(`/categories/${categoryId}`);
  };

  return (
    <div className="bg-gradient-to-r from-slate-50 via-indigo-50 to-slate-50 border-b border-slate-200 shadow-sm">
      <div className="max-w-7xl mx-auto px-6 py-4">
        {loading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-indigo-600"></div>
            <span className="text-sm text-slate-500 font-medium">
              Loading categories...
            </span>
          </div>
        ) : categories.length === 0 ? (
          <div className="text-center py-2">
            <span className="text-sm text-slate-500">
              No categories available
            </span>
          </div>
        ) : (
          <div className="relative">
            {/* Gradient fade effects on sides */}
            <div className="absolute left-0 top-0 bottom-0 w-12 bg-gradient-to-r from-slate-50 to-transparent z-10 pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 bg-gradient-to-l from-slate-50 to-transparent z-10 pointer-events-none"></div>

            {/* Categories scroll container */}
            <div className="flex items-center justify-start gap-3 overflow-x-auto no-scrollbar pb-1">
              {categories.map((category) => {
                const imagePath = category.images?.[0]?.image_path;

                return (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleClick(category.id)}
                    className="group inline-flex items-center gap-2.5 px-5 py-2.5 rounded-2xl bg-white hover:bg-gradient-to-br hover:from-indigo-50 hover:to-purple-50 text-sm font-medium text-slate-700 hover:text-indigo-700 whitespace-nowrap transition-all duration-200 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow-md"
                  >
                    {imagePath ? (
                      <span className="w-8 h-8 rounded-full overflow-hidden bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center shadow-sm group-hover:shadow-md transition-shadow">
                        <img
                          src={`${IMAGE_BASE_URL}${imagePath}`}
                          alt={category.name}
                          className="w-full h-full object-cover"
                        />
                      </span>
                    ) : (
                      <span className="w-8 h-8 rounded-full bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center text-white text-xs font-bold shadow-sm group-hover:shadow-md transition-shadow">
                        {category.name?.charAt(0).toUpperCase() || "?"}
                      </span>
                    )}
                    <span className="group-hover:translate-x-0.5 transition-transform duration-200">
                      {category.name}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .no-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .no-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}

export default CategoryStrip;

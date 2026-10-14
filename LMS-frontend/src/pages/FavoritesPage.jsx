// src/pages/FavoritesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getFavoriteCourses } from "../api/favorites";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function FavoritesPage() {
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const data = await getFavoriteCourses();
        setFavorites(data);
      } catch (err) {
        console.error("Failed to load favorites:", err);
        const status = err.response?.status;

        if (status === 401) {
          navigate("/login", { state: { from: "/favorites" } });
        } else {
          setError("Failed to load favorites.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Loading favorites...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-6">
      <h1 className="text-2xl font-bold text-slate-900 mb-4">
        Favorite Courses
      </h1>

      {favorites.length === 0 ? (
        <p className="text-slate-500 text-sm">
          You don't have any favorite courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {favorites.map((fav) => {
            const c = fav.course;
            const img = c?.images?.[0]?.image_path;

            return (
              <div
                key={fav.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col"
              >
                {img && (
                  <img
                    src={`${IMAGE_BASE_URL}${img}`}
                    alt={c.name}
                    className="h-36 w-full object-cover"
                  />
                )}

                <div className="p-4 flex flex-col flex-1">
                  <h2 className="font-semibold text-slate-900 line-clamp-2 mb-1">
                    {c.name}
                  </h2>
                  {c.description && (
                    <p className="text-xs text-slate-500 line-clamp-2 mb-2">
                      {c.description}
                    </p>
                  )}

                  <div className="mt-auto flex items-center justify-between">
                    <span className="text-sm font-semibold text-slate-900">
                      {c.price} ₺
                    </span>
                    <button
                      type="button"
                      onClick={() => navigate(`/courses/${c.id}`)}
                      className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      View course
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default FavoritesPage;

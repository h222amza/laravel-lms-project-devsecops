// src/pages/MyCoursesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getMyCourses } from "../api/myCourses";
import {
  getFavoriteCourses,
  addFavoriteCourse,
  deleteFavoriteCourse,
} from "../api/favorites";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function MyCoursesPage() {
  const [myCourses, setMyCourses] = useState([]); // enrollments
  const [favoriteCourseIds, setFavoriteCourseIds] = useState([]); // [course_id]
  const [loading, setLoading] = useState(false);
  const [favLoading, setFavLoading] = useState(false);
  const [error, setError] = useState("");

  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [courses, favorites] = await Promise.all([
          getMyCourses(),
          getFavoriteCourses(),
        ]);

        setMyCourses(courses);

        // favorilerden course_id listesi çıkar
        const ids = favorites
          .map((fav) => fav.course_id ?? fav.course?.id)
          .filter(Boolean);
        setFavoriteCourseIds(ids);
      } catch (err) {
        console.error("Failed to load my courses:", err);
        const status = err.response?.status;

        if (status === 401) {
          navigate("/login", { state: { from: "/my-courses" } });
        } else {
          setError("Failed to load your courses.");
        }
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [navigate]);

  const handleToggleFavorite = async (courseId) => {
    try {
      setFavLoading(true);

      if (favoriteCourseIds.includes(courseId)) {
        // favoriden çıkar
        await deleteFavoriteCourse(courseId);
        setFavoriteCourseIds((prev) => prev.filter((id) => id !== courseId));
      } else {
        // favoriye ekle
        await addFavoriteCourse(courseId);
        setFavoriteCourseIds((prev) => [...prev, courseId]);
      }
    } catch (err) {
      console.error("Failed to toggle favorite:", err);
      alert("Failed to update favorite.");
    } finally {
      setFavLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p className="text-slate-600">Loading your courses...</p>
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
      <h1 className="text-2xl font-bold text-slate-900 mb-4">My Courses</h1>

      {myCourses.length === 0 ? (
        <p className="text-sm text-slate-500">
          You haven't purchased any courses yet.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {myCourses.map((enrollment) => {
            const c = enrollment.course;
            const img = c?.images?.[0]?.image_path;
            const isFav = favoriteCourseIds.includes(c.id);

            return (
              <div
                key={enrollment.id}
                className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden flex flex-col relative"
              >
                {/* Kalp butonu */}
                <button
                  type="button"
                  disabled={favLoading}
                  onClick={() => handleToggleFavorite(c.id)}
                  className="absolute top-2 right-2 z-10 w-8 h-8 rounded-full bg-white/90 flex items-center justify-center shadow-sm hover:scale-105 transition"
                >
                  <span className="text-lg">{isFav ? "❤️" : "🤍"}</span>
                </button>

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
                    <button
                      type="button"
                      onClick={() => navigate(`/my-courses/${c.id}`)}
                      className="text-xs px-3 py-1 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700"
                    >
                      Continue
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

export default MyCoursesPage;

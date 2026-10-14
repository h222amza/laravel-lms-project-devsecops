// src/pages/CoursesPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getGuestCourses } from "../api/public";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getGuestCourses();
        setCourses(data || []);
      } catch (err) {
        console.error("Failed to load courses:", err);
        setError("Failed to load courses.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;

  return (
    <div className="space-y-6">
      {/* Page title */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-slate-900">All Courses</h1>
          <p className="text-sm text-slate-500">
            All courses are loaded from the database.
          </p>
        </div>
        <p className="text-xs text-slate-500">
          Total: {courses.length} course{courses.length === 1 ? "" : "s"}
        </p>
      </div>

      {/* Course grid */}
      {courses.length === 0 ? (
        <p className="text-slate-600">No courses available yet.</p>
      ) : (
        <div className="grid gap-5 grid-cols-1 sm:grid-cols-2 md:grid-cols-3">
          {courses.map((course) => {
            const imagePath = course.images?.[0]?.image_path;
            const categoryName = course.category?.name;
            const adminName = course.admin
              ? `${course.admin.name} ${course.admin.lastName || ""}`
              : null;

            return (
              <div
                key={course.id}
                className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
              >
                {imagePath && (
                  <div className="h-32 w-full overflow-hidden">
                    <img
                      src={`${IMAGE_BASE_URL}${imagePath}`}
                      alt={course.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}

                <div className="p-4">
                  {/* Category tag */}
                  {categoryName && (
                    <p className="text-xs text-slate-500 mb-1">
                      {categoryName}
                    </p>
                  )}

                  <h3 className="font-semibold text-slate-900 mb-1">
                    {course.name}
                  </h3>

                  {course.description && (
                    <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                      {course.description}
                    </p>
                  )}

                  <div className="flex items-center justify-between mt-2">
                    {course.price && (
                      <p className="text-sm font-medium text-blue-600">
                        {course.price} ₺
                      </p>
                    )}
                    {adminName && (
                      <p className="text-[11px] text-slate-500">
                        by {adminName}
                      </p>
                    )}
                  </div>

                  {/* View details button (güzel stilli versiyon) */}
                  <button
                    type="button"
                    onClick={() => navigate(`/courses/${course.id}`)}
                    className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-blue-600 hover:text-blue-700 
                               px-3 py-1.5 bg-blue-50 hover:bg-blue-100 rounded-lg transition border border-blue-200"
                  >
                    View details
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-4 w-4"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M9 5l7 7-7 7"
                      />
                    </svg>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}

export default CoursesPage;

// src/pages/CategoryPage.jsx
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { getCategoryById } from "../api/public";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "") + "/";

function CategoryPage() {
  const { id } = useParams();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getCategoryById(id);
        setCategory(data);
      } catch (err) {
        console.error("Failed to load category:", err);
        setError("Failed to load category.");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  if (loading) return <p className="text-slate-600">Loading...</p>;
  if (error) return <p className="text-red-600">{error}</p>;
  if (!category) return <p className="text-slate-600">Category not found.</p>;

  const imagePath = category.images?.[0]?.image_path;
  const courses = category.courses || [];

  return (
    <div className="space-y-6">
      {/* Category header */}
      <section className="bg-white rounded-xl shadow-sm p-6 flex items-center gap-4">
        {imagePath && (
          <div className="w-16 h-16 rounded-lg overflow-hidden bg-slate-100">
            <img
              src={`${IMAGE_BASE_URL}${imagePath}`}
              alt={category.name}
              className="w-full h-full object-cover"
            />
          </div>
        )}
        <div>
          <h1 className="text-2xl font-bold text-slate-900">{category.name}</h1>
          <p className="text-sm text-slate-500">
            {courses.length} course{courses.length === 1 ? "" : "s"} in this
            category.
          </p>
        </div>
      </section>

      {/* Courses list for this category only */}
      <section>
        {courses.length === 0 ? (
          <p className="text-slate-600">No courses in this category yet.</p>
        ) : (
          <div className="grid gap-5 grid-cols-1 md:grid-cols-2">
            {courses.map((course) => {
              const courseImage = course.images?.[0]?.image_path;
              return (
                <div
                  key={course.id}
                  className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition"
                >
                  {courseImage && (
                    <div className="h-32 w-full overflow-hidden">
                      <img
                        src={`${IMAGE_BASE_URL}${courseImage}`}
                        alt={course.name}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  <div className="p-4">
                    <h3 className="font-semibold text-slate-900 mb-1">
                      {course.name}
                    </h3>
                    {course.description && (
                      <p className="text-sm text-slate-600 mb-2 line-clamp-2">
                        {course.description}
                      </p>
                    )}
                    <p className="text-sm font-medium text-blue-600">
                      {course.price} ₺
                    </p>
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
      </section>
    </div>
  );
}

export default CategoryPage;

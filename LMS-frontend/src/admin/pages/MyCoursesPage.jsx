// src/admin/pages/MyCoursesPage.jsx
import { useEffect, useState } from "react";
import { getMyAdminCourses, deleteAdminCourse } from "../../api/admin";
import { useNavigate } from "react-router-dom";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/"; // backend public path

export default function MyCoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getMyAdminCourses();
        setCourses(data || []);
      } catch (err) {
        console.error("LOAD MY COURSES ERROR:", err.response?.data || err);
        setError("Failed to load courses. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, []);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this course?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteAdminCourse(id);

      setCourses((prev) => prev.filter((c) => c.id !== id));
      setSuccess("Course deleted successfully.");
    } catch (err) {
      console.error("DELETE COURSE ERROR:", err.response?.data || err);
      setError("Failed to delete course. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (course) => {
    // Şimdilik sadece placeholder
    // İleride /admin/edit-course/:id sayfasına gidebiliriz.
    navigate(`/admin/edit-course/${course.id}`);
  };

  const handleManageLessons = (course) => {
    navigate(`/admin/lessons/${course.id}`);
    console.log("LESSON MANAGEMENT FOR COURSE:", course.id);
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">My Courses</h1>
      <p className="text-sm text-slate-600 mb-4">
        Manage your own courses: update details, delete, or manage lessons.
      </p>

      {/* Error / Success */}
      {error && (
        <div className="mb-4 rounded-lg bg-red-50 border border-red-200 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="mb-4 rounded-lg bg-emerald-50 border border-emerald-200 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Loading */}
      {loading ? (
        <p>Loading courses...</p>
      ) : courses.length === 0 ? (
        <p>No courses found.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Image</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Category</th>
                  <th className="py-2 pr-4">Price</th>
                  <th className="py-2 pr-4">Status</th>
                  <th className="py-2 pr-4">Description</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {courses.map((course) => {
                  const imagePath =
                    course.images && course.images.length > 0
                      ? IMAGE_BASE_URL + course.images[0].image_path
                      : null;

                  return (
                    <tr
                      key={course.id}
                      className="border-b last:border-0 align-top"
                    >
                      {/* Image */}
                      <td className="py-2 pr-4">
                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt={course.name}
                            className="w-16 h-16 rounded-md object-cover border"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">
                            No image
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-2 pr-4 font-medium">{course.name}</td>

                      {/* Category */}
                      <td className="py-2 pr-4">
                        {course.category?.name || "-"}
                      </td>

                      {/* Price */}
                      <td className="py-2 pr-4">${course.price}</td>

                      {/* Status */}
                      <td className="py-2 pr-4">
                        {course.is_approved ? (
                          <span className="inline-flex items-center rounded-full bg-emerald-50 px-2 py-0.5 text-xs font-medium text-emerald-700">
                            Approved
                          </span>
                        ) : (
                          <span className="inline-flex items-center rounded-full bg-amber-50 px-2 py-0.5 text-xs font-medium text-amber-700">
                            Pending
                          </span>
                        )}
                      </td>

                      {/* Description */}
                      <td className="py-2 pr-4 max-w-xs">
                        <p className="text-xs text-slate-700 line-clamp-3">
                          {course.description}
                        </p>
                      </td>

                      {/* Actions */}
                      <td className="py-2 pr-4">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(course)}
                            className="text-xs px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleManageLessons(course)}
                            className="text-xs px-3 py-1 rounded-lg border border-blue-300 text-blue-700 hover:bg-blue-50"
                          >
                            Lesson Management
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(course.id)}
                            disabled={deletingId === course.id}
                            className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {deletingId === course.id
                              ? "Deleting..."
                              : "Delete"}
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

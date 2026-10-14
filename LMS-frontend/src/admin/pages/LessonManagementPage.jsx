// src/admin/pages/LessonManagementPage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getLessonsByCourse, deleteLesson } from "../../api/admin";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

export default function LessonManagementPage() {
  const { courseId } = useParams();
  const navigate = useNavigate();

  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(false);
  const [deletingId, setDeletingId] = useState(null);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");
        const data = await getLessonsByCourse(courseId);
        setLessons(data || []);
      } catch (err) {
        console.error("LOAD LESSONS ERROR:", err.response?.data || err);
        setError("Failed to load lessons. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [courseId]);

  const handleDelete = async (id) => {
    const confirmed = window.confirm(
      "Are you sure you want to delete this lesson?"
    );
    if (!confirmed) return;

    try {
      setDeletingId(id);
      setError("");
      setSuccess("");

      await deleteLesson(id);

      setLessons((prev) => prev.filter((l) => l.id !== id));
      setSuccess("Lesson deleted successfully.");
    } catch (err) {
      console.error("DELETE LESSON ERROR:", err.response?.data || err);
      setError("Failed to delete lesson. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  const handleEdit = (lesson) => {
    // TODO: later we will implement /admin/edit-lesson/:id
    alert("Lesson edit is not implemented yet.");
    console.log("EDIT LESSON:", lesson);
  };

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <div>
          <h1 className="text-2xl font-semibold">Lesson Management</h1>
          <p className="text-sm text-slate-600">
            Manage lessons for this course (ID: {courseId}).
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate("/admin/my-courses")}
          className="text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
        >
          Back to My Courses
        </button>
      </div>

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

      {loading ? (
        <p>Loading lessons...</p>
      ) : lessons.length === 0 ? (
        <p>No lessons found for this course.</p>
      ) : (
        <div className="bg-white rounded-xl shadow-sm p-4">
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead className="border-b">
                <tr className="text-left text-xs uppercase text-slate-500">
                  <th className="py-2 pr-4">Image</th>
                  <th className="py-2 pr-4">Name</th>
                  <th className="py-2 pr-4">Sort Order</th>
                  <th className="py-2 pr-4">Items</th>
                  <th className="py-2 pr-4">Actions</th>
                </tr>
              </thead>
              <tbody>
                {lessons.map((lesson) => {
                  const imagePath =
                    lesson.images && lesson.images.length > 0
                      ? IMAGE_BASE_URL + lesson.images[0].image_path
                      : null;

                  const itemCount = lesson.items ? lesson.items.length : 0;

                  return (
                    <tr
                      key={lesson.id}
                      className="border-b last:border-0 align-top"
                    >
                      {/* Image */}
                      <td className="py-2 pr-4">
                        {imagePath ? (
                          <img
                            src={imagePath}
                            alt={lesson.name}
                            className="w-16 h-16 rounded-md object-cover border"
                          />
                        ) : (
                          <span className="text-xs text-slate-400">
                            No image
                          </span>
                        )}
                      </td>

                      {/* Name */}
                      <td className="py-2 pr-4 font-medium">{lesson.name}</td>

                      {/* Sort order */}
                      <td className="py-2 pr-4">{lesson.sort_order}</td>

                      {/* Items */}
                      <td className="py-2 pr-4">
                        <div className="text-xs text-slate-700">
                          <p>{itemCount} item(s)</p>
                          {itemCount > 0 && (
                            <p className="text-slate-400">
                              First: {lesson.items[0].type} (
                              {lesson.items[0].description?.slice(0, 30)}
                              {lesson.items[0].description?.length > 30
                                ? "..."
                                : ""}
                              )
                            </p>
                          )}
                        </div>
                      </td>

                      {/* Actions */}
                      <td className="py-2 pr-4">
                        <div className="flex flex-col gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(lesson)}
                            className="text-xs px-3 py-1 rounded-lg border border-slate-300 hover:bg-slate-100"
                          >
                            Edit
                          </button>

                          <button
                            type="button"
                            onClick={() => handleDelete(lesson.id)}
                            disabled={deletingId === lesson.id}
                            className="text-xs px-3 py-1 rounded-lg border border-red-300 text-red-700 hover:bg-red-50 disabled:opacity-60 disabled:cursor-not-allowed"
                          >
                            {deletingId === lesson.id
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

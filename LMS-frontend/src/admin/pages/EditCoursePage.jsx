// src/admin/pages/EditCoursePage.jsx
import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getAdminCourseById,
  updateAdminCourse,
  getAdminCategories,
} from "../../api/admin";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/";

export default function EditCoursePage() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [course, setCourse] = useState(null);

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [isApproved, setIsApproved] = useState(false);

  const [existingImage, setExistingImage] = useState(null);
  const [imageFile, setImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load course + categories
  useEffect(() => {
    async function load() {
      try {
        setLoading(true);
        setError("");

        const [courseData, categoriesData] = await Promise.all([
          getAdminCourseById(id),
          getAdminCategories(),
        ]);

        setCourse(courseData);
        setName(courseData.name || "");
        setDescription(courseData.description || "");
        setCategoryId(courseData.category_id?.toString() || "");
        setPrice(courseData.price || "");
        setIsApproved(!!courseData.is_approved);

        if (courseData.images && courseData.images.length > 0) {
          setExistingImage(IMAGE_BASE_URL + courseData.images[0].image_path);
        }

        setCategories(categoriesData || []);
      } catch (err) {
        console.error("LOAD COURSE ERROR:", err.response?.data || err);
        setError("Failed to load course. Please try again.");
      } finally {
        setLoading(false);
      }
    }

    load();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!course) return;

    setError("");
    setSuccess("");

    if (!name || !description || !categoryId || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    try {
      setSaving(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category_id", Number(categoryId));
      formData.append("price", price);
      formData.append("admin_id", course.admin_id); // backend required
      formData.append("is_approved", isApproved ? 1 : 0);

      if (imageFile) {
        formData.append("image", imageFile);
      }

      const result = await updateAdminCourse(id, formData);
      console.log("UPDATE COURSE RESPONSE:", result);

      setSuccess("Course updated successfully.");

      // İstersen course state'ini de güncelle
      setCourse(result.course || course);
    } catch (err) {
      console.error(
        "UPDATE COURSE ERROR RAW:",
        err.response?.status,
        err.response?.data
      );

      const apiMessage = err.response?.data?.message;
      const firstError =
        err.response?.data?.errors &&
        Object.values(err.response.data.errors)[0][0];

      setError(
        firstError ||
          apiMessage ||
          "Failed to update course. Please check your data and try again."
      );
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <p>Loading course...</p>;
  }

  if (!course) {
    return <p>Course not found.</p>;
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Edit Course</h1>
      <p className="text-sm text-slate-600 mb-6">
        Update the course details and save your changes.
      </p>

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

      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm p-6 max-w-xl space-y-4"
      >
        {/* Name */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Course Name<span className="text-red-500">*</span>
          </label>
          <input
            type="text"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter course name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        {/* Description */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Description<span className="text-red-500">*</span>
          </label>
          <textarea
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Describe the course"
            rows={4}
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Price (USD)<span className="text-red-500">*</span>
          </label>
          <input
            type="number"
            step="0.01"
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500"
            placeholder="Enter course price"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
          />
        </div>



        {/* Image */}
        <div>
          <label className="block text-sm font-medium mb-1">Course Image</label>

          {existingImage && !imageFile && (
            <div className="mb-2">
              <p className="text-xs text-slate-500 mb-1">Current image:</p>
              <img
                src={existingImage}
                alt={course.name}
                className="w-24 h-24 rounded-md object-cover border"
              />
            </div>
          )}

          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
          <p className="text-xs text-slate-500 mt-1">
            Leave empty if you do not want to change the image.
          </p>
        </div>

        <div className="pt-2 flex gap-3">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>

          <button
            type="button"
            onClick={() => navigate("/admin/my-courses")}
            className="text-sm px-4 py-2 rounded-lg border border-slate-300 hover:bg-slate-100"
          >
            Back to My Courses
          </button>
        </div>
      </form>
    </div>
  );
}

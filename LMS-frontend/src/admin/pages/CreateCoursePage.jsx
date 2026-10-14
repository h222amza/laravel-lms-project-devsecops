// src/admin/pages/CreateCoursePage.jsx
import { useEffect, useState } from "react";
import { getAdminCategories, createAdminCourse } from "../../api/admin";

export default function CreateCoursePage() {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [price, setPrice] = useState("");
  const [imageFile, setImageFile] = useState(null);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(false);

  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // Load categories on mount
  useEffect(() => {
    async function loadCategories() {
      try {
        setLoadingCategories(true);
        const data = await getAdminCategories();
        setCategories(data);
      } catch (err) {
        console.error("Failed to load categories:", err);
        setError("Failed to load categories. Please try again.");
      } finally {
        setLoadingCategories(false);
      }
    }

    loadCategories();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name || !description || !categoryId || !price) {
      setError("Please fill in all required fields.");
      return;
    }

    if (!imageFile) {
      setError("Please upload a course image.");
      return;
    }

    try {
      setSubmitting(true);

      const formData = new FormData();
      formData.append("name", name);
      formData.append("description", description);
      formData.append("category_id", categoryId);
      formData.append("price", price);
      formData.append("image", imageFile);
      // admin_id and is_approved are set by backend, so we do NOT send them.

      const result = await createAdminCourse(formData);
      console.log("CREATE COURSE RESPONSE:", result);

      setSuccess("Course created successfully.");
      // Optionally reset form
      setName("");
      setDescription("");
      setCategoryId("");
      setPrice("");
      setImageFile(null);
    } catch (err) {
      console.error("CREATE COURSE ERROR:", err.response?.data || err.message);
      setError(
        "Failed to create course. Please check your data and try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div>
      <h1 className="text-2xl font-semibold mb-4">Create Course</h1>
      <p className="text-sm text-slate-600 mb-6">
        Fill in the details below to add a new course.
      </p>

      {/* Error / Success messages */}
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

        {/* Category */}
        <div>
          <label className="block text-sm font-medium mb-1">
            Category<span className="text-red-500">*</span>
          </label>
          <select
            className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-slate-500 bg-white"
            value={categoryId}
            onChange={(e) => setCategoryId(e.target.value)}
            disabled={loadingCategories}
          >
            <option value="">
              {loadingCategories
                ? "Loading categories..."
                : "Select a category"}
            </option>
            {categories.map((cat) => (
              <option key={cat.id} value={cat.id}>
                {cat.name}
              </option>
            ))}
          </select>
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
          <label className="block text-sm font-medium mb-1">
            Course Image<span className="text-red-500">*</span>
          </label>
          <input
            type="file"
            accept="image/*"
            className="w-full text-sm"
            onChange={(e) => setImageFile(e.target.files[0] || null)}
          />
        </div>

        <div className="pt-2">
          <button
            type="submit"
            disabled={submitting}
            className="inline-flex items-center justify-center px-4 py-2 rounded-lg bg-slate-900 text-white text-sm font-medium hover:bg-black disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {submitting ? "Creating..." : "Create Course"}
          </button>
        </div>
      </form>
    </div>
  );
}

// src/superadmin/pages/CategoryManagement.jsx
import { useEffect, useState } from "react";
import {
  getCategories,
  createCategory,
  updateCategory,
  deleteCategory,
} from "../../api/superAdmin";

const IMAGE_BASE_URL = (process.env.REACT_APP_BACKEND_URL || "http://127.0.0.1:8000") + "/"; // backend public path

export default function CategoryManagement() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // form state
  const [name, setName] = useState("");
  const [imageFile, setImageFile] = useState(null);

  // edit state
  const [isEditing, setIsEditing] = useState(false);
  const [editingId, setEditingId] = useState(null);

  // fetch categories
  const loadCategories = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getCategories();
      setCategories(res.data || res); // axios .data ya da direkt obje
    } catch (err) {
      console.error("Error fetching categories:", err);
      setError("Failed to load categories.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  // reset form
  const resetForm = () => {
    setName("");
    setImageFile(null);
    setIsEditing(false);
    setEditingId(null);
  };

  // create or update submit
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim()) {
      setError("Name is required.");
      return;
    }

    try {
      setSaving(true);
      setError("");

      const formData = new FormData();
      formData.append("name", name);
      if (imageFile) {
        formData.append("image", imageFile);
      }

      if (isEditing && editingId) {
        await updateCategory(editingId, formData);
      } else {
        await createCategory(formData);
      }

      await loadCategories();
      resetForm();
    } catch (err) {
      console.error("Error saving category:", err);
      setError("Failed to save category.");
    } finally {
      setSaving(false);
    }
  };

  // edit button
  const handleEdit = (category) => {
    setIsEditing(true);
    setEditingId(category.id);
    setName(category.name || "");
    setImageFile(null); // mevcut resmi göstermiyoruz, isterse yeni yükler
  };

  // delete button
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this category?")) {
      return;
    }

    try {
      await deleteCategory(id);
      setCategories((prev) => prev.filter((c) => c.id !== id));
    } catch (err) {
      console.error("Error deleting category:", err);
      setError("Failed to delete category.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">
          Category Management
        </h1>
        <p className="text-sm text-slate-500">
          Create, update and delete course categories.
        </p>
      </div>

      {/* Error message */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}

      {/* Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4"
        encType="multipart/form-data"
      >
        <h2 className="text-sm font-semibold text-slate-900">
          {isEditing ? "Edit Category" : "Create Category"}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Category name"
            />
          </div>

          {/* Image */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Image
            </label>
            <input
              type="file"
              accept="image/*"
              className="w-full text-sm"
              onChange={(e) => setImageFile(e.target.files[0] || null)}
            />
            {isEditing && (
              <p className="mt-1 text-[11px] text-slate-500">
                Leave empty if you do not want to change the image.
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving
              ? isEditing
                ? "Saving..."
                : "Creating..."
              : isEditing
              ? "Save Changes"
              : "Create Category"}
          </button>

          {isEditing && (
            <button
              type="button"
              onClick={resetForm}
              className="text-sm text-slate-600 hover:text-slate-900"
            >
              Cancel
            </button>
          )}
        </div>
      </form>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Existing Categories
          </h2>
          <span className="text-xs text-slate-500">
            Total: {categories.length}
          </span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500">Loading categories...</p>
        ) : categories.length === 0 ? (
          <p className="text-xs text-slate-500">No categories found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    ID
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Image
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Created At
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {categories.map((cat) => {
                  const img = cat.images?.[0]?.image_path;

                  return (
                    <tr
                      key={cat.id}
                      className="border-b border-slate-100 hover:bg-slate-50"
                    >
                      <td className="px-3 py-2">{cat.id}</td>
                      <td className="px-3 py-2">
                        {img ? (
                          <img
                            src={IMAGE_BASE_URL + img}
                            alt={cat.name}
                            className="w-12 h-12 object-cover rounded-md border border-slate-200"
                          />
                        ) : (
                          <span className="text-[11px] text-slate-400">
                            No image
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-2">{cat.name}</td>
                      <td className="px-3 py-2 text-xs text-slate-500">
                        {new Date(cat.created_at).toLocaleString()}
                      </td>
                      <td className="px-3 py-2">
                        <div className="flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleEdit(cat)}
                            className="px-3 py-1 rounded-lg border border-slate-300 text-xs hover:bg-slate-100"
                          >
                            Edit
                          </button>
                          <button
                            type="button"
                            onClick={() => handleDelete(cat.id)}
                            className="px-3 py-1 rounded-lg border border-red-300 text-xs text-red-600 hover:bg-red-50"
                          >
                            Delete
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

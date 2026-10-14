// src/superadmin/pages/CreateAdmin.jsx
import { useEffect, useState } from "react";
import { createAdmin, getAdmins, deleteAdmin } from "../../api/superAdmin";

export default function CreateAdmin() {
  const [admins, setAdmins] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  // form state
  const [name, setName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordConfirm, setPasswordConfirm] = useState("");

  const loadAdmins = async () => {
    try {
      setLoading(true);
      setError("");
      const res = await getAdmins();
      const list = res.data?.data || res.data || [];
      setAdmins(list);
    } catch (err) {
      console.error("Error fetching admins:", err);
      setError("Failed to load admins.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAdmins();
  }, []);

  const resetForm = () => {
    setName("");
    setLastName("");
    setEmail("");
    setPassword("");
    setPasswordConfirm("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!name.trim() || !lastName.trim() || !email.trim()) {
      setError("Name, last name and email are required.");
      return;
    }

    if (password.length < 6) {
      setError("Password must be at least 6 characters.");
      return;
    }

    if (password !== passwordConfirm) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setSaving(true);

      // Laravel validation:
      // name, lastName, email (unique:users,email), password, password_confirmation
      await createAdmin({
        name,
        lastName,
        email,
        password,
        password_confirmation: passwordConfirm,
      });

      setSuccess("Admin created successfully.");
      resetForm();
      await loadAdmins();
    } catch (err) {
      console.error("Error creating admin:", err);
      const backendMessage =
        err.response?.data?.message ||
        err.response?.data?.errors?.email?.[0] ||
        err.response?.data?.errors?.password?.[0];

      setError(backendMessage || "Failed to create admin.");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (admin) => {
    if (
      !window.confirm(
        `Are you sure you want to delete admin "${admin.name} ${admin.lastName}"?`
      )
    ) {
      return;
    }

    try {
      setError("");
      setSuccess("");
      await deleteAdmin(admin.id);
      setAdmins((prev) => prev.filter((a) => a.id !== admin.id));
      setSuccess("Admin deleted successfully.");
    } catch (err) {
      console.error("Error deleting admin:", err);
      setError("Failed to delete admin.");
    }
  };

  return (
    <div className="space-y-6">
      {/* Title */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Create Admin</h1>
        <p className="text-sm text-slate-500">
          Create new admin accounts and manage existing admins.
        </p>
      </div>

      {/* Messages */}
      {error && (
        <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-2 text-sm text-red-700">
          {error}
        </div>
      )}
      {success && (
        <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-2 text-sm text-emerald-700">
          {success}
        </div>
      )}

      {/* Create Admin Form */}
      <form
        onSubmit={handleSubmit}
        className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 space-y-4"
      >
        <h2 className="text-sm font-semibold text-slate-900">
          New Admin Account
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              First Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Admin first name"
            />
          </div>

          {/* Last Name */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Last Name
            </label>
            <input
              type="text"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
              placeholder="Admin last name"
            />
          </div>

          {/* Email */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Email
            </label>
            <input
              type="email"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="admin@example.com"
            />
          </div>

          {/* Password */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="At least 6 characters"
            />
          </div>

          {/* Password Confirmation */}
          <div>
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Confirm Password
            </label>
            <input
              type="password"
              className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
              value={passwordConfirm}
              onChange={(e) => setPasswordConfirm(e.target.value)}
              placeholder="Repeat password"
            />
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="submit"
            disabled={saving}
            className="inline-flex items-center px-4 py-2 rounded-lg bg-indigo-600 text-white text-sm font-medium hover:bg-indigo-700 disabled:opacity-60"
          >
            {saving ? "Creating..." : "Create Admin"}
          </button>
          <button
            type="button"
            onClick={resetForm}
            className="text-sm text-slate-600 hover:text-slate-900"
          >
            Clear
          </button>
        </div>
      </form>

      {/* Admins Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 p-4">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-sm font-semibold text-slate-900">
            Existing Admins
          </h2>
          <span className="text-xs text-slate-500">Total: {admins.length}</span>
        </div>

        {loading ? (
          <p className="text-xs text-slate-500">Loading admins...</p>
        ) : admins.length === 0 ? (
          <p className="text-xs text-slate-500">No admins found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full text-sm">
              <thead>
                <tr className="border-b border-slate-200 bg-slate-50">
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    ID
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Name
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Email
                  </th>
                  <th className="text-left px-3 py-2 font-medium text-slate-600">
                    Role
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
                {admins.map((admin) => (
                  <tr
                    key={admin.id}
                    className="border-b border-slate-100 hover:bg-slate-50"
                  >
                    <td className="px-3 py-2">{admin.id}</td>
                    <td className="px-3 py-2">
                      {admin.name} {admin.lastName}
                    </td>
                    <td className="px-3 py-2">{admin.email}</td>
                    <td className="px-3 py-2">
                      <span className="inline-flex items-center px-2 py-1 rounded-full text-[11px] font-medium bg-slate-100 text-slate-700 border border-slate-200">
                        {admin.role || "admin"}
                      </span>
                    </td>
                    <td className="px-3 py-2 text-xs text-slate-500">
                      {new Date(admin.created_at).toLocaleString()}
                    </td>
                    <td className="px-3 py-2">
                      <button
                        type="button"
                        onClick={() => handleDelete(admin)}
                        className="px-3 py-1 rounded-lg border border-red-300 text-xs text-red-600 hover:bg-red-50"
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

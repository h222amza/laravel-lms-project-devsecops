// src/pages/RegisterPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { registerUser } from "../api/auth";

function RegisterPage() {
  const [form, setForm] = useState({
    name: "",
    lastName: "",
    email: "",
    password: "",
    password_confirmation: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    // basit kontrol
    if (form.password !== form.password_confirmation) {
      setError("Passwords do not match.");
      return;
    }

    try {
      setLoading(true);

      const payload = {
        name: form.name,
        lastName: form.lastName,
        email: form.email,
        password: form.password,
        password_confirmation: form.password_confirmation,
      };

      const res = await registerUser(payload);
      // res: { message, user }

      setSuccessMessage(res.message || "Account created successfully.");
      // İstersen otomatik login yerine login sayfasına yönlendirebiliriz:
      setTimeout(() => {
        navigate("/login");
      }, 1200);
    } catch (err) {
      console.error("Register error:", err);

      // backend validation mesajını yakala (varsa)
      const msg =
        err.response?.data?.message ||
        "Failed to create account. Please check your data.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">
        Create an account
      </h1>
      <p className="text-sm text-slate-500 mb-4">
        New users are automatically registered with the{" "}
        <span className="font-semibold">user</span> role.
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      {successMessage && (
        <div className="mb-3 text-sm text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">
          {successMessage}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
        <div className="flex gap-3">
          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              First name
            </label>
            <input
              type="text"
              name="name"
              value={form.name}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="John"
              required
            />
          </div>

          <div className="flex-1">
            <label className="block text-xs font-medium text-slate-600 mb-1">
              Last name
            </label>
            <input
              type="text"
              name="lastName"
              value={form.lastName}
              onChange={handleChange}
              className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Doe"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Email
          </label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="you@example.com"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Password
          </label>
          <input
            type="password"
            name="password"
            value={form.password}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="********"
            required
          />
        </div>

        <div>
          <label className="block text-xs font-medium text-slate-600 mb-1">
            Confirm password
          </label>
          <input
            type="password"
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            className="w-full px-3 py-2 rounded-lg border border-slate-200 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="********"
            required
          />
        </div>

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg 
                     bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 
                     disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Creating account..." : "Create account"}
        </button>
      </form>
    </div>
  );
}

export default RegisterPage;

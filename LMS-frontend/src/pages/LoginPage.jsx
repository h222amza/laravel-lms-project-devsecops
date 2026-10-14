// src/pages/LoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../api/auth";

function LoginPage() {
  const [form, setForm] = useState({
    email: "",
    password: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setLoading(true);

      const payload = {
        email: form.email,
        password: form.password,
      };

      const res = await loginUser(payload);
      // res muhtemelen: { token: "...", user: {...} }

      // Token'ı farklı isimlerle dönebilir, hepsini dene:
      const token =
        res.token ||
        res.access_token ||
        res.auth_token ||
        res?.data?.token ||
        null;

      if (!token) {
        throw new Error("Token not found in response");
      }

      // localStorage'a kaydet → http.js Authorization header'da kullanacak
      localStorage.setItem("authToken", token);

      if (res.user) {
        localStorage.setItem("authUser", JSON.stringify(res.user));
      }

      // Başarılı ise ana sayfaya
      navigate("/");
    } catch (err) {
      console.error("Login error:", err);

      const msg =
        err.response?.data?.message ||
        "Login failed. Please check your email and password.";
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-white rounded-xl shadow-sm p-6">
      <h1 className="text-2xl font-bold mb-2 text-slate-900">Login</h1>
      <p className="text-sm text-slate-500 mb-4">
        Sign in with your email and password.
      </p>

      {error && (
        <div className="mb-3 text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit} className="space-y-3">
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

        <button
          type="submit"
          disabled={loading}
          className="w-full mt-2 inline-flex items-center justify-center px-4 py-2.5 rounded-lg 
                     bg-blue-600 text-white text-sm font-medium hover:bg-blue-700 
                     disabled:opacity-60 disabled:cursor-not-allowed transition"
        >
          {loading ? "Signing in..." : "Login"}
        </button>
      </form>
    </div>
  );
}

export default LoginPage;

// src/admin/pages/AdminLoginPage.jsx
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginAdmin } from "../../api/auth";

export default function AdminLoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const data = await loginAdmin({ email, password });

      console.log("ADMIN LOGIN RAW:", data);

      // Backend array dönüyorsa ilk elemanı al
      const obj = Array.isArray(data) ? data[0] : data;

      const { token, role } = obj;

      if (!token || !role) {
        setError("Token or role is missing in response.");
        return;
      }

      // token & role kaydet (istersen isimleri genelleştirebilirsin)
      localStorage.setItem("adminToken", token);
      localStorage.setItem("adminRole", role);

      // 🔥 ROLE GÖRE YÖNLENDİRME
      if (role === "superAdmin") {
        // super admin paneli
        navigate("/superadmin/categories"); // veya /superadmin/ istediğin default sayfa
      } else if (role === "admin") {
        // normal admin paneli
        navigate("/admin/dashboard");
      } else {
        // beklenmeyen rol
        setError("Unknown role returned from server.");
      }
    } catch (err) {
      console.error("ADMIN LOGIN ERROR:", err.response?.data || err.message);
      setError("Login failed. Email, password or role might be incorrect.");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-full max-w-sm"
      >
        <h1 className="text-2xl font-semibold mb-4 text-center">Admin Login</h1>

        {error && (
          <p className="text-red-500 text-sm mb-3 text-center">{error}</p>
        )}

        <label className="block mb-3 text-sm">
          Email
          <input
            type="email"
            className="w-full border border-slate-300 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
        </label>

        <label className="block mb-4 text-sm">
          Password
          <input
            type="password"
            className="w-full border border-slate-300 px-3 py-2 rounded-lg mt-1 focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </label>

        <button
          type="submit"
          className="w-full bg-slate-900 text-white py-2 rounded-lg hover:bg-black transition-colors"
        >
          Login
        </button>
      </form>
    </div>
  );
}

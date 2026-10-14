// src/superadmin/components/SuperAdminHeader.jsx
import { useNavigate } from "react-router-dom";

export default function SuperAdminHeader() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("adminRole");
    navigate("/admin/login");
  };

  return (
    <header className="h-14 flex items-center justify-between px-6 border-b bg-white">
      <div>
        <h2 className="text-lg font-semibold">Super Admin Panel</h2>
        <p className="text-xs text-slate-500">
          Manage admins, categories, courses, settings and orders.
        </p>
      </div>

      <button
        onClick={handleLogout}
        className="text-sm border border-slate-300 rounded-lg px-3 py-1 hover:bg-slate-100"
      >
        Logout
      </button>
    </header>
  );
}

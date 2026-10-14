// src/admin/components/AdminLayout.jsx
import { Outlet, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import AdminSidebar from "./AdminSidebar.jsx";
import AdminHeader from "./AdminHeader.jsx";

export default function AdminLayout() {
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("adminToken");
    if (!token) {
      navigate("/admin/login");
    }
  }, [navigate]);

  return (
    <div className="min-h-screen bg-slate-100 flex">
      {/* Left sidebar */}
      <AdminSidebar />

      {/* Right content */}
      <div className="flex-1 flex flex-col">
        <AdminHeader />
        <main className="flex-1 p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

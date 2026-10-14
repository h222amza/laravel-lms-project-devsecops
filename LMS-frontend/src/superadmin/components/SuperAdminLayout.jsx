// src/superadmin/components/SuperAdminLayout.jsx
import { Outlet } from "react-router-dom";
import SuperAdminHeader from "./SuperAdminHeader";
import SuperAdminSidebar from "./SuperAdminSidebar";

export default function SuperAdminLayout() {
  return (
    <div className="min-h-screen flex bg-slate-100">
      {/* Left sidebar */}
      <SuperAdminSidebar />

      {/* Right content */}
      <div className="flex-1 flex flex-col">
        <SuperAdminHeader />
        <main className="flex-1 p-6 overflow-y-auto">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

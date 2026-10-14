// src/superadmin/components/SuperAdminSidebar.jsx
import { NavLink } from "react-router-dom";

export default function SuperAdminSidebar() {
  const linkBase =
    "flex items-center px-4 py-2 text-sm hover:bg-slate-800 transition-colors border-l-4";

  return (
    <aside className="w-64 bg-slate-900 text-slate-100 flex flex-col min-h-screen">
      <div className="h-14 flex items-center px-4 border-b border-slate-800">
        <span className="text-base font-semibold">Super Admin</span>
      </div>

      <nav className="flex-1 py-3 space-y-1">
        <NavLink
          to="/superadmin/dashboard"
          end
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-slate-800 font-semibold border-indigo-400"
                : "border-transparent"
            }`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/superadmin/categories"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-slate-800 font-semibold border-indigo-400"
                : "border-transparent"
            }`
          }
        >
          Category Management
        </NavLink>

        <NavLink
          to="/superadmin/create-admin"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-slate-800 font-semibold border-indigo-400"
                : "border-transparent"
            }`
          }
        >
          Create Admin
        </NavLink>

        <NavLink
          to="/superadmin/courses"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-slate-800 font-semibold border-indigo-400"
                : "border-transparent"
            }`
          }
        >
          Course Management
        </NavLink>

        <NavLink
          to="/superadmin/settings"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-slate-800 font-semibold border-indigo-400"
                : "border-transparent"
            }`
          }
        >
          Site Settings Management
        </NavLink>

        <NavLink
          to="/superadmin/orders"
          className={({ isActive }) =>
            `${linkBase} ${
              isActive
                ? "bg-slate-800 font-semibold border-indigo-400"
                : "border-transparent"
            }`
          }
        >
          Orders Management
        </NavLink>
      </nav>
    </aside>
  );
}

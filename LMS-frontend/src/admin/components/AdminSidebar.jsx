// src/admin/components/AdminSidebar.jsx
import { NavLink } from "react-router-dom";

const linkBase =
  "block px-4 py-2 rounded-lg text-sm font-medium transition-colors";
const inactive = "text-slate-200 hover:bg-slate-800 hover:text-white";
const active = "bg-white text-slate-900";

export default function AdminSidebar() {
  return (
    <aside className="w-60 bg-slate-900 text-slate-100 flex flex-col p-4">
      <div className="mb-6">
        <h1 className="text-xl font-bold">LMS Admin</h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage your courses and content
        </p>
      </div>

      <nav className="space-y-2">
        <NavLink
          to="/admin/dashboard"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Dashboard
        </NavLink>

        <NavLink
          to="/admin/create-course"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Create Course
        </NavLink>

        <NavLink
          to="/admin/my-courses"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Management Course
        </NavLink>

        <NavLink
          to="/admin/create-quiz"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          management Quiz
        </NavLink>
        <NavLink
          to="/admin/messages"
          className={({ isActive }) =>
            `${linkBase} ${isActive ? active : inactive}`
          }
        >
          Messages
        </NavLink>
      </nav>

      <div className="mt-auto pt-4 border-t border-slate-800 text-xs text-slate-400">
        <p>Logged in as Admin</p>
      </div>
    </aside>
  );
}

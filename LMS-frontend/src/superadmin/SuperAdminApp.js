// src/superadmin/SuperAdminApp.jsx
import { Routes, Route, Navigate } from "react-router-dom";
import SuperAdminLayout from "./components/SuperAdminLayout";

import Dashboard from "./pages/Dashboard";
import CategoryManagement from "./pages/CategoryManagement";
import CreateAdmin from "./pages/CreateAdmin";
import CourseManagement from "./pages/CourseManagement";
import SiteSettingsManagement from "./pages/SiteSettingsManagement";
import OrdersManagement from "./pages/OrdersManagement";

export default function SuperAdminApp() {
  return (
    <Routes>
      {/* Parent layout: /superadmin/* */}
      <Route path="/" element={<SuperAdminLayout />}>
        {/* /superadmin → /superadmin/dashboard */}
        <Route index element={<Navigate to="dashboard" replace />} />

        <Route path="dashboard" element={<Dashboard />} />
        <Route path="categories" element={<CategoryManagement />} />
        <Route path="create-admin" element={<CreateAdmin />} />
        <Route path="courses" element={<CourseManagement />} />
        <Route path="settings" element={<SiteSettingsManagement />} />
        <Route path="orders" element={<OrdersManagement />} />

        <Route path="*" element={<Navigate to="dashboard" replace />} />
      </Route>
    </Routes>
  );
}

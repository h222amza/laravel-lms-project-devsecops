// src/admin/AdminApp.jsx
import { Routes, Route } from "react-router-dom";

// Pages
import AdminLoginPage from "./pages/AdminLoginPage.jsx";
import AdminLayout from "./components/AdminLayout.jsx";
import AdminDashboard from "./pages/AdminDashboard.jsx";
import SuperAdminDashboard from "./pages/SuperAdminDashboard.jsx";
import CreateCoursePage from "./pages/CreateCoursePage.jsx";
import MyCoursesPage from "./pages/MyCoursesPage.jsx";
import EditCoursePage from "./pages/EditCoursePage.jsx";
import LessonManagementPage from "./pages/LessonManagementPage.jsx";
import CreateLessonPage from "./pages/CreateLessonPage.jsx";
import AdminMessagesPage from "./pages/AdminMessagesPage.jsx";
import AdminConversationPage from "./pages/AdminConversationPage.jsx";

// import CreateQuizPage from "./pages/CreateQuizPage.jsx";

export default function AdminApp() {
  return (
    <Routes>
      {/* Admin Login */}
      <Route path="login" element={<AdminLoginPage />} />

      {/* Protected Admin Layout */}
      <Route path="/" element={<AdminLayout />}>
        {/* Normal Admin Routes */}
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="create-course" element={<CreateCoursePage />} />
        <Route path="my-courses" element={<MyCoursesPage />} />
        <Route path="edit-course/:id" element={<EditCoursePage />} />
        <Route path="lessons/:courseId" element={<LessonManagementPage />} />
        <Route path="lessons/:courseId/create" element={<CreateLessonPage />} />
        <Route path="messages" element={<AdminMessagesPage />} />
        <Route
          path="messages/:conversationId"
          element={<AdminConversationPage />}
        />
        {/* <Route path="create-quiz" element={<CreateQuizPage />} /> */}
        {/* Super Admin Route */}
        <Route path="super-dashboard" element={<SuperAdminDashboard />} />
      </Route>
    </Routes>
  );
}

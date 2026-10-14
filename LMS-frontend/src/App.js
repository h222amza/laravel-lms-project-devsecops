// src/App.js
import { Routes, Route, useLocation } from "react-router-dom";
import Header from "./components/Header";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import RegisterPage from "./pages/RegisterPage";
import CoursesPage from "./pages/CoursesPage";
import CourseDetailPage from "./pages/CourseDetailPage.jsx";
import { useEffect, useState } from "react";
import { getSettings } from "./api/public";
import CategoryStrip from "./components/CategoryStrip";
import CategoryPage from "./pages/CategoryPage";
import { CartProvider } from "./context/CartContext";
import CartPage from "./pages/CartPage";
import CheckoutPage from "./pages/CheckoutPage";
import ChatPage from "./pages/ChatPage";
import ConversationPage from "./pages/ConversationPage";
import MyCoursesPage from "./pages/MyCoursesPage";
import MyCourseDetailPage from "./pages/MyCourseDetailPage";
import FavoritesPage from "./pages/FavoritesPage";
import HistoryPage from "./pages/HistoryPage";
import AdminApp from "./admin/AdminApp";
import SuperAdminApp from "./superadmin/SuperAdminApp";

function App() {
  const [settings, setSettings] = useState(null);
  const location = useLocation();

  // URL admin ile başlıyor mu?
  const isAdminRoute =
    location.pathname.startsWith("/admin") ||
    location.pathname.startsWith("/superadmin");

  useEffect(() => {
    async function load() {
      try {
        const data = await getSettings();
        setSettings(data);
      } catch (err) {
        console.error("Failed to load settings:", err);
      }
    }
    load();
  }, []);

  return (
    <CartProvider>
      <div className="min-h-screen bg-slate-100">
        {/* 🔹 Admin sayfalarında Header + CategoryStrip GÖRÜNMEYECEK */}
        {!isAdminRoute && (
          <>
            <Header settings={settings} />
            <CategoryStrip />
          </>
        )}

        <main
          className={
            isAdminRoute
              ? "" // admin tam genişlik kullansın
              : "max-w-6xl mx-auto px-4 py-6"
          }
        >
          <Routes>
            {/* USER ROUTES */}
            <Route path="/" element={<HomePage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:id" element={<CourseDetailPage />} />
            <Route path="/categories/:id" element={<CategoryPage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/register" element={<RegisterPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/chat/:instructorId" element={<ChatPage />} />
            <Route
              path="/messages/:conversationId"
              element={<ConversationPage />}
            />
            <Route path="/my-courses" element={<MyCoursesPage />} />
            <Route path="/my-courses/:id" element={<MyCourseDetailPage />} />
            <Route path="/favorites" element={<FavoritesPage />} />
            <Route path="/history" element={<HistoryPage />} />

            {/* ADMIN ROUTES → AdminApp içinde relative: "login", "dashboard" vs. */}
            <Route path="/admin/*" element={<AdminApp />} />
            {/* SUPER ADMIN ROUTES */}
            <Route path="/superadmin/*" element={<SuperAdminApp />} />
          </Routes>
        </main>
      </div>
    </CartProvider>
  );
}

export default App;

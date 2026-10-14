// src/api/admin.js
import http from "./http";

export async function loginAdmin(credentials) {
  // { email, password } bekler
  const response = await http.post("/admin/login", credentials);
  return response.data; // { token, user } gibi
}

// Admin dashboard verileri
export async function getAdminDashboard() {
  const response = await http.get("/admin/dashboard");
  return response.data;
}

// Get categories for admin (for create course form)
export async function getAdminCategories() {
  const response = await http.get("/admin/getCategory");
  // backend: { data: [ {id, name, ...}, ... ] }
  return response.data.data;
}

// Create new course
export async function createAdminCourse(formData) {
  const response = await http.post("/admin/create-course", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Get logged-in admin courses
export async function getMyAdminCourses() {
  const response = await http.get("/admin/my-courses");
  // backend: { courses: [...] }
  return response.data.courses;
}

// Delete a course by id
export async function deleteAdminCourse(id) {
  const response = await http.delete(`/admin/delete-course/${id}`);
  return response.data; // { message: "..."} varsayıyorum
}

export async function getAdminCourseById(id) {
  const response = await http.get(`/admin/course/${id}`);
  // backend'in cevabı muhtemelen { course: {...} } veya direkt {...}
  // Sen emin değilsen console.log ile bakarsın.
  return response.data.course || response.data;
}

export async function updateAdminCourse(id, formData) {
  const response = await http.post(`/admin/update-course/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return response.data;
}

// Get lessons by course id
export async function getLessonsByCourse(courseId) {
  const response = await http.get(`/admin/lessons/${courseId}`);
  return response.data.lessons;
}

// Delete a lesson
export async function deleteLesson(id) {
  const response = await http.delete(`/admin/delete-lesson/${id}`);
  return response.data;
}
export async function createLesson(courseId, formData) {
  const response = await http.post(
    `/admin/create-lesson/${courseId}`,
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );
  return response.data;
}

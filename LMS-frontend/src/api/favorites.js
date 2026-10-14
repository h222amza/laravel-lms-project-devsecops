// src/api/favorites.js
import http from "./http";

// Kullanıcının favori kursları
export async function getFavoriteCourses() {
  const res = await http.get("/user/getFavoriteCourse");
  // backend: { data: [ { id, course_id, course: {...} } ] }
  return res.data.data;
}

// Kursu favorilere ekle
export async function addFavoriteCourse(courseId) {
  const res = await http.get(`/user/addFavoriteCourse/${courseId}`);
  return res.data;
}

// Favoriden sil
// DİKKAT: Backend bu id'yi course_id olarak bekliyor diye varsayıyorum.
// Eğer controller favorite_id bekliyorsa burayı ona göre güncellemen gerekir.
export async function deleteFavoriteCourse(courseId) {
  const res = await http.delete(`/user/deleteCourse/${courseId}`);
  return res.data;
}

// src/api/myCourses.js
import http from "./http";

// Kursun detaylı içeriği (dersler + items)
export async function getCourseContent(courseId) {
  const res = await http.get(`/user/getCourseContent/${courseId}`);
  // backend: { status: "success", data: { ...course } }
  return res.data.data;
}

// Bir dersi başlat (watched kaydı vs. için)
export async function startLesson(lessonId) {
  const res = await http.get(`/user/start-lesson/${lessonId}`);
  // backend: { status: "success", data: { ...lesson, items: [...] } }
  return res.data.data;
}

export async function getMyCourses() {
  const res = await http.get("/user/getMyCourses");
  // backend: { data: [ { id, user_id, course_id, course: {...} } ] }
  return res.data.data;
}

export async function getHistory() {
  const res = await http.get("/user/getHistory");
  // backend: { message: "success", history: [ ... ] }
  return res.data.history;
}

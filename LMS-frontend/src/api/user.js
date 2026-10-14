// src/api/user.js
import http from "./http";

// ----- Profile -----
export async function getUserProfile() {
  const response = await http.get("/user/profile");
  return response.data;
}

export async function updateUserProfile(payload) {
  const response = await http.post("/user/update-profile", payload);
  return response.data;
}

export async function changeUserPassword(payload) {
  const response = await http.post("/user/change-password", payload);
  return response.data;
}

// ----- Cart -----
export async function addToCart(payload) {
  // payload: { course_id: X, ... } (backendine göre)
  const response = await http.post("/user/addToCart", payload);
  return response.data;
}

export async function deleteFromCart(courseId) {
  const response = await http.delete(`/user/deleteFromCart/${courseId}`);
  return response.data;
}

export async function viewCart() {
  const response = await http.get("/user/viewCart");
  return response.data;
}

// ----- Orders -----
export async function placeOrder(payload) {
  const response = await http.post("/user/placeOrder", payload);
  return response.data;
}

export async function viewOrders() {
  const response = await http.get("/user/viewOrders");
  return response.data;
}

// ----- Watched lessons -----
export async function getMyCoursesWatched() {
  const response = await http.get("/user/my-courses-watched");
  return response.data;
}

export async function getCourseContent(id) {
  const response = await http.get(`/user/getCourseContent/${id}`);
  return response.data;
}

export async function startLesson(id) {
  const response = await http.get(`/user/start-lesson/${id}`);
  return response.data;
}

export async function getHistory() {
  const response = await http.get("/user/getHistory");
  return response.data;
}

// ----- Favorites: courses -----
export async function addFavoriteCourse(id) {
  const response = await http.get(`/user/addFavoriteCourse/${id}`);
  return response.data;
}

export async function getFavoriteCourses() {
  const response = await http.get("/user/getFavoriteCourse");
  return response.data;
}

export async function deleteFavoriteCourse(id) {
  const response = await http.delete(`/user/deleteCourse/${id}`);
  return response.data;
}

// ----- Favorites: lessons -----
export async function addFavoriteLesson(id) {
  const response = await http.get(`/user/addFavoriteLesson/${id}`);
  return response.data;
}

export async function getFavoriteLessons() {
  const response = await http.get("/user/getFavoriteLesson");
  return response.data;
}

export async function deleteFavoriteLesson(id) {
  const response = await http.delete(`/user/deleteLesson/${id}`);
  return response.data;
}

// ----- Messages -----
export async function sendMessage(payload) {
  const response = await http.post("/user/sendMessage", payload);
  return response.data;
}

export async function getInbox() {
  const response = await http.get("/user/getInbox");
  return response.data;
}

export async function getMessages(conversationId) {
  const response = await http.get(`/user/getMessages/${conversationId}`);
  return response.data;
}
export async function getMyCourses() {
  const res = await http.get("/user/getMyCourses");
  return res.data.data; // array
}

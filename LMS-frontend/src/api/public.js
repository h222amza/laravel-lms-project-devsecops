// src/api/public.js
import http from "./http";

// Site settings (logo, title, socials, etc.)
// src/api/public.js

// GET /settings  → returns single object
export async function getSettings() {
  const res = await http.get("/settings");
  return res.data; // { id, site_name, header_text, ... }
}

// GET /categories  → returns { data: [...] }
export async function getGuestCategories() {
  const res = await http.get("/categories");
  return res.data.data; // we return only the array
}

//search
export async function searchCategories(searchTerm) {
  const res = await http.get("/categories", {
    params: { search: searchTerm },
  });
  return res.data.data;
}

//popular-new
export async function getPopularCourses() {
  const res = await http.get("/courses/popular");
  // backend: { data: [ ... ] }
  return res.data.data;
}
export async function getNewCourses() {
  const res = await http.get("/courses/new");
  // backend: { data: [ ... ] }
  return res.data.data;
}

// Single category
export async function getCategoryById(id) {
  const response = await http.get(`/category/${id}`);
  return response.data;
}

// Guest courses list
export async function getGuestCourses() {
  const res = await http.get("/courses");
  return res.data.courses;
}

export async function getCourseForGuests(id) {
  const res = await http.get(`/course/${id}`);
  return res.data; 
}

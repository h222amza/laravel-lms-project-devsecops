// src/api/auth.js
import http from "./http";

// Normal user login
export async function loginUser(credentials) {
  // credentials: { email, password }
  const response = await http.post("/login", credentials);
  return response.data;
}

// Admin login
export async function loginAdmin(credentials) {
  const response = await http.post("/admin/login", credentials);
  return response.data;
}

// Register new user
export async function registerUser(data) {
  // data: { name, email, password, ... }
  const response = await http.post("/register", data);
  return response.data;
}

// Logout
export async function logoutUser() {
  const response = await http.post("/logout");
  return response.data;
}

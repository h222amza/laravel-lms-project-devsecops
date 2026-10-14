// src/api/superAdmin.js
import http from "./http";

/**
 * SUPER ADMIN & ADMIN CREATION
 */

// Create a new super admin
export function createSuperAdmin(data) {
  // data: { name, email, password, ... }
  return http.post("/superadmin/create-superadmin", data);
}

// Create a new admin
export function createAdmin(data) {
  // data: { name, email, password, ... }
  return http.post("/superadmin/create-admin", data);
}

// Get all admins
export function getAdmins() {
  return http.get("/superadmin/show-admins");
}

// Delete admin
export function deleteAdmin(id) {
  return http.delete(`/superadmin/delete-admins/${id}`);
}

/**
 * CATEGORY MANAGEMENT (CRUD)
 */

// Get all categories
export function getCategories() {
  return http.get("/superadmin/categories");
}

// Create category
export function createCategory(data) {
  // data: { name, description, ... }
  return http.post("/superadmin/create-category", data);
}

// Update category
export function updateCategory(id, data) {
  return http.post(`/superadmin/update-category/${id}`, data);
}

// Delete category
export function deleteCategory(id) {
  return http.delete(`/superadmin/category/${id}`);
}

/**
 * COURSE MANAGEMENT
 */

export function getSuperadminCourses() {
  return http.get("/superadmin/courses");
}

// Delete course
export function deleteCourse(id) {
  return http.delete(`/superadmin/delete-course/${id}`);
}

// Approve course (zaten vardı ama netleştirelim)
export function approveCourse(id) {
  return http.post(`/superadmin/approve-course/${id}`);
}
/**
 * SITE SETTINGS MANAGEMENT
 */

// Get site settings for super admin
export function getSuperAdminSettings() {
  return http.get("/superadmin/settings");
}

// Update setting (zaten vardı, FormData ile de çalışır)
export function updateSetting(data) {
  return http.post("/superadmin/update-setting", data);
}

// Delete setting (zaten vardı)
export function deleteSetting(id) {
  return http.delete(`/superadmin/setting/${id}`);
}

/**
 * ORDERS MANAGEMENT & ANALYTICS
 */

// Get all orders
export function getAllOrders() {
  return http.get("/superadmin/all-orders");
}

// Get single order details
export function getOrderDetails(id) {
  return http.get(`/superadmin/order-details/${id}`);
}

// Sales analytics (dashboard)
export function getSalesAnalytics() {
  return http.get("/superadmin/getSalesAnalytics");
}

/**
 * CONVERSATIONS / MESSAGES MANAGEMENT
 */

// Get all conversations
export function getAllConversations() {
  return http.get("/superadmin/conversations");
}

// Get single conversation by id
export function getConversationById(id) {
  return http.get(`/superadmin/conversations/${id}`);
}

// Delete conversation
export function deleteConversation(id) {
  return http.delete(`/superadmin/conversations/${id}`);
}

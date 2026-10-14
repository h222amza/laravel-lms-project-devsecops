// src/api/cart.js
import http from "./http";

export async function fetchCart() {
  const res = await http.get("/user/viewCart");
  // backend: { cart: [ ... ] }
  return res.data.cart || [];
}

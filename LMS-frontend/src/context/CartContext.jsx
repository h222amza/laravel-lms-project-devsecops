// src/context/CartContext.jsx
import { createContext, useContext, useEffect, useState } from "react";
import { fetchCart } from "../api/cart";
import http from "../api/http";
const CartContext = createContext(null);

export function CartProvider({ children }) {
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(false);

  const loadCart = async () => {
    const token = localStorage.getItem("authToken");
    if (!token) {
      setCartItems([]);
      return;
    }

    try {
      setLoading(true);
      const items = await fetchCart();
      setCartItems(items);
    } catch (err) {
      console.error("Failed to load cart:", err);
      // 401 vs vs durumda da boş sayabiliriz
      setCartItems([]);
    } finally {
      setLoading(false);
    }
  };
  // Uygulama açılınca sepete bak
  useEffect(() => {
    loadCart();
  }, []);

  const cartCount = cartItems.length;

  const value = {
    cartItems,
    cartCount,
    reloadCart: loadCart,
    setCartItems,
    removeFromCart,
    loading,
  };
  async function removeFromCart(courseId) {
    try {
      await http.delete(`/user/deleteFromCart/${courseId}`);
      await loadCart(); // sepeti yenile
    } catch (error) {
      console.error("Failed to remove item:", error);
    }
  }

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

export function useCart() {
  return useContext(CartContext);
}

// src/pages/CheckoutPage.jsx
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useCart } from "../context/CartContext";
import http from "../api/http";

function CheckoutPage() {
  const navigate = useNavigate();
  const { cartItems, cartCount, reloadCart, loading } = useCart();
  const [paymentMethod, setPaymentMethod] = useState("credit_card"); // varsayılan
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Sayfaya gelince sepeti tazele
  useEffect(() => {
    reloadCart();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Sepet boşsa cart sayfasına geri at
  useEffect(() => {
    if (!loading && cartCount === 0) {
      navigate("/cart");
    }
  }, [loading, cartCount, navigate]);

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.course?.price || 0),
    0
  );

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      setSubmitting(true);

      // 🔥 Siparişi tamamla
      const res = await http.post("/user/placeOrder", {
        payment_method: paymentMethod,
      });

      console.log("Order placed:", res.data);

      // Basit bir başarı mesajı
      alert("Your order has been placed successfully!");

      // İstersen orders sayfasına yönlendirebilirsin (frontend yoksa ana sayfa da olur)
      navigate("/");
    } catch (err) {
      console.error("Failed to place order:", err);
      const msg =
        err.response?.data?.message ||
        "Failed to place order. Please try again.";
      setError(msg);
    } finally {
      setSubmitting(false);
    }
  };

  if (loading && cartCount === 0) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading your cart...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Checkout</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cart items summary */}
        <div className="lg:col-span-2 space-y-3">
          <h2 className="text-lg font-semibold text-slate-900 mb-2">
            Order Items
          </h2>

          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 p-4"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="font-semibold text-slate-900 mb-1">
                    {item.course?.name}
                  </h3>
                  {item.course?.description && (
                    <p className="text-sm text-slate-500 line-clamp-2">
                      {item.course.description}
                    </p>
                  )}
                </div>
                <div className="ml-4 text-right">
                  <p className="font-semibold text-slate-900">
                    {item.course?.price} ₺
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right: Payment + Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-6">
            <h2 className="text-lg font-semibold text-slate-900 mb-4">
              Order Summary
            </h2>

            <div className="space-y-3 mb-4 text-sm">
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Items</span>
                <span className="font-medium text-slate-900">{cartCount}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium text-slate-900">0.00 ₺</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>
            </div>

            {/* 🔥 Payment Method Formu */}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Payment Method
                </label>

                <div className="space-y-2 text-sm">
                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="credit_card"
                      checked={paymentMethod === "credit_card"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-slate-700">Credit Card</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="bank_transfer"
                      checked={paymentMethod === "bank_transfer"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-slate-700">Bank Transfer</span>
                  </label>

                  <label className="flex items-center gap-2">
                    <input
                      type="radio"
                      name="payment_method"
                      value="cash"
                      checked={paymentMethod === "cash"}
                      onChange={(e) => setPaymentMethod(e.target.value)}
                    />
                    <span className="text-slate-700">Cash</span>
                  </label>
                </div>
              </div>

              {error && (
                <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-3 py-2">
                  {error}
                </p>
              )}

              <button
                type="submit"
                disabled={submitting}
                className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? "Placing Order..." : "Place Order"}
              </button>
            </form>

            <p className="text-xs text-slate-500 text-center mt-4">
              By completing your order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CheckoutPage;

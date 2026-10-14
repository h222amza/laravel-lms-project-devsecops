// src/pages/CartPage.jsx
import { useEffect } from "react";
import { useCart } from "../context/CartContext";
import { useNavigate } from "react-router-dom";
function CartPage() {
  const { cartItems, cartCount, reloadCart, loading, removeFromCart } =
    useCart();
  const navigate = useNavigate();
  useEffect(() => {
    reloadCart();
  }, []);

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="text-lg text-slate-600">Loading your cart...</p>
      </div>
    );
  }

  if (cartCount === 0) {
    return (
      <div className="max-w-4xl mx-auto px-6 py-12">
        <div className="bg-white rounded-xl shadow-sm p-12 text-center">
          <svg
            className="w-20 h-20 mx-auto text-slate-300 mb-4"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={1.5}
              d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z"
            />
          </svg>
          <h2 className="text-xl font-semibold text-slate-900 mb-2">
            Your cart is empty
          </h2>
          <p className="text-slate-500">
            Start adding courses to your cart to see them here!
          </p>
        </div>
      </div>
    );
  }

  const totalPrice = cartItems.reduce(
    (sum, item) => sum + Number(item.course?.price || 0),
    0
  );

  return (
    <div className="max-w-4xl mx-auto px-6 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Shopping Cart</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left: Cart Items */}
        <div className="lg:col-span-2 space-y-3">
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg border border-slate-200 p-4 hover:border-slate-300 transition"
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
                  <button
                    onClick={() => removeFromCart(item.course_id)}
                    className="mt-3 text-sm text-red-600 hover:underline"
                  >
                    Remove
                  </button>
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

        {/* Right: Order Summary */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-lg border border-slate-200 p-6 sticky top-6">
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Subtotal</span>
                <span className="font-medium text-slate-900">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-slate-600">Tax</span>
                <span className="font-medium text-slate-900">0.00 ₺</span>
              </div>
            </div>

            <div className="border-t border-slate-200 pt-4 mb-6">
              <div className="flex items-center justify-between">
                <span className="text-base font-semibold text-slate-900">
                  Total
                </span>
                <span className="text-2xl font-bold text-slate-900">
                  {totalPrice.toFixed(2)} ₺
                </span>
              </div>
            </div>

            <button
              type="button"
              onClick={() => navigate("/checkout")}
              className="w-full px-6 py-3 rounded-lg bg-indigo-600 text-white font-semibold hover:bg-indigo-700 transition shadow-md hover:shadow-lg"
            >
              Continue to Payment
            </button>

            <p className="text-xs text-slate-500 text-center mt-4">
              By completing your order, you agree to our terms and conditions.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;

"use client";

import { useCart } from "@/components/cart/CartContext";
import Link from "next/link";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, getTotalPrice, clearCart } =
    useCart();

  if (items.length === 0) {
    return (
      <main className="py-8">
        <div className="container mx-auto px-4">
          <h1 className="text-2xl font-bold mb-8">Your Cart</h1>
          <div className="text-center py-12">
            <p className="text-gray-600 text-lg mb-4">Your cart is empty</p>
            <Link
              href="/product"
              className="text-blue-500 hover:text-blue-600 underline"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 bg-gray-800">
      <div className="container mx-auto px-4">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold">Your Cart</h1>
          <button
            onClick={clearCart}
            className="text-red-500 hover:text-red-600 text-sm underline"
          >
            Clear Cart
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          <div className="lg:col-span-2 space-y-4">
            {items.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-lg shadow-md p-4 flex gap-4"
              >
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded"
                />
                <div className="flex-1">
                  <h3 className="font-semibold text-gray-800 text-lg mb-2">
                    {item.name}
                  </h3>
                  <p className="text-blue-600 font-bold mb-4">£{item.price}</p>
                  <div className="flex items-center gap-4">
                    <label className="text-md text-gray-600">
                      Quantity:
                      <input
                        type="number"
                        min="1"
                        value={item.quantity}
                        onChange={(e) =>
                          updateQuantity(item.id, parseInt(e.target.value) || 1)
                        }
                        className="ml-2 w-16 px-2 py-1 border rounded"
                      />
                    </label>
                    <button
                      onClick={() => removeFromCart(item.id)}
                      className="text-red-500 hover:text-red-600 text-sm underline"
                    >
                      Remove
                    </button>
                  </div>
                  <p className="text-gray-600 mt-2">
                    Subtotal: £{(item.price * item.quantity).toFixed(2)}
                  </p>
                </div>
              </div>
            ))}
          </div>

          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-md p-6 sticky top-4">
              <h2 className="text-xl font-bold text-gray-800 mb-4">
                Order Summary
              </h2>
              <div className="space-y-2 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-800">Items ({items.length})</span>
                  <span className="text-gray-800">
                    £{getTotalPrice().toFixed(2)}
                  </span>
                </div>
                <div className="border-t pt-2">
                  <div className="flex justify-between font-bold text-lg text-gray-800">
                    <span className="text-gray-800">Total</span>
                    <span>£{getTotalPrice().toFixed(2)}</span>
                  </div>
                </div>
              </div>
              <Link
                href="/checkout"
                className="block w-full bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-center"
              >
                Proceed to Checkout
              </Link>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}

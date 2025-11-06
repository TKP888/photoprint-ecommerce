"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useRouter } from "next/navigation";

interface OrderData {
  orderId: string;
  items: Array<{
    id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  shippingInfo: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  total: number;
  orderDate: string;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  useEffect(() => {
    // Get order data from sessionStorage
    const storedOrder = sessionStorage.getItem("lastOrder");
    if (storedOrder) {
      const order = JSON.parse(storedOrder);
      setOrderData(order);
      // Clear cart after successful order
      clearCart();
      // Clear sessionStorage after a delay
      setTimeout(() => {
        sessionStorage.removeItem("lastOrder");
      }, 30000); // Clear after 30 seconds
    } else {
      // If no order data, redirect to home
      router.push("/");
    }
  }, [clearCart, router]);

  if (!orderData) {
    return (
      <main className="py-8 bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Loading order details...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
          {/* Success Icon */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-green-100 mb-4">
              <svg
                className="w-12 h-12 text-green-500"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M5 13l4 4L19 7"
                />
              </svg>
            </div>
            <h1 className="text-4xl font-bold text-white mb-2">
              Order Confirmed!
            </h1>
            <p className="text-gray-400 text-lg">
              Thank you for your purchase. Your order has been received.
            </p>
          </div>

          {/* Order Details Card */}
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Order Details
              </h2>
              <p className="text-gray-600">
                Order ID: <span className="font-semibold">{orderData.orderId}</span>
              </p>
              <p className="text-gray-600">
                Order Date:{" "}
                <span className="font-semibold">
                  {new Date(orderData.orderDate).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>

            {/* Items Ordered */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Items Ordered
              </h3>
              <div className="space-y-3">
                {orderData.items.map((item) => (
                  <div
                    key={item.id}
                    className="flex justify-between items-center py-2 border-b border-gray-200 last:border-0"
                  >
                    <div>
                      <p className="font-medium text-gray-800">{item.name}</p>
                      <p className="text-sm text-gray-600">
                        Quantity: {item.quantity}
                      </p>
                    </div>
                    <p className="font-semibold text-gray-800">
                      £{(item.price * item.quantity).toFixed(2)}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Shipping Address */}
            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Shipping Address
              </h3>
              <div className="text-gray-600">
                <p>
                  {orderData.shippingInfo.firstName}{" "}
                  {orderData.shippingInfo.lastName}
                </p>
                <p>{orderData.shippingInfo.address}</p>
                <p>
                  {orderData.shippingInfo.city},{" "}
                  {orderData.shippingInfo.postcode}
                </p>
                <p>{orderData.shippingInfo.country}</p>
              </div>
            </div>

            {/* Total */}
            <div className="border-t pt-4">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-800">Total</span>
                <span className="text-2xl font-bold text-blue-600">
                  £{orderData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          {/* Next Steps */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              What's Next?
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>
                • You will receive an email confirmation at{" "}
                <span className="font-semibold">
                  {orderData.shippingInfo.email}
                </span>
              </li>
              <li>
                • We'll process your order and send you tracking information
                once it ships
              </li>
              <li>• Expected delivery: 5-7 business days</li>
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4">
            <Link
              href="/product"
              className="flex-1 bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors font-semibold text-center"
            >
              Continue Shopping
            </Link>
            <Link
              href="/"
              className="flex-1 bg-gray-600 text-white px-6 py-3 rounded-lg hover:bg-gray-700 transition-colors font-semibold text-center"
            >
              Back to Home
            </Link>
          </div>

          {/* Help Text */}
          <div className="text-center mt-8">
            <p className="text-gray-400 text-sm">
              Need help?{" "}
              <Link
                href="/contact"
                className="text-blue-400 hover:text-blue-300 underline"
              >
                Contact us
              </Link>
            </p>
          </div>
        </div>
      </div>
    </main>
  );
}


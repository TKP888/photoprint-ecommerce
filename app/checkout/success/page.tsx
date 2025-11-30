"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";
import { useRouter, useSearchParams } from "next/navigation";

interface OrderData {
  id: string;
  order_number: string;
  created_at: string;
  shipping_cost: number;
  subtotal: number;
  shipping_info: {
    firstName: string;
    lastName: string;
    email: string;
    address: string;
    city: string;
    postcode: string;
    country: string;
  };
  order_items: Array<{
    product_id: string;
    name: string;
    price: number;
    quantity: number;
  }>;
  total: number;
}

export default function CheckoutSuccessPage() {
  const router = useRouter();
  const { clearCart } = useCart();
  const [orderData, setOrderData] = useState<OrderData | null>(null);

  const searchParams = useSearchParams();
  const orderNumber = searchParams.get("orderNumber");
  const clearedRef = useRef(false);

  useEffect(() => {
    if (!orderNumber) {
      router.replace("/");
      return;
    }

    const fetchOrder = async () => {
      try {
        const response = await fetch(`/api/orders/${orderNumber}`);
        if (!response.ok) {
          router.replace("/");
          return;
        }

        const order = await response.json();
        setOrderData(order);

        if (!clearedRef.current) {
          clearCart();
          clearedRef.current = true;
        }
      } catch (error) {
        console.error("Failed to load order:", error);
        router.replace("/");
      }
    };

    fetchOrder();
  }, [orderNumber, clearCart, router]);

  if (!orderData) {
    return (
      <main className="py-8 bg-gray-800 min-h-screen">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-white mx-auto"></div>
            <p className="text-white mt-4">Fetching your order...</p>
          </div>
        </div>
      </main>
    );
  }

  return (
    <main className="py-8 bg-gray-800 min-h-screen">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">
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

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <div className="border-b pb-4 mb-4">
              <h2 className="text-2xl font-bold text-gray-800 mb-2">
                Order Details
              </h2>
              <p className="text-gray-600">
                Order ID:{" "}
                <span className="font-semibold">{orderData.order_number}</span>
              </p>
              <p className="text-gray-600">
                Order Date:{" "}
                <span className="font-semibold">
                  {new Date(orderData.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </span>
              </p>
            </div>

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-4">
                Items Ordered
              </h3>
              <div className="space-y-3">
                {orderData.order_items.map((item) => (
                  <div
                    key={item.product_id}
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

            <div className="mb-6">
              <h3 className="text-lg font-semibold text-gray-800 mb-2">
                Shipping Address
              </h3>
              <div className="text-gray-600">
                <p>
                  {orderData.shipping_info.firstName}{" "}
                  {orderData.shipping_info.lastName}
                </p>
                <p>{orderData.shipping_info.address}</p>
                <p>
                  {orderData.shipping_info.city},{" "}
                  {orderData.shipping_info.postcode}
                </p>
                <p>{orderData.shipping_info.country}</p>
              </div>
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-600">
                <span>Subtotal</span>
                <span>£{orderData.subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span>Shipping</span>
                <span>£{orderData.shipping_cost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between items-center border-t pt-3">
                <span className="text-lg font-semibold text-gray-800">
                  Total
                </span>
                <span className="text-2xl font-bold text-blue-600">
                  £{orderData.total.toFixed(2)}
                </span>
              </div>
            </div>
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-6">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">
              What&apos;s Next?
            </h3>
            <ul className="text-blue-700 space-y-2">
              <li>
                • You will receive an email confirmation at{" "}
                <span className="font-semibold">
                  {orderData.shipping_info.email}
                </span>
              </li>
              <li>
                • We&apos;ll process your order and send you tracking
                information once it ships
              </li>
              <li>• Expected delivery: 5-7 business days</li>
            </ul>
          </div>

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

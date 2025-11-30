"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import { createClient } from "@/lib/supabase/client";

interface OrderDetail {
  id: string;
  order_number: string;
  created_at: string;
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
  subtotal: number;
  shipping_cost: number;
  total: number;
  status: string;
}

export default function OrderDetailPage() {
  const params = useParams();
  const orderNumber = params.orderNumber as string;
  const { user, loading } = useRequireAuth();
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user || !orderNumber) return;

    const fetchOrder = async () => {
      try {
        await fetch("/api/orders/update-status", { method: "POST" });
      } catch (error) {
        console.error("Error updating order statuses:", error);
      }

      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .eq("order_number", orderNumber)
        .eq("user_id", user.id)
        .single();

      if (error || !data) {
        console.error("Error fetching order:", error);
        setIsLoading(false);
        return;
      }

      setOrder(data);
      setIsLoading(false);
    };

    fetchOrder();
  }, [user, orderNumber]);

  if (loading || isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading order details...</p>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="space-y-6">
        <Link
          href="/account/orders"
          className="text-blue-400 hover:text-blue-200 inline-block mb-4"
        >
          ← Back to orders
        </Link>
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg">Order not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-gray-700 pb-4">
        <div>
          <Link
            href="/account/orders"
            className="text-blue-400 hover:text-blue-200 inline-block mb-2"
          >
            ← Back to orders
          </Link>
          <h1 className="text-3xl font-bold text-white">
            Order {order.order_number}
          </h1>
          <p className="text-gray-400 mt-2">
            Placed on{" "}
            {new Date(order.created_at).toLocaleDateString("en-GB", {
              day: "numeric",
              month: "long",
              year: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            })}
          </p>
        </div>
        <span
          className={`px-4 py-2 rounded-full text-sm font-medium border ${
            order.status === "pending"
              ? "bg-yellow-500/20 text-yellow-400 border-yellow-500/30"
              : order.status === "shipped"
              ? "bg-purple-500/20 text-purple-400 border-purple-500/30"
              : order.status === "delivered"
              ? "bg-green-500/20 text-green-400 border-green-500/30"
              : "bg-blue-500/20 text-blue-400 border-blue-500/30"
          }`}
        >
          {order.status}
        </span>
      </div>

      <div className="grid gap-6 lg:grid-cols-2">
        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">Order Items</h2>
          <div className="space-y-4">
            {order.order_items.map((item, idx) => (
              <div
                key={idx}
                className="flex justify-between items-center py-3 border-b border-gray-700 last:border-0"
              >
                <div>
                  <p className="text-white font-medium">{item.name}</p>
                  <p className="text-gray-400 text-sm">
                    Quantity: {item.quantity}
                  </p>
                </div>
                <p className="text-white font-semibold">
                  £{(item.price * item.quantity).toFixed(2)}
                </p>
              </div>
            ))}
          </div>
          <div className="mt-6 pt-4 border-t border-gray-700 space-y-2">
            <div className="flex justify-between text-gray-400">
              <span>Subtotal</span>
              <span>£{order.subtotal.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-gray-400">
              <span>Shipping</span>
              <span>£{order.shipping_cost.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold text-white pt-2 border-t border-gray-700">
              <span>Total</span>
              <span>£{order.total.toFixed(2)}</span>
            </div>
          </div>
        </div>

        <div className="bg-gray-900 rounded-lg border border-gray-700 p-6">
          <h2 className="text-xl font-semibold text-white mb-4">
            Shipping Address
          </h2>
          <div className="text-gray-300 space-y-1">
            <p>
              {order.shipping_info.firstName} {order.shipping_info.lastName}
            </p>
            <p>{order.shipping_info.address}</p>
            <p>
              {order.shipping_info.city}, {order.shipping_info.postcode}
            </p>
            <p>{order.shipping_info.country}</p>
          </div>
        </div>
      </div>
    </div>
  );
}

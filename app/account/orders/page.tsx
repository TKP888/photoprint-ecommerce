"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import { createClient } from "@/lib/supabase/client";

interface Order {
  id: string;
  order_number: string;
  total: number;
  status: string;
  created_at: string;
}

export default function OrdersPage() {
  const { user, loading } = useRequireAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchOrders = async () => {
      // First, update order statuses if needed
      try {
        await fetch("/api/orders/update-status", { method: "POST" });
      } catch (error) {
        console.error("Error updating order statuses:", error);
        // Continue anyway - status update is not critical
      }

      // Then fetch orders
      const supabase = createClient();
      const { data, error } = await supabase
        .from("orders")
        .select("id, order_number, total, status, created_at")
        .eq("user_id", user.id)
        .order("created_at", { ascending: false });

      if (error) {
        console.error("Error fetching orders:", error);
        return;
      }

      setOrders(data || []);
      setIsLoading(false);
    };

    fetchOrders();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading orders...</p>
      </div>
    );
  }

  if (orders.length === 0) {
    return (
      <div className="space-y-6">
        <header className="border-b border-gray-700 pb-4">
          <h1 className="text-3xl font-bold text-white">My Orders</h1>
        </header>
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">No orders yet</p>
          <Link
            href="/product"
            className="inline-block text-blue-400 hover:text-blue-200"
          >
            Start shopping →
          </Link>
        </div>
      </div>
    );
  }

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-400 border-yellow-500/30";
      case "processing":
        return "bg-blue-500/20 text-blue-400 border-blue-500/30";
      case "shipped":
        return "bg-purple-500/20 text-purple-400 border-purple-500/30";
      case "delivered":
        return "bg-green-500/20 text-green-400 border-green-500/30";
      case "cancelled":
        return "bg-red-500/20 text-red-400 border-red-500/30";
      default:
        return "bg-gray-500/20 text-gray-400 border-gray-500/30";
    }
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">My Orders</h1>
        <p className="text-gray-400 mt-2">View and track all your orders</p>
      </header>

      <div className="space-y-4">
        {orders.map((order) => (
          <Link
            key={order.id}
            href={`/account/orders/${order.order_number}`}
            className="block bg-gray-900 rounded-lg border border-gray-700 p-6 hover:border-blue-500 transition-colors"
          >
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex-1">
                <div className="flex items-center gap-4 mb-2">
                  <h3 className="text-lg font-semibold text-white">
                    Order {order.order_number}
                  </h3>
                  <span
                    className={`px-3 py-1 rounded-full text-xs font-medium border ${getStatusColor(
                      order.status
                    )}`}
                  >
                    {order.status}
                  </span>
                </div>
                <p className="text-gray-400 text-sm">
                  {new Date(order.created_at).toLocaleDateString("en-GB", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <div className="text-right">
                <p className="text-xl font-bold text-white">
                  £{order.total.toFixed(2)}
                </p>
                <p className="text-gray-400 text-sm">View details →</p>
              </div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}

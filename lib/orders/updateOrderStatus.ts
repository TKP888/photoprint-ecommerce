import { createAdminClient } from "@/lib/supabase/admin";

export async function updateOrderStatusIfNeeded(orderId: string) {
  try {
    const adminSupabase = createAdminClient();
    const now = new Date();

    const { data: order, error: fetchError } = await adminSupabase
      .from("orders")
      .select("id, created_at, status")
      .eq("id", orderId)
      .single();

    if (fetchError || !order) {
      return null;
    }

    if (order.status === "delivered") {
      return order.status;
    }

    const orderDate = new Date(order.created_at);
    const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

    let newStatus: string | null = null;

    if (order.status === "pending" && hoursSinceOrder >= 24) {
      newStatus = "shipped";
    } else if (order.status === "shipped" && hoursSinceOrder >= 72) {
      newStatus = "delivered";
    }

    if (newStatus) {
      const { error: updateError } = await adminSupabase
        .from("orders")
        .update({ status: newStatus, updated_at: now.toISOString() })
        .eq("id", orderId);

      if (!updateError) {
        return newStatus;
      } else {
        console.error(`Failed to update order ${orderId}:`, updateError);
        return order.status;
      }
    }

    return order.status;
  } catch (error) {
    console.error("Error updating order status:", error);
    return null;
  }
}

export async function updateAllOrderStatuses() {
  try {
    const adminSupabase = createAdminClient();
    const now = new Date();

    const { data: orders, error: fetchError } = await adminSupabase
      .from("orders")
      .select("id, created_at, status")
      .in("status", ["pending", "shipped"]);

    if (fetchError || !orders) {
      return 0;
    }

    let updatedCount = 0;

    for (const order of orders) {
      const orderDate = new Date(order.created_at);
      const hoursSinceOrder = (now.getTime() - orderDate.getTime()) / (1000 * 60 * 60);

      let newStatus: string | null = null;

      if (order.status === "pending" && hoursSinceOrder >= 24) {
        newStatus = "shipped";
      } else if (order.status === "shipped" && hoursSinceOrder >= 72) {
        newStatus = "delivered";
      }

      if (newStatus) {
        const { error: updateError } = await adminSupabase
          .from("orders")
          .update({ status: newStatus, updated_at: now.toISOString() })
          .eq("id", order.id);

        if (!updateError) {
          updatedCount++;
        }
      }
    }

    return updatedCount;
  } catch (error) {
    console.error("Error updating all order statuses:", error);
    return 0;
  }
}


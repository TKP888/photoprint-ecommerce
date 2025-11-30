import { createAdminClient } from "@/lib/supabase/admin";
import { NextResponse } from "next/server";

export async function POST() {
  try {
    const adminSupabase = createAdminClient();
    const now = new Date();

    const { data: orders, error: fetchError } = await adminSupabase
      .from("orders")
      .select("id, created_at, status")
      .in("status", ["pending", "shipped"]);

    if (fetchError) {
      throw fetchError;
    }

    if (!orders || orders.length === 0) {
      return NextResponse.json({
        success: true,
        updated: 0,
        message: "No orders need status updates",
      });
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
        } else {
          console.error(`Failed to update order ${order.id}:`, updateError);
        }
      }
    }

    return NextResponse.json({
      success: true,
      updated: updatedCount,
      message: `Updated ${updatedCount} order(s)`,
    });
  } catch (error: unknown) {
    console.error("Error updating order statuses:", error);
    const errorMessage = error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to update order statuses",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}


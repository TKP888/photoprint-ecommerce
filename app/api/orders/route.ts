import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    // Regular server client (has access to auth cookies)
    const serverSupabase = createClient();
    const {
      data: { user },
    } = await serverSupabase.auth.getUser();
    const userId = user?.id || null;

    // Admin client (service role) for database insert
    const adminSupabase = createAdminClient();

    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const { items, shippingInfo, billingInfo, subtotal, shippingCost, total } =
      body;

    const orderItems = items.map((item: any) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.imageUrl,
    }));

    const { data, error } = await adminSupabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_email: shippingInfo.email,
        shipping_info: shippingInfo,
        billing_info: billingInfo,
        order_items: orderItems,
        subtotal,
        shipping_cost: shippingCost,
        total,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: data.id,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);
    return NextResponse.json(
      {
        error: "Failed to create order",
        message: error?.message || error?.details || "Unknown error",
      },
      { status: 500 }
    );
  }
}

import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    // Get the order data from the request body
    const body = await request.json();

    // Create Supabase client
    const supabase = createClient();

    // Get current user (if logged in)
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const userId = user?.id || null; // null for guest checkout

    // Generate unique order number
    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    // Extract order data from request
    const {
      items, // Cart items
      shippingInfo, // Shipping address
      billingInfo, // Billing address
      subtotal, // Subtotal before shipping
      shippingCost, // Shipping cost
      total, // Total amount
    } = body;

    // Format order items for database (jsonb format)
    const orderItems = items.map((item: any) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.imageUrl,
    }));

    // Insert order into database
    const { data, error } = await supabase
      .from("orders")
      .insert({
        order_number: orderNumber,
        user_id: userId,
        customer_email: shippingInfo.email,
        shipping_info: shippingInfo,
        billing_info: billingInfo,
        order_items: orderItems,
        subtotal: subtotal,
        shipping_cost: shippingCost,
        total: total,
        status: "pending",
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return NextResponse.json({
      success: true,
      orderNumber: orderNumber,
      orderId: data.id,
    });
  } catch (error: any) {
    console.error("Error creating order:", error);

    // Log the full error for debugging
    console.error("Full error object:", JSON.stringify(error, null, 2));

    // Return the actual error message
    const errorMessage = error?.message || error?.details || "Unknown error";
    const errorHint = error?.hint || "";

    return NextResponse.json(
      {
        error: "Failed to create order",
        message: errorMessage,
        hint: errorHint,
        // Include full error in development
        ...(process.env.NODE_ENV === "development" && {
          fullError: error?.toString(),
          errorCode: error?.code,
        }),
      },
      { status: 500 }
    );
  }
}

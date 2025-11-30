import { createAdminClient } from "@/lib/supabase/admin";
import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import type { OrderItem, StockUpdate } from "@/types";

export async function POST(request: Request) {
  try {
    const body = await request.json();

    const serverSupabase = await createClient();
    const {
      data: { user },
    } = await serverSupabase.auth.getUser();
    const userId = user?.id || null;

    const adminSupabase = createAdminClient();

    const orderNumber = `ORD-${Date.now()}-${Math.random()
      .toString(36)
      .substring(2, 9)}`;

    const { items, shippingInfo, billingInfo, subtotal, shippingCost, total } =
      body;

    const stockUpdates: StockUpdate[] = [];
    
    for (const item of items) {
      const { data: product, error: productError } = await adminSupabase
        .from("products")
        .select("*")
        .eq("id", item.id)
        .single();

      if (productError || !product) {
        throw new Error(`Product ${item.id} not found`);
      }

      const hasStockField = 'stock' in product && product.stock !== null && product.stock !== undefined;
      const hasStockQuantityField = 'stock_quantity' in product && product.stock_quantity !== null && product.stock_quantity !== undefined;
      
      const stockField = hasStockField ? 'stock' : (hasStockQuantityField ? 'stock_quantity' : null);
      const stockValue = hasStockField ? product.stock : (hasStockQuantityField ? product.stock_quantity : null);
      
      if (stockField === null || stockValue === null) {
        console.warn(`Product ${item.id} (${item.name}) does not have a stock field. Skipping stock update.`);
        continue;
      }
      
      const currentStock = stockValue as number;

      if (currentStock < item.quantity) {
        return NextResponse.json(
          {
            error: "Insufficient stock",
            message: `Not enough stock available for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }

      stockUpdates.push({
        id: item.id,
        newStock: currentStock - item.quantity,
        fieldName: stockField,
      });
    }

    const orderItems = items.map((item: OrderItem) => ({
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

    for (const update of stockUpdates) {
      const updateData: Record<string, number> = {};
      updateData[update.fieldName] = update.newStock;

      const { error: stockError } = await adminSupabase
        .from("products")
        .update(updateData)
        .eq("id", update.id);

      if (stockError) {
        console.error(
          `Failed to update stock for product ${update.id}:`,
          stockError
        );
      }
    }

    return NextResponse.json({
      success: true,
      orderNumber,
      orderId: data.id,
    });
  } catch (error: unknown) {
    console.error("Error creating order:", error);
    const errorMessage =
      error instanceof Error
        ? error.message
        : typeof error === "object" && error !== null && "details" in error
        ? String(error.details)
        : "Unknown error";
    return NextResponse.json(
      {
        error: "Failed to create order",
        message: errorMessage,
      },
      { status: 500 }
    );
  }
}

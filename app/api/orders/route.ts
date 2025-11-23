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

    // First, check stock levels and prepare stock updates
    const stockUpdates: Array<{ id: string; newStock: number; fieldName: string }> = [];
    
    for (const item of items) {
      // Fetch current product to check stock
      // Select all fields to avoid errors if stock fields don't exist
      const { data: product, error: productError } = await adminSupabase
        .from("products")
        .select("*")
        .eq("id", item.id)
        .single();

      if (productError || !product) {
        throw new Error(`Product ${item.id} not found`);
      }

      // Determine which stock field exists (prefer 'stock', fallback to 'stock_quantity')
      // Handle null/undefined values - check if field exists in the product object
      const hasStockField = 'stock' in product && product.stock !== null && product.stock !== undefined;
      const hasStockQuantityField = 'stock_quantity' in product && product.stock_quantity !== null && product.stock_quantity !== undefined;
      
      const stockField = hasStockField ? 'stock' : (hasStockQuantityField ? 'stock_quantity' : null);
      const stockValue = hasStockField ? product.stock : (hasStockQuantityField ? product.stock_quantity : null);
      
      // If no stock field exists, skip stock management for this product
      if (stockField === null || stockValue === null) {
        console.warn(`Product ${item.id} (${item.name}) does not have a stock field. Skipping stock update.`);
        continue;
      }
      
      const currentStock = stockValue as number;

      // Check if enough stock is available
      if (currentStock < item.quantity) {
        return NextResponse.json(
          {
            error: "Insufficient stock",
            message: `Not enough stock available for ${item.name}. Available: ${currentStock}, Requested: ${item.quantity}`,
          },
          { status: 400 }
        );
      }

      // Prepare stock update
      stockUpdates.push({
        id: item.id,
        newStock: currentStock - item.quantity,
        fieldName: stockField,
      });
    }

    const orderItems = items.map((item: any) => ({
      product_id: item.id,
      name: item.name,
      price: item.price,
      quantity: item.quantity,
      image_url: item.imageUrl,
    }));

    // Create the order
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

    // Update stock levels for all products in the order
    for (const update of stockUpdates) {
      const updateData: any = {};
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
        // Log error but don't fail the order - stock update can be done manually if needed
      }
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

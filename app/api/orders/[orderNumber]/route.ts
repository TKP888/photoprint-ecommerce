import { NextResponse } from "next/server";
import { createAdminClient } from "@/lib/supabase/admin"; // same service-role client

export async function GET(
  request: Request,
  { params }: { params: { orderNumber: string } }
) {
  try {
    const supabase = createAdminClient(); // service role to bypass RLS
    const { data, error } = await supabase
      .from("orders")
      .select("*")
      .eq("order_number", params.orderNumber)
      .single();

    if (error || !data) {
      return NextResponse.json({ error: "Order not found" }, { status: 404 });
    }

    return NextResponse.json(data);
  } catch (error) {
    console.error("Failed to fetch order:", error);
    return NextResponse.json(
      { error: "Failed to fetch order" },
      { status: 500 }
    );
  }
}

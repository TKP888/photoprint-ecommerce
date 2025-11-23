import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { productId } = body;

    if (!productId) {
      return NextResponse.json(
        { error: "Product ID is required" },
        { status: 400 }
      );
    }

    const supabase = createClient();
    const {
      data: { user },
    } = await supabase.auth.getUser();

    // Only track for authenticated users
    if (!user) {
      return NextResponse.json({ success: true, message: "Not authenticated" });
    }

    // Always insert a new record to maintain full view history
    const now = new Date().toISOString();
    const { error } = await supabase.from("recently_viewed").insert({
      user_id: user.id,
      product_id: productId,
      viewed_at: now,
    });

    if (error) {
      console.error("Error tracking view:", error);
      return NextResponse.json(
        { error: "Failed to track view", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    console.error("Error in recently-viewed API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to track view", details: errorMessage },
      { status: 500 }
    );
  }
}

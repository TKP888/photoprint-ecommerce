import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";
import { buildProductQuery } from "@/lib/products/filterProducts";

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const query = searchParams.get("q");

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: "Search query must be at least 2 characters" },
        { status: 400 }
      );
    }

    const supabase = await createClient();

    const productQuery = buildProductQuery(supabase, {
      search: query.trim(),
      sort: "name_asc",
    });

    const { data: products, error } = await productQuery.limit(8);

    if (error) {
      console.error("Error searching products:", error);
      return NextResponse.json(
        { error: "Failed to search products", details: error.message },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      products: products || [],
    });
  } catch (error: unknown) {
    console.error("Error in search API:", error);
    const errorMessage =
      error instanceof Error ? error.message : "Unknown error";
    return NextResponse.json(
      { error: "Failed to process search", details: errorMessage },
      { status: 500 }
    );
  }
}


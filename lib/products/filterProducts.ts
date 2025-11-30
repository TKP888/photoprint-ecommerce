import { SupabaseClient } from "@supabase/supabase-js";

interface FilterParams {
  search?: string | null;
  minPrice?: string | null;
  maxPrice?: string | null;
  inStock?: string | null;
  sort?: string | null;
}

export function buildProductQuery(
  supabase: SupabaseClient,
  filters: FilterParams
) {
  let query = supabase.from("products").select("*");

  if (filters.search) {
    const searchTerm = filters.search.trim();
    query = query.or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  if (filters.minPrice) {
    const minPrice = parseFloat(filters.minPrice);
    if (!isNaN(minPrice)) {
      query = query.gte("price", minPrice);
    }
  }

  if (filters.maxPrice) {
    const maxPrice = parseFloat(filters.maxPrice);
    if (!isNaN(maxPrice)) {
      query = query.lte("price", maxPrice);
    }
  }

  const sortOption = filters.sort || "name_asc";
  const [column, direction] = sortOption.split("_");

  let sortColumn = column;
  if (column === "newest") {
    sortColumn = "created_at";
  }

  query = query.order(sortColumn, {
    ascending: direction === "asc",
  });

  return query;
}


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

  // Search filter - search in name and description
  if (filters.search) {
    const searchTerm = filters.search.trim();
    query = query.or(
      `name.ilike.%${searchTerm}%,description.ilike.%${searchTerm}%`
    );
  }

  // Price range filters
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

  // Stock filter - handled client-side after fetch due to OR condition across columns
  // This will be applied in the product page after fetching

  // Sort
  const sortOption = filters.sort || "name_asc";
  const [column, direction] = sortOption.split("_");

  // Map sort options to database columns
  let sortColumn = column;
  if (column === "newest") {
    sortColumn = "created_at";
  }

  query = query.order(sortColumn, {
    ascending: direction === "asc",
  });

  return query;
}


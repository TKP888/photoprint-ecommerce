import ProductCard from "@/components/ui/ProductCard";
import ProductFilters from "@/components/product/ProductFilters";
import { createClient } from "@/lib/supabase/client";
import { buildProductQuery } from "@/lib/products/filterProducts";
import Link from "next/link";
import type { Product } from "@/types";

interface ProductPageProps {
  searchParams: Promise<{
    search?: string;
    minPrice?: string;
    maxPrice?: string;
    inStock?: string;
    sort?: string;
  }>;
}

export default async function ProductPage({ searchParams }: ProductPageProps) {
  const params = await searchParams;
  const supabase = createClient();

  const query = buildProductQuery(supabase, {
    search: params.search,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    inStock: params.inStock,
    sort: params.sort,
  });

  const { data: products, error } = await query;

  if (error) {
    console.error("Error fetching products:", error);
    return (
      <main className="py-8 bg-gray-800 flex-1">
        <div className="container mx-auto px-4">
          <div className="bg-red-500/20 border border-red-500/50 text-red-400 px-4 py-3 rounded-lg">
            Error loading products. Please try again.
          </div>
        </div>
      </main>
    );
  }

  let filteredProducts = products || [];
  if (params.inStock === "true" && filteredProducts.length > 0) {
    filteredProducts = filteredProducts.filter((product: Product) => {
      const stock = product.stock;
      const stockQuantity = product.stock_quantity;
      return (
        (stock !== null && stock !== undefined && stock > 0) ||
        (stockQuantity !== null &&
          stockQuantity !== undefined &&
          stockQuantity > 0) ||
        (stock === null && stockQuantity === null)
      );
    });
  }

  const hasSearch = params.search && params.search.trim().length > 0;
  const hasFilters =
    params.minPrice || params.maxPrice || params.inStock === "true";

  return (
    <main className="py-8 bg-gray-800 flex-1">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">All Products</h1>
            {hasSearch && (
              <p className="text-gray-400 text-sm">
                Search results for &quot;{params.search}&quot;
              </p>
            )}
            {filteredProducts && filteredProducts.length > 0 && (
              <p className="text-gray-400 text-sm">
                {filteredProducts.length}{" "}
                {filteredProducts.length === 1 ? "product" : "products"} found
              </p>
            )}
          </div>
        </div>

        <ProductFilters />
        {filteredProducts && filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url}
                description={product.description}
                stock={(product as Product).stock}
                stockQuantity={(product as Product).stock_quantity}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600 mb-4">
              {hasSearch || hasFilters
                ? "Try adjusting your search or filters"
                : "No products available at the moment"}
            </p>
            {(hasSearch || hasFilters) && (
              <Link
                href="/product"
                className="inline-block text-blue-500 hover:text-blue-600 underline text-sm"
              >
                Clear search and filters
              </Link>
            )}
          </div>
        )}
      </div>
    </main>
  );
}

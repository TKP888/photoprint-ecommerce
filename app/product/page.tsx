import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase/client";

export default async function ProductPage() {
  // Create Supabase client
  const supabase = createClient();

  // Fetch products from Supabase
  const { data: products, error } = await supabase.from("products").select("*");

  if (error) {
    console.error("Error fetching products:", error);
    return <div>Error loading products</div>;
  }

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">All Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Use products from Supabase instead of hard-coded */}
          {products?.map((product) => (
            <ProductCard
              key={product.id}
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
              description={product.description}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

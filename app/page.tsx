import ProductCard from "@/components/ui/ProductCard";
import Carousel from "@/components/home/Carousel";
import { createClient } from "@/lib/supabase/client";

export default async function Home() {
  // Create Supabase client
  const supabase = createClient();

  // Fetch products from Supabase
  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(12); // Get first 12 products

  // If there's an error, you can handle it
  if (error) {
    console.error("Error fetching products:", error);
  }
  return (
    <main className="py-0 ">
      <div>
        <Carousel />
      </div>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-8">Best Sellers</h1>

        {/* Grid container */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Use products from Supabase instead of hard-coded */}
          {products?.slice(0, 4).map((product) => (
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
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-8">Featured Products</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.slice(4, 12).map((product) => (
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

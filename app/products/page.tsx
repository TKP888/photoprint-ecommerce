import ProductCard from "@/components/ui/ProductCard";
import { createClient } from "@/lib/supabase/client";

export default async function ProductsPage() {
  const supabase = createClient();

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(12);

  if (error) {
    console.error("Error fetching products:", error);
  }

  return (
    <main className="py-8 bg-gray-800">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8 text-white">Products</h1>

        {products && products.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <ProductCard
                key={product.id}
                id={product.id}
                name={product.name}
                price={product.price}
                imageUrl={product.image_url}
                description={product.description}
                stock={product.stock}
                stockQuantity={product.stock_quantity}
              />
            ))}
          </div>
        ) : (
          <div className="bg-white rounded-lg shadow-md p-12 text-center">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              No products found
            </h3>
            <p className="text-gray-600">No products available at the moment</p>
          </div>
        )}
      </div>
    </main>
  );
}

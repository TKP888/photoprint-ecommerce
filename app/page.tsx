import ProductCard from "@/components/ui/ProductCard";
import Carousel from "@/components/home/Carousel";
import LimitedEditionSection from "@/components/home/LimitedEditionSection";
import { createClient } from "@/lib/supabase/client";
import type { Product } from "@/types";

export default async function Home() {
  const supabase = createClient();

  const { data: allProducts } = await supabase.from("products").select("*");

  const { data: products, error } = await supabase
    .from("products")
    .select("*")
    .limit(12);

  if (error) {
    console.error("Error fetching products:", error);
  }

  const steelMotion = allProducts?.find(
    (product) => product.name === "Steel Motion"
  );
  const goldenStillness = allProducts?.find(
    (product) => product.name === "Golden Stillness"
  );

  return (
    <main className="py-0 bg-gray-800">
      <div>
        <Carousel />
      </div>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">Best Sellers</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {products?.slice(0, 4).map((product) => (
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
      </div>

      <LimitedEditionSection
        items={[
          {
            id: steelMotion?.id || "limited-1",
            title: "Steel Motion",
            subtitle: "A moment between cities",
            imageUrl: "/images/limitededition/Limited-1.jpg",
            href: steelMotion ? `/product/${steelMotion.id}` : "/products",
          },
          {
            id: goldenStillness?.id || "limited-2",
            title: "Golden Stillness",
            subtitle: "Illumination shaped by craft",
            imageUrl: "/images/limitededition/Limited-2.jpg",
            href: goldenStillness
              ? `/product/${goldenStillness.id}`
              : "/products",
          },
        ]}
      />

      <div className="container mx-auto py-12 px-4">
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
              stock={(product as Product).stock}
              stockQuantity={(product as Product).stock_quantity}
            />
          ))}
        </div>
      </div>
    </main>
  );
}

import { createClient } from "@/lib/supabase/client";
import { notFound } from "next/navigation";
import AddToCartButton from "@/components/product/AddToCartButton";
import ProductCard from "@/components/ui/ProductCard";

interface ProductDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ProductDetailPage({
  params,
}: ProductDetailPageProps) {
  const { id } = await params;

  const supabase = createClient();

  const { data: product, error } = await supabase
    .from("products")
    .select("*")
    .eq("id", id)
    .single();

  if (error || !product) {
    notFound();
  }

  const { data: allProducts } = await supabase
    .from("products")
    .select("*")
    .neq("id", id);

  const shuffleArray = <T,>(array: T[]): T[] => {
    const shuffled = [...array];
    for (let i = shuffled.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
    }
    return shuffled;
  };

  const randomizedProducts = allProducts
    ? shuffleArray(allProducts).slice(0, 8)
    : [];

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full rounded-lg shadow-md"
            />
          </div>

          <div>
            <h1 className="text-3xl font-bold mb-4">{product.name}</h1>
            <p className="text-2xl font-semibold mb-4 text-blue-600">
              £{product.price}
            </p>
            {product.description && (
              <p className="text-gray-700 mb-6 leading-relaxed">
                {product.description}
              </p>
            )}
            <AddToCartButton
              id={product.id}
              name={product.name}
              price={product.price}
              imageUrl={product.image_url}
            />
          </div>
        </div>

        {randomizedProducts && randomizedProducts.length > 0 && (
          <div className="mt-16">
            <h2 className="text-2xl font-bold mb-8">More Products</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {randomizedProducts.map((otherProduct) => (
                <ProductCard
                  key={otherProduct.id}
                  id={otherProduct.id}
                  name={otherProduct.name}
                  price={otherProduct.price}
                  imageUrl={otherProduct.image_url}
                  description={otherProduct.description}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </main>
  );
}

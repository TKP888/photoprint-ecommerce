import ProductCard from "@/components/ui/ProductCard";

export default function Home() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">Featured Products</h1>

        {/* Grid container - this will control the card width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            id="1"
            name="Test Product"
            price={29.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product"
          />
          <ProductCard
            id="2"
            name="Test Product 2"
            price={39.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 2"
          />
          <ProductCard
            id="3"
            name="Test Product 3"
            price={49.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 3"
          />
          <ProductCard
            id="4"
            name="Test Product 4"
            price={59.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 4"
          />
          <ProductCard
            id="5"
            name="Test Product 5"
            price={69.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 5"
          />
          <ProductCard
            id="6"
            name="Test Product 6"
            price={79.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 6"
          />
          <ProductCard
            id="7"
            name="Test Product 7"
            price={89.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 7"
          />
          <ProductCard
            id="8"
            name="Test Product 8"
            price={99.99}
            imageUrl="/placeholder.jpg"
            description="This is a test product 8"
          />
        </div>
      </div>
    </main>
  );
}

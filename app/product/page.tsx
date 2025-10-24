import ProductCard from "@/components/ui/ProductCard";

export default function ProductPage() {
  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <h1 className="text-2xl font-bold mb-8">All Products</h1>

        {/* Grid container - this will control the card width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            id="1"
            name="Mount Fuji"
            price={29.99}
            imageUrl="/products/1 Fuji.jpg"
            alt="Mount Fuji"
            description="This is a test product"
          />
          <ProductCard
            id="2"
            name="Shibuya Crossing"
            price={39.99}
            imageUrl="/products/2 Shibuya Crossing.jpg"
            alt="Shibuya Crossing"
            description="This is a test product 2"
          />
          <ProductCard
            id="3"
            name="Omikuji Fortune Stand"
            price={49.99}
            imageUrl="/products/3 Omikuji Fortune Stand.jpg"
            alt="Omikuji Fortune Stand"
            description="This is a test product 3"
          />
          <ProductCard
            id="4"
            name="Miyajima Island Torii Gate"
            price={59.99}
            imageUrl="/products/4 Miyajima Island Torii Gate.jpg"
            alt="Miyajima Island Torii Gate"
            description="This is a test product 4"
          />
          <ProductCard
            id="5"
            name="Nara Deer"
            price={69.99}
            imageUrl="/products/5 Nara Deer.jpg"
            alt="Nara Deer"
            description="This is a test product 5"
          />
          <ProductCard
            id="6"
            name="Kobe Port Tower"
            price={79.99}
            imageUrl="/products/6 Kobe Port Tower.jpg"
            alt="Kobe Port Tower"
            description="This is a test product 6"
          />
          <ProductCard
            id="7"
            name="Hiroshima at Night"
            price={89.99}
            imageUrl="/products/7 Hiroshima at Night.jpg"
            alt="Hiroshima at Night"
            description="This is a test product 7"
          />
          <ProductCard
            id="8"
            name="Japanese Pine Tree"
            price={99.99}
            imageUrl="/products/8 Japanese Pine Tree.jpg"
            alt="Japanese Pine Tree"
            description="This is a test product 8"
          />
          <ProductCard
            id="9"
            name="Kyoto River"
            price={69.99}
            imageUrl="/products/9 Kyoto River.jpg"
            alt="Kyoto River"
            description="This is a test product 5"
          />
          <ProductCard
            id="10"
            name="Porsche Carrera"
            price={79.99}
            imageUrl="/products/10 Porsche Carrera.jpg"
            alt="Porsche Carrera"
            description="This is a test product 6"
          />
          <ProductCard
            id="11"
            name="Hiroshima Fishing Boat"
            price={89.99}
            imageUrl="/products/11 Hiroshima Fishing Boat.jpg"
            alt="Hiroshima Fishing Boat"
            description="This is a test product 7"
          />
          <ProductCard
            id="12"
            name="Kinkaku-ji Golden Pavilion"
            price={99.99}
            imageUrl="/products/12 Kinkakuji Temple.jpg"
            alt="Kinkaku-ji Golden Pavilion"
            description="This is a test product 8"
          />
          <ProductCard
            id="13"
            name="Asakusa at Night"
            price={69.99}
            imageUrl="/products/13 Asakusa at Night.jpg"
            alt="Asakusa at Night"
            description="This is a test product 5"
          />
          <ProductCard
            id="14"
            name="Chevy Silverado"
            price={79.99}
            imageUrl="/products/14 Chevy Silverado.jpg"
            alt="Chevy Silverado"
            description="This is a test product 6"
          />
          <ProductCard
            id="15"
            name="Bullet Train"
            price={89.99}
            imageUrl="/products/15 Bullet Train.jpg"
            alt="Bullet Train"
            description="This is a test product 7"
          />
          <ProductCard
            id="16"
            name="Kabukicho at Night"
            price={99.99}
            imageUrl="/products/16 Kabukicho at Night.jpg"
            alt="Kabukicho at Night"
            description="This is a test product 8"
          />
        </div>
      </div>
    </main>
  );
}

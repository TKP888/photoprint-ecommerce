import ProductCard from "@/components/ui/ProductCard";
import Carousel from "@/components/home/Carousel";

export default function Home() {
  return (
    <main className="py-0 ">
      <div>
        <Carousel />
      </div>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-8">Best Sellers</h1>

        {/* Grid container - this will control the card width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            id="1"
            name="Mount Fuji"
            price={29.99}
            imageUrl="/products/1 Fuji.jpg"
            alt="Mount Fuji"
            description="A timeless symbol of Japan’s serene beauty. This image captures Mount Fuji rising majestically above drifting clouds, embodying calm, balance, and quiet strength."
          />
          <ProductCard
            id="2"
            name="Shibuya Crossing"
            price={39.99}
            imageUrl="/products/2 Shibuya Crossing.jpg"
            alt="Shibuya Crossing"
            description="The heartbeat of Tokyo. A mesmerising snapshot of a lambourghini driving through the iconic Shibuya Crossing, a symbol of modernity and progress."
          />
          <ProductCard
            id="3"
            name="Omikuji Fortune Stand"
            price={49.99}
            imageUrl="/products/3 Omikuji Fortune Stand.jpg"
            alt="Omikuji Fortune Stand"
            description="Luck, hope, and tradition intertwine in this glimpse of an omikuji stand, a reminder that every fortune, good or bad, is part of the journey."
          />
          <ProductCard
            id="4"
            name="Miyajima Island Torii Gate"
            price={59.99}
            imageUrl="/products/4 Miyajima Island Torii Gate.jpg"
            alt="Miyajima Island Torii Gate"
            description="A symbol of connection and purification. This image captures the Miyajima Island Torii Gate, a traditional Japanese wooden structure that stands at the entrance to the island, symbolizing the connection between the human world and the sacred realm."
          />
        </div>
      </div>
      <div className="container mx-auto py-20 px-4">
        <h1 className="text-2xl font-bold mb-8">Featured Products</h1>

        {/* Grid container - this will control the card width */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <ProductCard
            id="5"
            name="Nara Deer"
            price={69.99}
            imageUrl="/products/5 Nara Deer.jpg"
            alt="Nara Deer"
            description="A symbol of nature and tranquility. This image captures the Nara Deer, a symbol of nature and tranquility, roaming freely in the Nara Park, embodying the spirit of Japan's natural beauty."
          />
          <ProductCard
            id="6"
            name="Kobe Port Tower"
            price={79.99}
            imageUrl="/products/6 Kobe Port Tower.jpg"
            alt="Kobe Port Tower"
            description="A symbol of modernity and progress. This image captures the Kobe Port Tower, a modernist architectural landmark that stands at the entrance to the city, symbolising the spirit of modernity and progress."
          />
          <ProductCard
            id="7"
            name="Hiroshima at Night"
            price={89.99}
            imageUrl="/products/7 Hiroshima at Night.jpg"
            alt="Hiroshima at Night"
            description="A symbol of resilience and growth. This image captures the Hiroshima at Night, a symbol of resilience and growth, standing tall and proud in the face of adversity, embodying the spirit of Japan."
          />
          <ProductCard
            id="8"
            name="Japanese Pine Tree"
            price={99.99}
            imageUrl="/products/8 Japanese Pine Tree.jpg"
            alt="Japanese Pine Tree"
            description="A symbol of resilience and growth. This image captures the Japanese Pine Tree, a symbol of resilience and growth, standing tall and proud in the face of adversity, embodying the spirit of Japan."
          />
          <ProductCard
            id="9"
            name="Kyoto River"
            price={69.99}
            imageUrl="/products/9 Kyoto River.jpg"
            alt="Kyoto River"
            description="A symbol of serenity and tranquility. This image captures the Kyoto River, a symbol of serenity and tranquility, flowing gently through the city, embodying the spirit of Japan's natural beauty."
          />
          <ProductCard
            id="10"
            name="Porsche Carrera"
            price={79.99}
            imageUrl="/products/10 Porsche Carrera.jpg"
            alt="Porsche Carrera"
            description="A symbol of luxury and performance. This image captures the Porsche Carrera, a symbol of luxury and performance, standing tall and proud in the face of adversity, embodying the spirit of Japan."
          />
          <ProductCard
            id="11"
            name="Hiroshima Fishing Boat"
            price={89.99}
            imageUrl="/products/11 Hiroshima Fishing Boat.jpg"
            alt="Hiroshima Fishing Boat"
            description="A symbol of tradition and culture. This image captures the Hiroshima Fishing Boat, a traditional Japanese wooden boat that stands at the entrance to the city, symbolising the spirit of tradition and culture."
          />
          <ProductCard
            id="12"
            name="Kinkaku-ji Golden Pavilion"
            price={99.99}
            imageUrl="/products/12 Kinkakuji Temple.jpg"
            alt="Kinkaku-ji Golden Pavilion"
            description="A symbol of beauty and elegance. This image captures the Kinkaku-ji Golden Pavilion, a symbol of beauty and elegance, standing tall and proud in the face of adversity, embodying the spirit of Japan."
          />
        </div>
      </div>
    </main>
  );
}

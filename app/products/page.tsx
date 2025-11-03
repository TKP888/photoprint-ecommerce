export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  const productId = params.id;

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <h1>Product: {productId}</h1>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <img
              src={`/products/${productId}.jpg`}
              alt="Product image"
              className="w-full rounded-lg"
            />
          </div>

          <div>
            <h2 className="text-3xl font-bold mb-4">Product Name</h2>
            <p className="text-xl font-semibold mb-4">£29.99</p>
            <button className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600">
              Add to Cart
            </button>
            <p className="mt-4">Product description...</p>
          </div>
        </div>
      </div>
      <div className="container mx-auto py-12 px-4">
        <h1 className="text-2xl font-bold mb-8">More Products</h1>

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

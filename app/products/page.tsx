export default function ProductDetailPage({
  params,
}: {
  params: { id: string };
}) {
  // params.id will be "fuji", "shibuya", etc.
  const productId = params.id;

  // Later: Fetch product data from Supabase using this ID

  return (
    <main className="py-8">
      <div className="container mx-auto px-4">
        <h1>Product: {productId}</h1>

        {/* Product details will go here */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Product image */}
          <div>
            <img
              src={`/products/${productId}.jpg`}
              alt="Product image"
              className="w-full rounded-lg"
            />
          </div>

          {/* Product info */}
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
    </main>
  );
}

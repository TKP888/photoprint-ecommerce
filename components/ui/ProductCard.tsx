interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
}: ProductCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
      <img src={imageUrl} alt={name} className="w-full h-48 object-cover" />
      <div className="p-4">
        <h3 className="text-lg text-gray-800 font-semibold mb-2">{name}</h3>
        {description && (
          <p className="text-gray-600 text-sm mb-3 overflow-hidden line-clamp-3">
            {description}
          </p>
        )}
        <div className="flex justify-between items-center">
          <span className="text-2xl font-bold text-blue-600">£{price}</span>
          <button className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 transition-colors">
            Add to Cart
          </button>
        </div>
      </div>
    </div>
  );
}

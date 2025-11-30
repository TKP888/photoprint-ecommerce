"use client";

import Link from "next/link";
import { useCart } from "@/components/cart/CartContext";

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description?: string;
  stock?: number | null;
  stockQuantity?: number | null;
}

export default function ProductCard({
  id,
  name,
  price,
  imageUrl,
  description,
  stock,
  stockQuantity,
}: ProductCardProps) {
  const { addToCart, items } = useCart();

  const currentStock =
    stock !== null && stock !== undefined
      ? stock
      : stockQuantity !== null && stockQuantity !== undefined
      ? stockQuantity
      : null;

  const isSoldOut = currentStock !== null && currentStock <= 0;

  const cartItem = items.find((item) => item.id === id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const isAtMaxStock = currentStock !== null && cartQuantity >= currentStock;

  const handleAddToCart = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut || isAtMaxStock) return;

    addToCart({
      id,
      name,
      price,
      imageUrl,
      stock: currentStock,
    });
  };

  const handleLinkClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    const target = e.target as HTMLElement;
    if (target.closest("button")) {
      e.preventDefault();
    }
  };

  return (
    <Link href={`/product/${id}`} className="block" onClick={handleLinkClick}>
      <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
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
            {isSoldOut ? (
              <button
                type="button"
                disabled
                className="bg-gray-600 text-white font-bold px-4 py-2 rounded cursor-not-allowed"
              >
                Sold Out
              </button>
            ) : isAtMaxStock ? (
              <button
                type="button"
                disabled
                className="bg-gray-600 text-white font-bold px-4 py-2 rounded cursor-not-allowed text-xs"
              >
                Max Qty
              </button>
            ) : (
              <button
                type="button"
                onClick={handleAddToCart}
                className="bg-blue-500 text-white font-bold px-4 py-2 rounded hover:bg-blue-600 transition-colors cursor-pointer"
              >
                Add to Cart
              </button>
            )}
          </div>
        </div>
      </div>
    </Link>
  );
}

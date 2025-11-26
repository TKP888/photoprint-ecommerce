"use client";

import { useCart } from "@/components/cart/CartContext";

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  stock?: number | null;
  stockQuantity?: number | null;
}

export default function AddToCartButton({
  id,
  name,
  price,
  imageUrl,
  stock,
  stockQuantity,
}: AddToCartButtonProps) {
  const { addToCart, items } = useCart();

  // Determine stock value (prefer stock, fallback to stockQuantity)
  const currentStock =
    stock !== null && stock !== undefined
      ? stock
      : stockQuantity !== null && stockQuantity !== undefined
      ? stockQuantity
      : null;

  const isSoldOut = currentStock !== null && currentStock <= 0;

  // Check current cart quantity
  const cartItem = items.find((item) => item.id === id);
  const cartQuantity = cartItem ? cartItem.quantity : 0;
  const isAtMaxStock = currentStock !== null && cartQuantity >= currentStock;

  const handleAddToCart = () => {
    if (isSoldOut || isAtMaxStock) return;

    addToCart({
      id,
      name,
      price,
      imageUrl,
      stock: currentStock,
    });
  };

  return (
    <>
      {isSoldOut ? (
        <button
          type="button"
          disabled
          className="bg-gray-400 text-white px-8 py-3 rounded-lg cursor-not-allowed text-lg font-semibold"
        >
          Sold Out
        </button>
      ) : isAtMaxStock ? (
        <button
          type="button"
          disabled
          className="bg-gray-400 text-white px-8 py-3 rounded-lg cursor-not-allowed text-lg font-semibold"
        >
          Max Quantity Reached
        </button>
      ) : (
        <button
          type="button"
          onClick={handleAddToCart}
          className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold cursor-pointer"
        >
          Add to Cart
        </button>
      )}
    </>
  );
}

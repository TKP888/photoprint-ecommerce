"use client";

import { useCart } from "@/components/cart/CartContext";

interface AddToCartButtonProps {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
}

export default function AddToCartButton({
  id,
  name,
  price,
  imageUrl,
}: AddToCartButtonProps) {
  const { addToCart } = useCart();

  const handleAddToCart = () => {
    addToCart({
      id,
      name,
      price,
      imageUrl,
    });
  };

  return (
    <button
      onClick={handleAddToCart}
      className="bg-blue-500 text-white px-8 py-3 rounded-lg hover:bg-blue-600 transition-colors text-lg font-semibold"
    >
      Add to Cart
    </button>
  );
}


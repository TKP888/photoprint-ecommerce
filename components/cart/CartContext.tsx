"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import Toast from "@/components/ui/Toast";

export interface CartItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  quantity: number;
  stock: number | null;
}

interface ToastState {
  show: boolean;
  productName: string;
  productImage: string;
  isError?: boolean;
  message?: string;
}

interface CartContextType {
  items: CartItem[];
  addToCart: (item: Omit<CartItem, "quantity"> & { stock?: number | null }) => void;
  removeFromCart: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalPrice: () => number;
  getTotalItems: () => number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function useCart() {
  const context = useContext(CartContext);
  if (context === undefined) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return context;
}

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [toast, setToast] = useState<ToastState>({
    show: false,
    productName: "",
    productImage: "",
    isError: false,
    message: undefined,
  });

  useEffect(() => {
    const savedCart = localStorage.getItem("cart");
    if (savedCart) {
      try {
        const parsedItems = JSON.parse(savedCart);
        // Migrate old cart items that don't have stock field
        const migratedItems = parsedItems.map((item: CartItem) => ({
          ...item,
          stock: item.stock ?? null,
        }));
        setItems(migratedItems);
      } catch (error) {
        console.error("Error loading cart from localStorage:", error);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem("cart", JSON.stringify(items));
    }
  }, [items, isLoaded]);

  const addToCart = (item: Omit<CartItem, "quantity"> & { stock?: number | null }) => {
    const stock = item.stock ?? null;
    let shouldShowError = false;
    
    setItems((prevItems) => {
      const existingItem = prevItems.find((i) => i.id === item.id);
      const currentQuantity = existingItem ? existingItem.quantity : 0;
      const newQuantity = currentQuantity + 1;

      // Validate stock limit
      if (stock !== null && newQuantity > stock) {
        shouldShowError = true;
        return prevItems; // Don't update cart
      }

      if (existingItem) {
        return prevItems.map((i) =>
          i.id === item.id ? { ...i, quantity: newQuantity, stock } : i
        );
      } else {
        return [...prevItems, { ...item, quantity: 1, stock }];
      }
    });

    // Show toast notification
    if (shouldShowError) {
      setToast({
        show: true,
        productName: item.name,
        productImage: item.imageUrl,
        isError: true,
        message: `Only ${stock} available in stock`,
      });
    } else {
      setToast({
        show: true,
        productName: item.name,
        productImage: item.imageUrl,
        isError: false,
        message: "Added to cart",
      });
    }
  };

  const closeToast = () => {
    setToast({ show: false, productName: "", productImage: "" });
  };

  const removeFromCart = (id: string) => {
    setItems((prevItems) => prevItems.filter((i) => i.id !== id));
  };

  const updateQuantity = (id: string, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(id);
      return;
    }
    
    setItems((prevItems) => {
      const item = prevItems.find((i) => i.id === id);
      if (!item) return prevItems;

      // Validate stock limit
      if (item.stock !== null && quantity > item.stock) {
        // Cap at stock limit and show error toast
        const cappedQuantity = item.stock;
        setToast({
          show: true,
          productName: item.name,
          productImage: item.imageUrl,
          isError: true,
          message: `Only ${item.stock} available in stock`,
        });
        return prevItems.map((i) =>
          i.id === id ? { ...i, quantity: cappedQuantity } : i
        );
      }

      return prevItems.map((i) => (i.id === id ? { ...i, quantity } : i));
    });
  };

  const clearCart = () => {
    setItems([]);
  };

  const getTotalPrice = () => {
    return items.reduce((total, item) => total + item.price * item.quantity, 0);
  };

  const getTotalItems = () => {
    return items.reduce((total, item) => total + item.quantity, 0);
  };

  const value: CartContextType = {
    items,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getTotalPrice,
    getTotalItems,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
      {toast.show && (
        <Toast
          message={toast.message || (toast.isError ? "Stock limit reached" : "Added to cart")}
          productName={toast.productName}
          productImage={toast.productImage}
          onClose={closeToast}
          duration={3000}
          isError={toast.isError}
        />
      )}
    </CartContext.Provider>
  );
}

import { renderHook, act } from "@testing-library/react";
import { CartProvider, useCart } from "./CartContext";
import React from "react";

const wrapper = ({ children }: { children: React.ReactNode }) => (
  <CartProvider>{children}</CartProvider>
);

describe("CartContext", () => {
  beforeEach(() => {
    localStorage.clear();
  });

  it("adds item to cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 10,
      });
    });

    expect(result.current.items).toHaveLength(1);
    expect(result.current.items[0]).toMatchObject({
      id: "1",
      name: "Test Product",
      price: 29.99,
      quantity: 1,
    });
  });

  it("increments quantity when adding same item again", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 10,
      });
    });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 10,
      });
    });

    expect(result.current.items[0].quantity).toBe(2);
  });

  it("removes item from cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
      });
    });

    act(() => {
      result.current.removeFromCart("1");
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("updates item quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 10,
      });
    });

    act(() => {
      result.current.updateQuantity("1", 3);
    });

    expect(result.current.items[0].quantity).toBe(3);
  });

  it("removes item when quantity is set to 0", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
      });
    });

    act(() => {
      result.current.updateQuantity("1", 0);
    });

    expect(result.current.items).toHaveLength(0);
  });

  it("prevents adding more than stock quantity", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 2,
      });
    });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 2,
      });
    });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 2,
      });
    });

    expect(result.current.items[0].quantity).toBe(2);
  });

  it("caps quantity at stock limit when updating", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Test Product",
        price: 29.99,
        imageUrl: "/test.jpg",
        stock: 3,
      });
    });

    act(() => {
      result.current.updateQuantity("1", 5);
    });

    expect(result.current.items[0].quantity).toBe(3);
  });

  it("calculates total price correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Product 1",
        price: 10,
        imageUrl: "/test1.jpg",
      });
    });

    act(() => {
      result.current.addToCart({
        id: "2",
        name: "Product 2",
        price: 20,
        imageUrl: "/test2.jpg",
      });
    });

    act(() => {
      result.current.updateQuantity("1", 2);
    });

    expect(result.current.getTotalPrice()).toBe(40);
  });

  it("calculates total items correctly", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Product 1",
        price: 10,
        imageUrl: "/test1.jpg",
      });
    });

    act(() => {
      result.current.addToCart({
        id: "2",
        name: "Product 2",
        price: 20,
        imageUrl: "/test2.jpg",
      });
    });

    act(() => {
      result.current.updateQuantity("1", 3);
    });

    expect(result.current.getTotalItems()).toBe(4);
  });

  it("clears cart", () => {
    const { result } = renderHook(() => useCart(), { wrapper });

    act(() => {
      result.current.addToCart({
        id: "1",
        name: "Product 1",
        price: 10,
        imageUrl: "/test1.jpg",
      });
    });

    act(() => {
      result.current.addToCart({
        id: "2",
        name: "Product 2",
        price: 20,
        imageUrl: "/test2.jpg",
      });
    });

    act(() => {
      result.current.clearCart();
    });

    expect(result.current.items).toHaveLength(0);
    expect(result.current.getTotalPrice()).toBe(0);
    expect(result.current.getTotalItems()).toBe(0);
  });
});


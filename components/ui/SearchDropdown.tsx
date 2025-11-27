"use client";

import { useEffect, useState, useRef } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import Image from "next/image";

interface Product {
  id: string;
  name: string;
  price: number;
  image_url: string;
  description?: string | null;
}

interface SearchDropdownProps {
  searchQuery: string;
  isOpen: boolean;
  onClose: () => void;
  onSelectProduct?: () => void;
}

export default function SearchDropdown({
  searchQuery,
  isOpen,
  onClose,
  onSelectProduct,
}: SearchDropdownProps) {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [selectedIndex, setSelectedIndex] = useState(-1);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  const router = useRouter();

  // Debounced search
  useEffect(() => {
    // Clear previous timer
    if (debounceTimerRef.current) {
      clearTimeout(debounceTimerRef.current);
    }

    // Don't search if query is too short or dropdown is closed
    if (!isOpen || searchQuery.trim().length < 2) {
      setProducts([]);
      setError(null);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    setError(null);

    // Debounce the search
    debounceTimerRef.current = setTimeout(async () => {
      try {
        const response = await fetch(
          `/api/search?q=${encodeURIComponent(searchQuery.trim())}`
        );

        if (!response.ok) {
          throw new Error("Failed to search products");
        }

        const data = await response.json();
        setProducts(data.products || []);
      } catch (err) {
        console.error("Search error:", err);
        setError("Failed to load search results");
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }, 300);

    // Cleanup
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, [searchQuery, isOpen]);

  // Reset selected index when products change
  useEffect(() => {
    setSelectedIndex(-1);
  }, [products]);

  // Handle keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowDown") {
        e.preventDefault();
        setSelectedIndex((prev) =>
          prev < products.length - 1 ? prev + 1 : prev
        );
      } else if (e.key === "ArrowUp") {
        e.preventDefault();
        setSelectedIndex((prev) => (prev > 0 ? prev - 1 : -1));
      } else if (e.key === "Escape") {
        e.preventDefault();
        onClose();
      } else if (e.key === "Enter" && selectedIndex >= 0) {
        e.preventDefault();
        const selectedProduct = products[selectedIndex];
        if (selectedProduct) {
          router.push(`/product/${selectedProduct.id}`);
          onSelectProduct?.();
        }
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isOpen, products, selectedIndex, onClose, onSelectProduct]);

  // Handle click outside
  useEffect(() => {
    if (!isOpen) return;

    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      
      // Don't close if clicking on the search input or within the dropdown
      if (
        target.closest('input[type="text"][placeholder="Search products..."]') ||
        target.closest('[data-search-dropdown]') ||
        (dropdownRef.current && dropdownRef.current.contains(target))
      ) {
        return;
      }
      
      // Close dropdown when clicking outside
      onClose();
    };

    // Use a small delay to avoid closing immediately when clicking
    const timeoutId = setTimeout(() => {
      document.addEventListener("mousedown", handleClickOutside);
    }, 100);

    return () => {
      clearTimeout(timeoutId);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen, onClose]);

  if (!isOpen || searchQuery.trim().length < 2) {
    return null;
  }

  const handleProductClick = () => {
    onSelectProduct?.();
    onClose();
  };

  return (
    <div
      ref={dropdownRef}
      className="absolute top-full left-0 w-full md:w-64 mt-2 bg-white rounded-lg shadow-xl border border-gray-200 z-50 max-h-96 overflow-y-auto"
    >
      {isLoading && (
        <div className="p-6 text-center text-gray-500">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
          <p className="mt-2 text-sm">Searching...</p>
        </div>
      )}

      {error && !isLoading && (
        <div className="p-6 text-center text-red-500 text-sm">{error}</div>
      )}

      {!isLoading && !error && products.length === 0 && (
        <div className="p-6 text-center text-gray-500 text-sm">
          No products found for &quot;{searchQuery}&quot;
        </div>
      )}

      {!isLoading && !error && products.length > 0 && (
        <div className="py-2">
          {products.map((product, index) => (
            <Link
              key={product.id}
              href={`/product/${product.id}`}
              onClick={handleProductClick}
              className={`block px-4 py-3 hover:bg-gray-50 transition-colors ${
                index === selectedIndex ? "bg-gray-50" : ""
              }`}
            >
              <div className="flex items-center gap-4">
                <div className="relative w-16 h-16 flex-shrink-0 bg-gray-100 rounded overflow-hidden">
                  <Image
                    src={product.image_url}
                    alt={product.name}
                    fill
                    className="object-cover"
                  />
                </div>
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-semibold text-gray-800 truncate">
                    {product.name}
                  </h3>
                  {product.description && (
                    <p className="text-xs text-gray-500 truncate mt-1">
                      {product.description}
                    </p>
                  )}
                  <p className="text-sm font-bold text-blue-600 mt-1">
                    £{product.price.toFixed(2)}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
}


"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useState, useEffect, useTransition, useMemo } from "react";

export default function ProductFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [isPending, startTransition] = useTransition();

  // Applied filters (from URL)
  const appliedMinPrice = searchParams.get("minPrice") || "";
  const appliedMaxPrice = searchParams.get("maxPrice") || "";
  const appliedInStock = searchParams.get("inStock") === "true";
  const appliedSort = searchParams.get("sort") || "name_asc";

  // Local state (what user is currently selecting)
  const [minPrice, setMinPrice] = useState(appliedMinPrice);
  const [maxPrice, setMaxPrice] = useState(appliedMaxPrice);
  const [inStock, setInStock] = useState(appliedInStock);
  const [sort, setSort] = useState(appliedSort);

  // Sync local state when URL params change externally
  useEffect(() => {
    setMinPrice(appliedMinPrice);
    setMaxPrice(appliedMaxPrice);
    setInStock(appliedInStock);
    setSort(appliedSort);
  }, [appliedMinPrice, appliedMaxPrice, appliedInStock, appliedSort]);

  // Check if there are pending changes (local state differs from applied state)
  const hasPendingChanges = useMemo(() => {
    return (
      minPrice !== appliedMinPrice ||
      maxPrice !== appliedMaxPrice ||
      inStock !== appliedInStock ||
      sort !== appliedSort
    );
  }, [
    minPrice,
    maxPrice,
    inStock,
    sort,
    appliedMinPrice,
    appliedMaxPrice,
    appliedInStock,
    appliedSort,
  ]);

  const applyFilters = () => {
    startTransition(() => {
      const params = new URLSearchParams();

      // Preserve search query if it exists
      const search = searchParams.get("search");
      if (search) params.set("search", search);

      // Add filters
      if (minPrice) params.set("minPrice", minPrice);
      if (maxPrice) params.set("maxPrice", maxPrice);
      if (inStock) params.set("inStock", "true");
      if (sort && sort !== "name_asc") params.set("sort", sort);

      // Use replace instead of push to avoid adding to history and improve performance
      router.replace(`/product?${params.toString()}`);
    });
  };

  const clearFilters = () => {
    startTransition(() => {
      // Reset local state
      setMinPrice("");
      setMaxPrice("");
      setInStock(false);
      setSort("name_asc");

      // Clear URL params
      const params = new URLSearchParams();
      const search = searchParams.get("search");
      if (search) params.set("search", search);
      router.replace(`/product?${params.toString()}`);
    });
  };

  const hasActiveFilters =
    appliedMinPrice ||
    appliedMaxPrice ||
    appliedInStock ||
    (appliedSort && appliedSort !== "name_asc");

  return (
    <div className="bg-white rounded-lg shadow-md p-4 mb-6">
      <div
        className={`flex flex-col md:flex-row md:items-center md:justify-between gap-4 ${
          isPending ? "opacity-75" : ""
        }`}
      >
        {/* Left side - Filters */}
        <div className="flex flex-wrap items-center gap-4 flex-1">
          {/* Price Range */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Price:
            </label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                min="0"
                step="1"
                value={minPrice}
                onChange={(e) => setMinPrice(e.target.value)}
                placeholder="Min"
                className={`w-20 px-2 py-1.5 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm ${
                  minPrice !== appliedMinPrice
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300"
                }`}
              />
              <span className="text-gray-500">-</span>
              <input
                type="number"
                min="0"
                step="1"
                value={maxPrice}
                onChange={(e) => setMaxPrice(e.target.value)}
                placeholder="Max"
                className={`w-20 px-2 py-1.5 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 text-sm ${
                  maxPrice !== appliedMaxPrice
                    ? "border-blue-400 bg-blue-50"
                    : "border-gray-300"
                }`}
              />
            </div>
          </div>

          {/* Stock Filter */}
          <div className="flex items-center">
            <label className="flex items-center cursor-pointer">
              <input
                type="checkbox"
                checked={inStock}
                onChange={(e) => setInStock(e.target.checked)}
                className={`mr-2 w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500 ${
                  inStock !== appliedInStock ? "border-blue-400" : ""
                }`}
              />
              <span className="text-sm text-gray-700">In stock only</span>
            </label>
          </div>

          {/* Sort */}
          <div className="flex items-center gap-2">
            <label className="text-sm font-medium text-gray-700 whitespace-nowrap">
              Sort:
            </label>
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              disabled={isPending}
              className={`px-3 py-1.5 border rounded focus:ring-2 focus:ring-blue-500 focus:border-transparent text-gray-800 bg-white text-sm disabled:opacity-50 disabled:cursor-wait ${
                sort !== appliedSort
                  ? "border-blue-400 bg-blue-50"
                  : "border-gray-300"
              }`}
            >
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
              <option value="price_asc">Price (Low to High)</option>
              <option value="price_desc">Price (High to Low)</option>
              <option value="newest">Newest First</option>
            </select>
          </div>
        </div>

        {/* Right side - Action buttons */}
        <div className="flex items-center gap-3">
          {hasPendingChanges && (
            <button
              onClick={applyFilters}
              disabled={isPending}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg font-semibold text-sm transition-colors disabled:opacity-50 disabled:cursor-wait whitespace-nowrap"
            >
              {isPending ? "Applying..." : "Apply Filters"}
            </button>
          )}
          {hasActiveFilters && (
            <button
              onClick={clearFilters}
              disabled={isPending}
              className="text-sm text-blue-500 hover:text-blue-600 underline whitespace-nowrap disabled:opacity-50"
            >
              Clear all
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

"use client";

import { useEffect, useState } from "react";
import { useRequireAuth } from "@/components/auth/useRequireAuth";
import { createClient } from "@/lib/supabase/client";
import ProductCard from "@/components/ui/ProductCard";
import Link from "next/link";

interface RecentlyViewedItem {
  id: string;
  product_id: string;
  viewed_at: string;
  products: {
    id: string;
    name: string;
    price: number;
    image_url: string;
    description: string | null;
    stock?: number | null;
    stock_quantity?: number | null;
  };
}

export default function RecentlyViewedPage() {
  const { user, loading } = useRequireAuth();
  const [items, setItems] = useState<RecentlyViewedItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (!user) return;

    const fetchRecentlyViewed = async () => {
      const supabase = createClient();

      let { data, error } = await supabase
        .from("recently_viewed")
        .select(
          `
          id,
          product_id,
          viewed_at,
          products (
            id,
            name,
            price,
            image_url,
            description,
            stock
          )
        `
        )
        .eq("user_id", user.id)
        .order("viewed_at", { ascending: false })
        .limit(100);

      if (error) {
        console.warn("Relation query failed, trying separate queries:", error);

        const { data: viewedData, error: viewedError } = await supabase
          .from("recently_viewed")
          .select("id, product_id, viewed_at")
          .eq("user_id", user.id)
          .order("viewed_at", { ascending: false })
          .limit(100);

        if (viewedError) {
          console.error("Error fetching recently viewed:", viewedError);
          console.error("Error details:", {
            message: viewedError.message,
            code: viewedError.code,
            details: viewedError.details,
            hint: viewedError.hint,
          });
          setIsLoading(false);
          return;
        }

        if (viewedData && viewedData.length > 0) {
          const productIds = viewedData.map((item) => item.product_id);
          const { data: productsData, error: productsError } = await supabase
            .from("products")
            .select("id, name, price, image_url, description, stock")
            .in("id", productIds);

          if (productsError) {
            console.error("Error fetching products:", productsError);
            setIsLoading(false);
            return;
          }

          const combinedData = viewedData
            .map((item) => {
              const product = productsData?.find(
                (p) => p.id === item.product_id
              );
              if (!product) return null;
              return {
                ...item,
                products: product,
              };
            })
            .filter((item): item is NonNullable<typeof item> => item !== null);

          data = combinedData as unknown as typeof data;
          error = null;
        } else {
          data = [];
          error = null;
        }
      }

      if (error) {
        console.error("Error fetching recently viewed:", error);
        const errorDetails = error as {
          message?: string;
          code?: string;
          details?: string;
          hint?: string;
        };
        console.error("Error details:", {
          message: errorDetails.message,
          code: errorDetails.code,
          details: errorDetails.details,
          hint: errorDetails.hint,
        });
        setIsLoading(false);
        return;
      }

      console.log("Recently viewed data:", data);
      console.log("Number of items:", data?.length || 0);

      const validItems: RecentlyViewedItem[] = (data || [])
        .filter((item) => {
          return (
            item.products !== null &&
            !Array.isArray(item.products) &&
            typeof item.products === "object"
          );
        })
        .map((item) => ({
          id: item.id,
          product_id: item.product_id,
          viewed_at: item.viewed_at,
          products: item.products as unknown as RecentlyViewedItem["products"],
        }));

      console.log("Valid items after filtering:", validItems.length);

      const deduplicatedItems = validItems.reduce((acc, item) => {
        const existing = acc.find((i) => i.product_id === item.product_id);
        if (!existing) {
          acc.push(item);
        }
        return acc;
      }, [] as RecentlyViewedItem[]);

      console.log("Deduplicated items:", deduplicatedItems.length);
      setItems(deduplicatedItems);
      setIsLoading(false);
    };

    fetchRecentlyViewed();
  }, [user]);

  if (loading || isLoading) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-400">Loading recently viewed items...</p>
      </div>
    );
  }

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600)
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    if (diffInSeconds < 86400)
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    if (diffInSeconds < 604800)
      return `${Math.floor(diffInSeconds / 86400)} days ago`;

    return date.toLocaleDateString("en-GB", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  return (
    <div className="space-y-6">
      <header className="border-b border-gray-700 pb-4">
        <h1 className="text-3xl font-bold text-white">Recently Viewed</h1>
        <p className="text-gray-400 mt-2">
          Products you&apos;ve viewed recently, ordered by most recent
        </p>
      </header>

      {items.length === 0 ? (
        <div className="text-center py-12 bg-gray-900 rounded-lg border border-gray-700">
          <p className="text-gray-400 text-lg mb-4">
            No recently viewed items yet
          </p>
          <Link
            href="/product"
            className="inline-block text-blue-400 hover:text-blue-200"
          >
            Browse products →
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {items.map((item) => (
            <div key={item.id} className="relative">
              <ProductCard
                id={item.products.id}
                name={item.products.name}
                price={item.products.price}
                imageUrl={item.products.image_url}
                description={item.products.description || undefined}
                stock={item.products.stock}
                stockQuantity={item.products.stock_quantity}
              />
              <div className="absolute top-2 right-2 bg-black/70 text-white text-xs px-2 py-1 rounded">
                {formatTimeAgo(item.viewed_at)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

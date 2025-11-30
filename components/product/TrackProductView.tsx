"use client";

import { useEffect } from "react";
import { useAuth } from "@/components/auth/AuthContext";

interface TrackProductViewProps {
  productId: string;
}

export default function TrackProductView({ productId }: TrackProductViewProps) {
  const { user } = useAuth();

  useEffect(() => {
    if (!user || !productId) {
      console.log(
        "TrackProductView: Skipping - user:",
        !!user,
        "productId:",
        productId
      );
      return;
    }

    console.log("TrackProductView: Tracking view for product:", productId);

    fetch("/api/recently-viewed", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ productId }),
    })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) {
          console.error("TrackProductView: API error:", response.status, data);
        } else {
          console.log("TrackProductView: Successfully tracked view");
        }
      })
      .catch((error) => {
        console.error("TrackProductView: Failed to track product view:", error);
      });
  }, [user, productId]);

  return null; // This component doesn't render anything
}

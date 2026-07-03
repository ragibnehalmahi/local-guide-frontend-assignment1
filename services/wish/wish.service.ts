// services/wish/wish.service.ts
"use server";
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface WishlistItem {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: { address?: string; city: string; country: string };
  category: string;
  durationHours: number;
  guide: {
    _id: string;
    name: string;
    rating?: number;
    profilePicture?: string;
  };
  active: boolean;
  availableDates: string[];
  createdAt: string;
  updatedAt: string;
}

// ✅ Add to wishlist
export async function addToWishlist(tourId: string) {
  try {
    const response = await serverFetch.post(`/users/wishlist`, {
      body: JSON.stringify({ tourId }),
    });
    const result = await response.json();
    if (result.success) {
      revalidateTag("wishlist", { expire: 0 });
      revalidateTag("user-profile", { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Add error:", error);
    return { success: false, message: error.message || "Failed to add" };
  }
}

// ✅ Remove from wishlist
export async function removeFromWishlist(tourId: string) {
  try {
    const response = await serverFetch.delete(`/users/wishlist/${tourId}`);
    const result = await response.json();
    if (result.success) {
      revalidateTag("wishlist", { expire: 0 });
      revalidateTag("user-profile", { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Remove error:", error);
    return { success: false, message: error.message || "Failed to remove" };
  }
}

// 🔥 NEW: Direct wishlist fetch using dedicated endpoint
export async function getWishlist(): Promise<WishlistItem[]> {
  try {
    const response = await serverFetch.get("/users/wishlist", {
      next: { tags: ["wishlist"], revalidate: 0 },
      cache: "no-store",
    });
    const result = await response.json();
    console.log("✅ [getWishlist] Fetched", result.data?.length || 0, "items");
    return result.data || [];
  } catch (error: any) {
    console.error("❌ [getWishlist] Error:", error);
    return [];
  }
}
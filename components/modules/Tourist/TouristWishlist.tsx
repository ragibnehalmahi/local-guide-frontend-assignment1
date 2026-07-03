//  src/components/modules/Tourist/TouristWishlist.tsx
"use client";

import { useState, useEffect, useCallback } from "react";
import { Heart, MapPin, Users, DollarSign, Trash2, Calendar, RefreshCw, AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { getWishlist, removeFromWishlist, WishlistItem } from "@/services/wish/wish.service";
import { toast } from "sonner";

export default function TouristWishlist() {
  const [tours, setTours] = useState<WishlistItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [removingId, setRemovingId] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchWishlist = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const items = await getWishlist();
      console.log("🔥 [TouristWishlist] Items fetched:", items);
      setTours(items);
    } catch (err: any) {
      console.error("🔥 [TouristWishlist] Error:", err);
      setError("Failed to load wishlist. Please try again.");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  // Auto-refresh when tab becomes visible
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.visibilityState === "visible") {
        fetchWishlist();
      }
    };
    document.addEventListener("visibilitychange", handleVisibilityChange);
    return () => document.removeEventListener("visibilitychange", handleVisibilityChange);
  }, [fetchWishlist]);

  const handleRemove = async (tourId: string) => {
    setRemovingId(tourId);
    const res = await removeFromWishlist(tourId);
    if (res.success) {
      toast.success("Removed from wishlist");
      setTours((prev) => prev.filter((t) => t._id !== tourId));
      fetchWishlist(); // re-fetch for consistency
    } else {
      toast.error(res.message || "Failed to remove");
    }
    setRemovingId(null);
  };

  const handleRefresh = () => {
    setRefreshing(true);
    fetchWishlist().finally(() => setRefreshing(false));
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-12">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
        <p className="text-muted-foreground mt-4">Loading wishlist...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <AlertCircle className="h-12 w-12 text-red-500 mx-auto mb-4" />
        <h3 className="text-lg font-semibold mb-2">Something went wrong</h3>
        <p className="text-gray-600 mb-4">{error}</p>
        <Button onClick={handleRefresh}>Retry</Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">My Wishlist</h1>
          <p className="text-gray-600">Tours you've saved for later</p>
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={handleRefresh}
          disabled={refreshing}
          className="gap-2"
        >
          <RefreshCw className={`h-4 w-4 ${refreshing ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {tours.length === 0 ? (
        <Card>
          <CardContent className="text-center py-12">
            <Heart className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">Your wishlist is empty</h3>
            <p className="text-gray-600 mb-4">Start exploring and add tours to your wishlist!</p>
            <Button asChild>
              <Link href="/tourist/dashboard/listings">Browse Tours</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {tours.map((tour) => (
            <Card key={tour._id} className="hover:shadow-lg transition-shadow">
              <CardContent className="p-0">
                <div className="aspect-video relative">
                  <img
                    src={tour.images?.[0] || "/placeholder.jpg"}
                    alt={tour.title}
                    className="w-full h-full object-cover rounded-t-lg"
                  />
                  <Badge className="absolute top-3 left-3">{tour.category}</Badge>
                  <Button
                    size="icon"
                    variant="destructive"
                    className="absolute top-3 right-3 bg-white/90 hover:bg-white"
                    onClick={() => handleRemove(tour._id)}
                    disabled={removingId === tour._id}
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
                <div className="p-6">
                  <h3 className="font-bold text-lg mb-2 line-clamp-1">{tour.title}</h3>
                  <p className="text-gray-600 text-sm mb-4 line-clamp-2">{tour.description}</p>
                  <div className="space-y-3 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                      {tour.location?.city}, {tour.location?.country}
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <Users className="h-4 w-4 mr-2 flex-shrink-0" />
                      {tour.durationHours} hours • Guide: {tour.guide?.name}
                    </div>
                  </div>
                  <div className="flex items-center justify-between pt-4 border-t">
                    <div className="text-2xl font-bold">
                      <DollarSign className="inline h-5 w-5" />
                      {tour.price}
                    </div>
                    <div className="flex gap-2">
                      <Button size="sm" variant="outline" asChild>
                        <Link href={`/tourist/dashboard/listings/${tour._id}`}>Details</Link>
                      </Button>
                      <Button size="sm" asChild>
                        <Link href={`/tourist/dashboard/listings/${tour._id}`}>
                          <Calendar className="h-4 w-4 mr-2" />
                          Book Now
                        </Link>
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}

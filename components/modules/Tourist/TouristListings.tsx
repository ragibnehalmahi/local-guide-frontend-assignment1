// local-guide-frontend/my-app/components/modules/Tourist/TouristListings.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, MapPin, DollarSign, Heart } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { toast } from "sonner";
import { useAuth } from "@/context/AuthContext";
import { addToWishlist, removeFromWishlist } from "@/services/wish/wish.service";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  images: string[];
  location: {
    city: string;
    country: string;
  };
  category: string;
  durationHours: number;
  guide: {
    name: string;
  };
}

interface TouristListingsProps {
  listings: Listing[];
  meta?: any;
}

export default function TouristListings({ listings, meta }: TouristListingsProps) {
  const router = useRouter();
  const { user, isLoading, updateUser } = useAuth();
  const [filters, setFilters] = useState({
    search: "",
    city: "",
    minPrice: "",
    maxPrice: "",
    category: "",
  });
  const [wishlistLoading, setWishlistLoading] = useState<string | null>(null);

  const handleSearch = () => {
    const params = new URLSearchParams();
    if (filters.search) params.set("search", filters.search);
    if (filters.city) params.set("city", filters.city);
    if (filters.minPrice) params.set("minPrice", filters.minPrice);
    if (filters.maxPrice) params.set("maxPrice", filters.maxPrice);
    if (filters.category) params.set("category", filters.category);
    router.push(`/tourist/dashboard/listings?${params.toString()}`);
  };

  const handleWishlistToggle = async (tourId: string) => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    setWishlistLoading(tourId);
    try {
      // Check if already in wishlist
      const isInWishlist = user.wishlist?.includes(tourId) || false;
      let res;
      if (isInWishlist) {
        res = await removeFromWishlist(tourId);
        if (res.success) {
          toast.success("Removed from wishlist");
          // Update user context with new wishlist
          const newWishlist = res.data?.wishlist || user.wishlist?.filter(id => id !== tourId) || [];
          updateUser({ wishlist: newWishlist });
        } else {
          toast.error(res.message || "Failed to remove");
        }
      } else {
        res = await addToWishlist(tourId);
        if (res.success) {
          toast.success("Added to wishlist");
          const newWishlist = res.data?.wishlist || [...(user.wishlist || []), tourId];
          updateUser({ wishlist: newWishlist });
        } else {
          toast.error(res.message || "Failed to add");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(null);
    }
  };

  const isListingInWishlist = (listingId: string) => {
    if (!user?.wishlist) return false;
    return user.wishlist.includes(listingId);
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold">Browse Tours</h1>
        <p className="text-gray-600">Find amazing local experiences</p>
      </div>

      {/* Search Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <label className="text-sm font-medium mb-2 block">Search</label>
                <Input
                  placeholder="Search tours..."
                  value={filters.search}
                  onChange={(e) => setFilters({ ...filters, search: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">City</label>
                <Input
                  placeholder="Enter city"
                  value={filters.city}
                  onChange={(e) => setFilters({ ...filters, city: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Min Price</label>
                <Input
                  type="number"
                  placeholder="$0"
                  value={filters.minPrice}
                  onChange={(e) => setFilters({ ...filters, minPrice: e.target.value })}
                />
              </div>
              <div>
                <label className="text-sm font-medium mb-2 block">Max Price</label>
                <Input
                  type="number"
                  placeholder="$1000"
                  value={filters.maxPrice}
                  onChange={(e) => setFilters({ ...filters, maxPrice: e.target.value })}
                />
              </div>
            </div>
            <Button onClick={handleSearch} className="w-full md:w-auto">
              <Search className="mr-2 h-4 w-4" />
              Search Tours
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      {listings.length === 0 ? (
        <div className="text-center py-12">
          <Search className="h-12 w-12 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold mb-2">No tours found</h3>
          <p className="text-gray-600 mb-4">Try adjusting your search filters</p>
          <Button onClick={() => {
            setFilters({ search: "", city: "", minPrice: "", maxPrice: "", category: "" });
            router.push("/tourist/dashboard/listings");
          }}>
            Clear Filters
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {listings.map((listing) => {
              const inWishlist = isListingInWishlist(listing._id);
              return (
                <Card key={listing._id} className="hover:shadow-lg transition-shadow">
                  <CardContent className="p-0">
                    <div className="aspect-video relative">
                      <img
                        src={listing.images?.[0] || "/placeholder.jpg"}
                        alt={listing.title}
                        className="w-full h-full object-cover rounded-t-lg"
                      />
                      <Badge className="absolute top-3 left-3">{listing.category}</Badge>
                      <Button
                        size="icon"
                        variant="ghost"
                        className="absolute top-3 right-3 bg-white/80 hover:bg-white"
                        onClick={() => handleWishlistToggle(listing._id)}
                        disabled={isLoading || wishlistLoading === listing._id}
                      >
                        <Heart
                          className={`h-4 w-4 ${inWishlist ? "fill-red-500 text-red-500" : ""}`}
                        />
                      </Button>
                    </div>
                    <div className="p-6">
                      <h3 className="font-bold text-lg mb-2 line-clamp-1">{listing.title}</h3>
                      <p className="text-gray-600 text-sm mb-4 line-clamp-2">{listing.description}</p>
                      <div className="space-y-3 mb-4">
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="h-4 w-4 mr-2 flex-shrink-0" />
                          {listing?.location?.city || "Unknown City"}, {listing?.location?.country || "Unknown Country"}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span className="mr-2">Guide:</span>
                          {listing?.guide?.name || "No guide assigned"}
                        </div>
                        <div className="flex items-center text-sm text-gray-600">
                          <span>Duration:</span>
                          <span className="font-medium ml-2">{listing.durationHours} hours</span>
                        </div>
                      </div>
                      <div className="flex items-center justify-between pt-4 border-t">
                        <div className="text-2xl font-bold">
                          <DollarSign className="inline h-5 w-5" />
                          {listing.price}
                        </div>
                        <Button asChild>
                          <Link href={`/tourist/dashboard/listings/${listing._id}`}>
                            View Details
                          </Link>
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
          {/* Pagination */}
          {meta && meta.total > meta.limit && (
            <div className="flex justify-center gap-2">
              <Button variant="outline" disabled={meta.page === 1}>
                Previous
              </Button>
              <span className="flex items-center px-4">
                Page {meta.page} of {Math.ceil(meta.total / meta.limit)}
              </span>
              <Button variant="outline" disabled={meta.page >= Math.ceil(meta.total / meta.limit)}>
                Next
              </Button>
            </div>
          )}
        </>
      )}
    </div>
  );
}


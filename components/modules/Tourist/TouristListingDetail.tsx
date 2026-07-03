// local-guide-frontend/my-app/components/modules/Tourist/TouristListingDetail.tsx
"use client";

import { IListing } from "@/types/listing.interface";
import { Calendar, Users, MapPin, Heart, CheckCircle2, ChevronLeft, Share2 } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import BookingForm from "./BookingForm";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAuth } from "@/context/AuthContext";
import { addToWishlist, removeFromWishlist } from "@/services/wish/wish.service";

export default function TouristListingDetail({ listing }: { listing: IListing }) {
  const router = useRouter();
  const { user, updateUser } = useAuth();
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [wishlistLoading, setWishlistLoading] = useState(false);
  const [showBookingForm, setShowBookingForm] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const listingId = listing?._id || listing?.id;

  useEffect(() => {
    if (user?.wishlist && listingId) {
      setIsInWishlist(user.wishlist.includes(listingId));
    }
  }, [user, listingId]);

  const handleWishlistToggle = async () => {
    if (!user) {
      toast.error("Please login to manage wishlist");
      return;
    }
    if (!listingId) {
      toast.error("Invalid listing");
      return;
    }
    setWishlistLoading(true);
    try {
      if (isInWishlist) {
        const res = await removeFromWishlist(listingId);
        if (res.success) {
          toast.success("Removed from wishlist");
          const newWishlist = res.data?.wishlist || user.wishlist?.filter(id => id !== listingId) || [];
          updateUser({ wishlist: newWishlist });
          setIsInWishlist(false);
        } else {
          toast.error(res.message || "Failed to remove");
        }
      } else {
        const res = await addToWishlist(listingId);
        if (res.success) {
          toast.success("Added to wishlist");
          const newWishlist = res.data?.wishlist || [...(user.wishlist || []), listingId];
          updateUser({ wishlist: newWishlist });
          setIsInWishlist(true);
        } else {
          toast.error(res.message || "Failed to add");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setWishlistLoading(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: listing?.title || "Tour Detail",
          text: listing?.description || "",
          url: window.location.href,
        });
      } catch {
        // ignore
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success("Link copied to clipboard");
    }
  };

  if (!listing) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] text-center">
        <h2 className="text-2xl font-bold text-gray-800">Listing not found</h2>
        <p className="text-gray-600 mt-2">The listing you are looking for does not exist or has been removed.</p>
        <Button onClick={() => router.back()} className="mt-6">Go Back</Button>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <Button variant="ghost" onClick={() => router.back()} className="gap-2">
          <ChevronLeft className="h-4 w-4" />
          Back to Listings
        </Button>
        <div className="flex gap-2">
          <Button variant="outline" size="icon" onClick={handleShare}>
            <Share2 className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={handleWishlistToggle}
            disabled={wishlistLoading}
          >
            <Heart className={`h-4 w-4 ${isInWishlist ? "fill-red-500 text-red-500" : ""}`} />
          </Button>
        </div>
      </div>

      <div className="grid lg:grid-cols-3 gap-8">
        {/* Left column: image & details (same as before) */}
        <div className="lg:col-span-2 space-y-6">
          {/* Image Gallery */}
          <div className="space-y-4">
            <div className="rounded-2xl overflow-hidden h-[400px] bg-gray-100">
              <img
                src={listing.images?.[currentImageIndex] || "/placeholder-image.jpg"}
                alt={listing.title || "Tour image"}
                className="w-full h-full object-cover"
              />
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto pb-2">
                {listing.images.map((img, index) => (
                  <button
                    key={index}
                    onClick={() => setCurrentImageIndex(index)}
                    className={`flex-shrink-0 w-24 h-16 rounded-md overflow-hidden border-2 ${currentImageIndex === index ? "border-primary" : "border-transparent"
                      }`}
                  >
                    <img
                      src={img}
                      alt={`${listing.title || "Tour"} ${index + 1}`}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Rest of the content (description, tabs, etc.) – unchanged */}
          <div className="space-y-6">
            <div>
              <div className="flex items-start justify-between mb-4">
                <div>
                  <Badge variant="secondary" className="mb-2">
                    {listing.category || "Tour"}
                  </Badge>
                  <h1 className="text-3xl font-bold">{listing.title || "Untitled Tour"}</h1>
                  <div className="flex items-center gap-4 mt-2 text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <MapPin className="h-4 w-4" />
                      {listing.location?.address || "No address"}, {listing.location?.city || "Unknown city"}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users className="h-4 w-4" />
                      Max {listing.maxGroupSize || "N/A"} people
                    </span>
                    <span className="flex items-center gap-1">
                      <Calendar className="h-4 w-4" />
                      {listing.durationHours || 0} hours
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-primary">
                    ${listing.price || 0}
                    <span className="text-sm font-normal text-muted-foreground"> / person</span>
                  </div>
                  <p className="text-sm text-muted-foreground">+ taxes & fees</p>
                </div>
              </div>
              <Separator />
            </div>

            <Tabs defaultValue="description">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="description">Description</TabsTrigger>
                <TabsTrigger value="itinerary">Itinerary</TabsTrigger>
                <TabsTrigger value="guide">Guide</TabsTrigger>
              </TabsList>
              <TabsContent value="description" className="space-y-4 pt-4">
                <p className="text-muted-foreground leading-relaxed">
                  {listing.description || "No description available."}
                </p>
              </TabsContent>
              <TabsContent value="itinerary" className="space-y-4 pt-4">
                <p className="text-muted-foreground">
                  Detailed itinerary will be shared after booking confirmation.
                </p>
              </TabsContent>
              <TabsContent value="guide" className="space-y-4 pt-4">
                <Card>
                  <CardContent className="pt-6">
                    <div className="flex items-center gap-4">
                      <Avatar className="h-16 w-16">
                        <AvatarImage src={listing.guide?.profilePicture} />
                        <AvatarFallback>{listing.guide?.name?.charAt(0) || "G"}</AvatarFallback>
                      </Avatar>
                      <div>
                        <h3 className="font-bold text-lg">{listing.guide?.name || "Local Guide"}</h3>
                        <p className="text-muted-foreground">Local Guide</p>
                        <div className="flex gap-2 mt-2">
                          <Badge variant="outline">
                            {listing.languages?.join(", ") || "English"}
                          </Badge>
                          {listing.guide?.rating && (
                            <Badge variant="secondary">★ {listing.guide.rating.toFixed(1)}</Badge>
                          )}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>

            <div className="space-y-4">
              <h3 className="text-lg font-semibold">What's Included</h3>
              <div className="grid gap-3">
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Professional local guide</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>All necessary equipment</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Safety briefing and guidance</span>
                </div>
                <div className="flex items-center gap-3">
                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                  <span>Memorable photo opportunities</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Booking Sidebar – unchanged */}
        <div className="lg:col-span-1">
          <div className="sticky top-8">
            {showBookingForm ? (
              <BookingForm listing={listing} onSuccess={() => setShowBookingForm(false)} />
            ) : (
              <Card>
                <CardContent className="pt-6 space-y-6">
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-muted-foreground">Price</span>
                      <span className="text-2xl font-bold text-primary">
                        ${listing.price || 0}
                        <span className="text-sm font-normal"> / person</span>
                      </span>
                    </div>
                    <div className="text-sm text-muted-foreground">
                      • Free cancellation up to 24 hours
                      <br />
                      • Instant confirmation
                      <br />
                      • Mobile ticket
                    </div>
                  </div>
                  <Button onClick={() => setShowBookingForm(true)} className="w-full" size="lg">
                    Book Now
                  </Button>
                  <div className="text-center">
                    <p className="text-sm text-muted-foreground">You won't be charged yet</p>
                  </div>
                  <Separator />
                  <div className="space-y-3">
                    <h4 className="font-semibold">Available Dates</h4>
                    <div className="flex flex-wrap gap-2">
                      {listing.availableDates && listing.availableDates.length > 0 ? (
                        listing.availableDates.slice(0, 3).map((date, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </Badge>
                        ))
                      ) : (
                        <p className="text-sm text-muted-foreground italic">No dates available</p>
                      )}
                      {listing.availableDates && listing.availableDates.length > 3 && (
                        <Badge variant="secondary" className="text-xs">
                          +{listing.availableDates.length - 3} more
                        </Badge>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}


//local-guide-frontend-assignment\local-guide-frontend\my-app\app\(commonLayout)\tours\[id]\page.tsx 

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useParams, useRouter } from "next/navigation";
import Image from "next/image";
import { Loader2, MapPin, Clock, Users, Star, User, Calendar as CalendarIcon, DollarSign } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { getReviewsForGuide } from "@/services/reviews/review.service";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Progress } from "@/components/ui/progress";

export default function TourDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const { id } = params;

  const [tour, setTour] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Booking state
  const [date, setDate] = useState("");
  const [guestCount, setGuestCount] = useState(1);
  const [bookingLoading, setBookingLoading] = useState(false);
  const [reviews, setReviews] = useState<any[]>([]);

  useEffect(() => {
    const fetchTourAndReviews = async () => {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_API_URL}/listings/${id}`);
        const tourData = res.data.data;
        setTour(tourData);

        // Fetch reviews for this guide
        if (tourData.guide?._id) {
          const reviewsRes = await getReviewsForGuide(tourData.guide._id);
          if (reviewsRes.success) {
            setReviews(reviewsRes.data);
          }
        }
      } catch (error) {
        console.error("Error fetching data:", error);
        toast.error("Failed to load tour details.");
      } finally {
        setLoading(false);
      }
    };
    if (id) fetchTourAndReviews();
  }, [id]);

  const handleBooking = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    // Check auth token (assume it's in localStorage or cookie depending on auth-client)
    // For simplicity, we just send request. Axios interceptor or backend should handle Auth.
    setBookingLoading(true);
    try {
      // Typically need auth token. 
      const token = localStorage.getItem("accessToken");

      const payload = {
        listingId: tour._id,
        date: new Date(date).toISOString(),
        guestCount: Number(guestCount)
      };

      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_URL}/bookings`, payload, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (res.data.success) {
        toast.success("Booking request sent successfully!");
        router.push("/tourist/dashboard"); // Redirect to tourist dashboard
      }
    } catch (error: any) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Booking failed. Please login first.");
      if (error?.response?.status === 401) {
        router.push("/login");
      }
    } finally {
      setBookingLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[70vh]">
        <Loader2 className="h-10 w-10 animate-spin text-blue-600" />
      </div>
    );
  }

  if (!tour) {
    return (
      <div className="container mx-auto py-20 text-center">
        <h2 className="text-2xl font-semibold">Tour not found</h2>
        <Button className="mt-4" onClick={() => router.push("/explore")}>Back to Explore</Button>
      </div>
    );
  }

  return (
    <div className="container mx-auto py-10 px-4 md:px-6 mt-16 max-w-6xl">
      <div className="mb-6 flex flex-wrap gap-2 items-center text-sm text-slate-500">
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push("/")}>Home</span>
        <span>/</span>
        <span className="hover:text-blue-600 cursor-pointer" onClick={() => router.push("/explore")}>Explore</span>
        <span>/</span>
        <span className="text-slate-900 font-medium">{tour.title}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2 space-y-8">
          <div>
            <div className="flex flex-wrap gap-3 items-center mb-3">
              <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200 border-none px-3 py-1">
                {tour.category}
              </Badge>
              <div className="flex items-center text-sm font-medium text-slate-700">
                <Star className="w-4 h-4 text-amber-500 mr-1 fill-amber-500" />
                {tour.rating || "New"} ({tour.totalReviews || 0} reviews)
              </div>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-slate-900 mb-4">{tour.title}</h1>
            <div className="flex items-center text-slate-600 mb-6">
              <MapPin className="w-5 h-5 mr-2" />
              <span>{tour.meetingPoint || tour.location?.city || "Location unspecified"}</span>
            </div>
          </div>

          {/* Image Gallery */}
          <div className="rounded-xl overflow-hidden aspect-video relative bg-slate-100 border border-slate-200 shadow-sm">
            {tour.images && tour.images.length > 0 ? (
              <Image
                src={tour.images[0]}
                alt={tour.title}
                fill
                className="object-cover"
                unoptimized
              />
            ) : (
              <div className="flex items-center justify-center h-full">No image available</div>
            )}
          </div>

          {/* Quick Info */}
          <div className="flex flex-wrap gap-6 py-6 border-y border-slate-200">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Clock className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Duration</p>
                <p className="font-semibold text-slate-900">{tour.duration} hours</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600"><Users className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Group Size</p>
                <p className="font-semibold text-slate-900">Up to {tour.maxGroupSize} people</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <div className="p-3 bg-blue-50 rounded-full text-blue-600"><User className="w-5 h-5" /></div>
              <div>
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider">Guide</p>
                <p className="font-semibold text-slate-900">{tour.guide?.name || "Local Guide"}</p>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
            <h2 className="text-2xl font-bold mb-4">About this experience</h2>
            <div className="prose max-w-none text-slate-600 leading-relaxed space-y-4">
              <p>{tour.description}</p>
            </div>
          </div>

          {/* Itinerary if exists */}
          {tour.itinerary && tour.itinerary.length > 0 && (
            <div>
              <h2 className="text-2xl font-bold mb-4">Itinerary</h2>
              <div className="space-y-4">
                {tour.itinerary.map((item: string, index: number) => (
                  <div key={index} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold text-sm">
                        {index + 1}
                      </div>
                      {index < tour.itinerary.length - 1 && <div className="w-px h-full bg-blue-100 my-2"></div>}
                    </div>
                    <div className="pt-1 pb-4">
                      <p className="text-slate-700">{item}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Reviews Section */}
          <div className="pt-10 border-t border-slate-100">
            <div className="flex items-center justify-between mb-8">
              <div>
                <h2 className="text-2xl font-bold text-slate-900">Traveler Reviews</h2>
                <p className="text-slate-500 mt-1">Based on {reviews.length} authenticated experiences</p>
              </div>
              <div className="text-center bg-blue-50 px-6 py-3 rounded-xl border border-blue-100">
                <div className="text-3xl font-bold text-blue-700">{tour.rating?.toFixed(1) || "New"}</div>
                <div className="flex items-center justify-center mt-1">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <Star
                      key={s}
                      className={`w-3 h-3 ${s <= Math.round(tour.rating || 0)
                          ? "fill-yellow-400 text-yellow-400"
                          : "text-slate-200"
                        }`}
                    />
                  ))}
                </div>
              </div>
            </div>

            {reviews.length === 0 ? (
              <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <p className="text-slate-500 italic">No reviews yet. Be the first to experience this!</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 gap-6">
                {reviews.map((review: any) => (
                  <Card key={review._id} className="border-none shadow-none bg-slate-50/50">
                    <CardContent className="p-6">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12 border-2 border-white shadow-sm">
                          <AvatarImage src={review.tourist?.profilePicture} alt={review.tourist?.name} />
                          <AvatarFallback className="bg-blue-100 text-blue-700 font-bold">
                            {review.tourist?.name?.charAt(0).toUpperCase() || "?"}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="font-bold text-slate-900">{review.tourist?.name || "Anonymous Traveler"}</h4>
                            <span className="text-xs text-slate-400 font-medium">
                              {new Date(review.createdAt).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                              })}
                            </span>
                          </div>
                          <div className="flex items-center mb-3">
                            {[1, 2, 3, 4, 5].map((s) => (
                              <Star
                                key={s}
                                className={`w-3.5 h-3.5 ${s <= review.rating
                                    ? "fill-yellow-400 text-yellow-400"
                                    : "text-slate-200 fill-slate-200"
                                  }`}
                              />
                            ))}
                          </div>
                          <p className="text-slate-600 leading-relaxed text-[15px]">
                            {review.comment}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar / Booking Widget */}
        <div className="lg:col-span-1">
          <Card className="sticky top-24 shadow-lg border-slate-200/60 overflow-hidden">
            <div className="bg-slate-900 p-6 text-white">
              <div className="flex items-end gap-1 mb-1">
                <span className="text-3xl font-bold">${tour.price}</span>
                <span className="text-slate-300 mb-1">/ person</span>
              </div>
              <p className="text-sm text-slate-400">Secure your spot today.</p>
            </div>

            <CardContent className="p-6">
              <form onSubmit={handleBooking} className="space-y-5">
                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center text-slate-700">
                    <CalendarIcon className="w-4 h-4 mr-2 text-slate-400" />
                    Select Date
                  </label>
                  <Input
                    type="date"
                    required
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="cursor-pointer"
                  />
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-semibold flex items-center text-slate-700">
                    <Users className="w-4 h-4 mr-2 text-slate-400" />
                    Number of Guests
                  </label>
                  <Input
                    type="number"
                    required
                    min={1}
                    max={tour.maxGroupSize || 20}
                    value={guestCount}
                    onChange={(e) => setGuestCount(Number(e.target.value))}
                  />
                </div>

                <div className="pt-4 border-t border-slate-100">
                  <div className="flex justify-between mb-2 text-sm text-slate-600">
                    <span>${tour.price} x {guestCount} guests</span>
                    <span>${tour.price * guestCount}</span>
                  </div>
                  <div className="flex justify-between font-bold text-lg pt-2 mt-2 border-t border-slate-100">
                    <span>Total</span>
                    <span>${tour.price * guestCount}</span>
                  </div>
                </div>

                <Button
                  type="submit"
                  disabled={bookingLoading}
                  className="w-full mt-2 bg-blue-600 hover:bg-blue-700 h-12 text-base shadow-md transition-all active:scale-[0.98]"
                >
                  {bookingLoading ? <Loader2 className="mr-2 h-5 w-5 animate-spin" /> : null}
                  {bookingLoading ? "Requesting..." : "Request to Book"}
                </Button>
                <p className="text-xs text-center text-slate-500 mt-4">You won't be charged yet.</p>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

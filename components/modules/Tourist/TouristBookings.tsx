// components/modules/Tourist/TouristBookings.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Calendar, 
  MapPin, 
  Users, 
  DollarSign, 
  Eye, 
  X,
  Loader2,
  CreditCard,
  Star
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import Link from "next/link";
import { formatDate } from "@/lib/formatters";
import { serverFetch } from "@/lib/server-fetch";
import { initPayment } from "@/services/payments/payments.service";
import { toast } from "sonner";

interface Booking {
  _id: string;
  tour: {
    title: string;
    location: {
      city: string;
      country: string;
    };
  };
  guide: {
    name: string;
    _id: string;
  };
  date: string;
  guestCount: number;
  totalPrice: number;
  status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
  paymentStatus: "PENDING" | "PAID" | "FAILED";
}

interface TouristBookingsProps {
  bookings: Booking[];
  meta?: any;
}

export default function TouristBookings({ bookings, meta }: TouristBookingsProps) {
  const router = useRouter();
  const [cancellingId, setCancellingId] = useState<string | null>(null);
  const [processingPaymentId, setProcessingPaymentId] = useState<string | null>(null);
  
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [reviewText, setReviewText] = useState("");
  const [rating, setRating] = useState(5);
  const [isSubmittingReview, setIsSubmittingReview] = useState(false);

  // 1. Cancel Booking
  const handleCancelBooking = async (bookingId: string) => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setCancellingId(bookingId);
    try {
      await serverFetch.patch(`/bookings/${bookingId}/cancel`);
      toast.success("Booking cancelled successfully");
      router.refresh();
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      toast.error("Failed to cancel booking");
    } finally {
      setCancellingId(null);
    }
  };

  // 2. Payment Initiation
  const handlePayment = async (bookingId: string) => {
    setProcessingPaymentId(bookingId);
    try {
      const result = await initPayment(bookingId);
      if (result.success && result.data.redirectUrl) {
        window.location.href = result.data.redirectUrl;
      } else {
        toast.error(result.message || "Payment initiation failed");
      }
    } catch (error) {
      console.error("Payment Error:", error);
      toast.error("Something went wrong with payment. Please try again.");
    } finally {
      setProcessingPaymentId(null);
    }
  };

  // 3. Review Submission - Standardized and Safe
  const handleSubmitReview = async () => {
    if (!selectedBooking || !reviewText.trim()) {
      toast.error("Please write a review");
      return;
    }

    console.log("[Review Submission] Sending Payload:", {
        bookingId: selectedBooking._id,
        rating: rating,
        comment: reviewText.trim(),
    });
    
    try {
      const response = await serverFetch.post("/review/", {
        body: JSON.stringify({
          bookingId: selectedBooking._id,
          rating: rating,
          comment: reviewText.trim(),
        }),
      });

      // Handle bad response status before parsing
      if (!response.ok) {
        let errorMsg = `Server Error ${response.status}`;
        try {
          const errorJson = await response.json();
          errorMsg = errorJson.message || errorMsg;
        } catch {
          // If response is not JSON
        }
        throw new Error(errorMsg);
      }

      // Success branch
      const result = await response.json();
      
      if (result.success) {
        toast.success("Review submitted successfully!");
        setSelectedBooking(null);
        setReviewText("");
        setRating(5);
        router.refresh();
      } else {
        toast.error(result.message || "Final review check failed on server");
      }
    } catch (error: any) {
      console.error("[Review Error Trace]", error);
      toast.error(error.message || "Submission failed. Please check network/server logs.");
    } finally {
      setIsSubmittingReview(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "CONFIRMED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">My Bookings</h1>
        <p className="text-gray-600">Manage your tour bookings and payments</p>
      </div>

      {/* Review Modal */}
      {selectedBooking && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl">
            <h3 className="text-xl font-bold mb-4">
              Review Tour: {selectedBooking.tour?.title}
            </h3>
            
            <div className="mb-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="font-medium">Guide: {selectedBooking.guide?.name}</p>
              <p className="text-sm text-gray-600">
                Date: {formatDate(selectedBooking.date)}
              </p>
            </div>

            <div className="mb-4 text-center pb-2 border-b border-slate-100">
              <p className="mb-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">Your Rating</p>
              <div className="flex gap-2 justify-center">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    onClick={() => setRating(star)}
                    className={`text-4xl transition duration-75 hover:scale-110 active:scale-95 ${
                      star <= rating ? "text-amber-400 drop-shadow-sm" : "text-gray-200"
                    }`}
                  >
                    ★
                  </button>
                ))}
              </div>
            </div>

            <div className="mb-6">
              <p className="mb-2 text-sm text-slate-500 uppercase tracking-wider font-semibold">Your Review</p>
              <textarea
                value={reviewText}
                onChange={(e) => setReviewText(e.target.value)}
                placeholder="Share your experience..."
                className="w-full border border-slate-200 rounded-lg p-3 min-h-[120px] focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-slate-700"
              />
            </div>

            <div className="flex gap-3">
              <Button
                onClick={() => setSelectedBooking(null)}
                variant="outline"
                className="flex-1 border-slate-200"
              >
                Cancel
              </Button>
              <Button
                onClick={handleSubmitReview}
                disabled={isSubmittingReview || !reviewText.trim()}
                className="flex-1 bg-blue-600 hover:bg-blue-700 shadow-md transition-all active:translate-y-0.5"
              >
                {isSubmittingReview ? <Loader2 className="animate-spin h-4 w-4" /> : "Submit Review"}
              </Button>
            </div>
          </div>
        </div>
      )}

      {bookings.length === 0 ? (
        <Card className="border-dashed border-2 p-12 text-center bg-slate-50">
          <CardContent>
            <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold mb-2 text-slate-800">No bookings yet</h3>
            <p className="text-slate-500 mb-6 font-medium">Start exploring and book your first tour!</p>
            <Button asChild className="bg-blue-600 hover:bg-blue-700">
              <Link href="/tourist/dashboard/listings">Browse Tours</Link>
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => (
            <Card key={booking._id} className={cn("overflow-hidden hover:shadow-md transition-shadow", booking.status === "COMPLETED" && "border-blue-100")}>
              <CardContent className="p-6">
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                  <div className="flex-1 space-y-3">
                    <div className="flex items-center gap-3">
                      <h3 className="font-bold text-xl text-slate-900">{booking?.tour?.title || "Tour Title"}</h3>
                      <Badge className={`${getStatusColor(booking.status)} border-none shadow-none font-semibold px-3`}>
                        {booking.status}
                      </Badge>
                    </div>
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-2 text-sm text-slate-600">
                      <div className="flex items-center">
                        <MapPin className="h-4 w-4 mr-2 text-slate-400" /> 
                        {booking?.tour?.location?.city}, {booking?.tour?.location?.country}
                      </div>
                      <div className="flex items-center">
                        <Calendar className="h-4 w-4 mr-2 text-slate-400" /> 
                        {booking?.date ? formatDate(booking.date) : "N/A"}
                      </div>
                      <div className="flex items-center">
                        <Users className="h-4 w-4 mr-2 text-slate-400" /> 
                        {booking.guestCount} guests • {booking?.guide?.name}
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-col items-end gap-3 min-w-[200px] border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 text-right">
                    <div className="text-3xl font-extrabold text-slate-900 flex items-center">
                      <DollarSign className="h-6 w-6 text-slate-400" />
                      {booking.totalPrice}
                    </div>
                    
                    <div className="flex flex-wrap justify-end gap-2">
                       {booking.status === "COMPLETED" && (
                         <Button 
                          size="sm" 
                          variant="outline"
                          className="bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100 font-semibold"
                          onClick={() => setSelectedBooking(booking)}
                        >
                          <Star className="h-4 w-4 mr-2 fill-blue-700" />
                          Write Review
                        </Button>
                       )}

                        {booking.status === "CONFIRMED" && booking.paymentStatus !== "PAID" && (
                          <Button 
                            size="sm" 
                            className="bg-emerald-600 hover:bg-emerald-700 shadow-sm"
                            onClick={() => handlePayment(booking._id)}
                            disabled={processingPaymentId === booking._id}
                          >
                            {processingPaymentId === booking._id ? (
                              <Loader2 className="h-4 w-4 mr-1 animate-spin" />
                            ) : (
                              <CreditCard className="h-4 w-4 mr-2" />
                            )}
                            Pay Now
                          </Button>
                        )}

                        {booking.status === "PENDING" && (
                          <Button
                            size="sm"
                            variant="destructive"
                            onClick={() => handleCancelBooking(booking._id)}
                            disabled={cancellingId === booking._id}
                          >
                            {cancellingId === booking._id ? (
                              <Loader2 className="h-4 w-4 animate-spin mr-2" />
                            ) : (
                              <X className="h-4 w-4 mr-2" />
                            )}
                            Cancel
                          </Button>
                        )}
                        
                        <Button size="sm" variant="ghost" className="text-slate-500" asChild>
                          <Link href={`/tourist/dashboard/bookings/${booking._id}`}>
                            <Eye className="h-4 w-4 mr-2" /> Details
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

// Utility for class nesting
function cn(...classes: any[]) {
  return classes.filter(Boolean).join(" ");
}
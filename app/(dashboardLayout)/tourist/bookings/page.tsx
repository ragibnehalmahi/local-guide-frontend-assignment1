// app/(dashboardLayout)/tourist/bookings/page.tsx
"use client";

import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Loader2, Calendar, MapPin, ExternalLink, CreditCard } from "lucide-react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { initPayment } from "@/services/payments/payments.service";
import ReviewModal from "@/components/modules/Reviews/ReviewModal";
import { MessageSquare } from "lucide-react";
import { serverFetch } from "@/lib/server-fetch";

export default function TouristBookingsPage() {
  const [bookings, setBookings] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [paymentLoading, setPaymentLoading] = useState<string | null>(null);

  // 🔥 রিভিউ দেওয়া বুকিংগুলোর সেট (localStorage থেকে লোড)
  const [reviewedBookingIds, setReviewedBookingIds] = useState<Set<string>>(new Set());

  // Review states
  const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
  const [selectedBooking, setSelectedBooking] = useState<any>(null);

  // কম্পোনেন্ট মাউন্টে localStorage থেকে লোড করুন
  useEffect(() => {
    const stored = localStorage.getItem('reviewed_bookings');
    if (stored) {
      try {
        const ids = JSON.parse(stored) as string[];
        setReviewedBookingIds(new Set(ids));
      } catch {
        // ignore
      }
    }
  }, []);

  const fetchMyBookings = async () => {
    try {
      const response = await serverFetch.get('/bookings');
      const result = await response.json();

      if (result.success) {
        setBookings(result.data || []);
      } else {
        toast.error(result.message || "Failed to load bookings");
      }
    } catch (error) {
      console.error("Booking Fetch Error:", error);
      toast.error("Failed to load your bookings.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMyBookings();
  }, []);

  const handlePayment = async (bookingId: string) => {
    setPaymentLoading(bookingId);
    try {
      const result = await initPayment(bookingId);
      if (result.success && result.data) {
        window.location.href = result.data; // Redirect to SSLCommerz
      } else {
        toast.error(result.message || "Failed to initiate payment");
      }
    } catch (error) {
      console.error(error);
      toast.error("Payment initialization failed");
    } finally {
      setPaymentLoading(null);
    }
  };

  const openReviewModal = (booking: any) => {
    setSelectedBooking(booking);
    setIsReviewModalOpen(true);
  };

  // 🔥 রিভিউ সফল হলে বা "already submitted" পেলে এই ফাংশন কল হবে
  const markAsReviewed = (bookingId: string) => {
    const newSet = new Set(reviewedBookingIds);
    newSet.add(bookingId);
    setReviewedBookingIds(newSet);
    // localStorage-এ সংরক্ষণ করুন
    localStorage.setItem('reviewed_bookings', JSON.stringify([...newSet]));
  };

  const getStatusColor = (status: string) => {
    switch (status?.toUpperCase()) {
      case "CONFIRMED": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-amber-100 text-amber-800";
      case "CANCELLED": return "bg-red-100 text-red-800";
      case "COMPLETED": return "bg-blue-100 text-blue-800";
      default: return "bg-slate-100 text-slate-800";
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-[50vh]">
        <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
      </div>
    );
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
        <p className="text-slate-500 mt-1">View and manage your upcoming and past tour bookings</p>
      </div>

      {bookings.length === 0 ? (
        <Card className="border-dashed border-2 shadow-none border-slate-200 p-12 text-center bg-slate-50">
          <div className="flex flex-col items-center">
            <Calendar className="w-12 h-12 text-slate-300 mb-4" />
            <h3 className="text-xl font-semibold text-slate-800">No bookings yet</h3>
            <p className="text-slate-500 mb-6 mt-2 max-w-sm">
              You haven't booked any tours. Start exploring and book your first local experience!
            </p>
            <Button className="bg-blue-600 hover:bg-blue-700" onClick={() => window.location.href = '/explore'}>
              Explore Tours
            </Button>
          </div>
        </Card>
      ) : (
        <div className="space-y-4">
          {bookings.map((booking) => {
            const isReviewed = reviewedBookingIds.has(booking._id);
            return (
              <Card key={booking._id} className="overflow-hidden hover:shadow-sm transition-shadow">
                <div className="flex flex-col sm:flex-row">
                  {/* Visual / Dates Block */}
                  <div className="bg-slate-50 p-6 flex flex-col justify-center items-center border-r border-slate-100 sm:w-48">
                    <div className="text-center">
                      <p className="text-slate-500 text-sm font-medium uppercase tracking-wider mb-1">
                        {new Date(booking.date).toLocaleString('default', { month: 'short' })}
                      </p>
                      <p className="text-4xl font-bold text-slate-900">
                        {new Date(booking.date).getDate()}
                      </p>
                      <p className="text-slate-500 text-sm mt-1">
                        {new Date(booking.date).getFullYear()}
                      </p>
                    </div>
                  </div>

                  {/* Details Block */}
                  <div className="p-6 flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="text-xl font-bold text-slate-900">
                          {booking.listing?.title || booking.toureTitle || "Tour Booking"}
                        </h3>
                        <Badge className={`${getStatusColor(booking.status)} border-none shadow-none font-semibold`}>
                          {booking.status}
                        </Badge>
                      </div>

                      <div className="grid grid-cols-2 gap-y-2 gap-x-4 mt-4 text-sm text-slate-600">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Meeting Point TBA</span>
                        </div>
                        <div className="flex items-center">
                          <Calendar className="w-4 h-4 mr-2 text-slate-400" />
                          <span>{booking.guestCount} Guest{booking.guestCount > 1 ? 's' : ''}</span>
                        </div>
                        <div className="flex items-center">
                          <CreditCard className="w-4 h-4 mr-2 text-slate-400" />
                          <span>Total: ${booking.totalPrice} ({booking.paymentStatus})</span>
                        </div>
                      </div>
                    </div>

                    <div className="mt-6 pt-4 border-t border-slate-100 flex gap-3 justify-end items-center">
                      {booking.status === "COMPLETED" && (
                        <Button
                          onClick={() => openReviewModal(booking)}
                          variant="outline"
                          className={`text-sm h-9 ${isReviewed ? 'opacity-50 cursor-not-allowed' : 'text-blue-600 border-blue-200 hover:bg-blue-50'}`}
                          disabled={isReviewed}
                        >
                          <MessageSquare className="w-4 h-4 mr-2" />
                          {isReviewed ? "Already Reviewed" : "Write Review"}
                        </Button>
                      )}

                      {booking.paymentStatus !== "PAID" && booking.status === "CONFIRMED" && (
                        <Button
                          onClick={() => handlePayment(booking._id)}
                          disabled={paymentLoading === booking._id}
                          variant="default"
                          className="bg-emerald-600 hover:bg-emerald-700 text-sm h-9"
                        >
                          {paymentLoading === booking._id ? (
                            <Loader2 className="w-4 h-4 animate-spin mr-2" />
                          ) : (
                            <CreditCard className="w-4 h-4 mr-2" />
                          )}
                          Pay Now
                        </Button>
                      )}
                      <Button variant="outline" className="text-sm h-9" onClick={() => window.location.href = `/tours/${booking.listing?._id || booking.listing}`}>
                        <ExternalLink className="w-4 h-4 mr-2" /> View Listing
                      </Button>
                    </div>
                  </div>
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {selectedBooking && (
        <ReviewModal
          isOpen={isReviewModalOpen}
          onClose={() => setIsReviewModalOpen(false)}
          bookingId={selectedBooking._id}
          guideName={selectedBooking.guide?.name}
          onSuccess={() => {
            fetchMyBookings();
            markAsReviewed(selectedBooking._id);
          }}
        />
      )}
    </div>
  );
}
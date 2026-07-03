//my-app/components/modules/Tourist/TouristBookingDetails.tsx 
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Calendar,
  MapPin,
  Users,
  DollarSign,
  User,
  Phone,
  Mail,
  AlertCircle,
  ArrowLeft
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
// import { api } from "@/lib/api";
import { formatDate, formatDateTime } from "@/lib/formatters";
import { serverFetch } from "@/lib/server-fetch";
import { initPayment } from "@/services/payments/payments.service";
import { toast } from "sonner";

interface BookingDetailsProps {
  booking: {
    _id: string;
    tour: {
      title?: string;
      description: string;
      price: number;
      durationHours: number;
      meetingPoint: string;
      location: {
        city: string;
        country: string;
        address: string;
      };
    };
    guide: {
      name: string;
      email: string;
      phone?: string;
    };
    date: string;
    guestCount: number;
    totalPrice: number;
    status: "PENDING" | "CONFIRMED" | "COMPLETED" | "CANCELLED";
    paymentStatus: "PENDING" | "PAID" | "FAILED";
    createdAt: string;
    updatedAt: string;
  };
}

export default function TouristBookingDetails({ booking }: BookingDetailsProps) {
  const [loading, setLoading] = useState(false);
  const router = useRouter();

  const handleCancel = async () => {
    if (!confirm("Are you sure you want to cancel this booking?")) return;

    setLoading(true);
    try {
      await serverFetch.patch(`/bookings/${booking._id}/cancel`);
      router.refresh();
      alert("Booking cancelled successfully");
    } catch (error) {
      console.error("Failed to cancel booking:", error);
      alert("Failed to cancel booking");
    } finally {
      setLoading(false);
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

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case "PAID": return "bg-green-100 text-green-800";
      case "PENDING": return "bg-yellow-100 text-yellow-800";
      case "FAILED": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };
  const handlePayment = async (bookingId: string) => {
    setLoading(true);
    try {
      const result = await initPayment(bookingId);

      // কনসোলে চেক করুন কি আসছে
      console.log("Backend Response:", result);

      if (result.success && result.data?.redirectUrl) {
        // এটিই আপনাকে SSLCommerz-এর পেমেন্ট পেজে নিয়ে যাবে
        window.location.href = result.data.redirectUrl;

      } else {
        toast.error(result.message || "Payment URL not found");
      }
    } catch (err) {
      toast.error("Something went wrong");
    } finally {
      setLoading(false);
    }
  };
  //   const handlePayment = async (bookingId: string) => {
  //   try {
  //     const result = await initPayment(bookingId); 

  //     // কনসোলে চেক করুন ডাটা আসছে কি না
  //     console.log("Payment Init Result:", result);

  //     if (result.success && result.data?.redirectUrl) {
  //       // এই লাইনটিই আপনাকে SSLCommerz-এর পেমেন্ট পেজে নিয়ে যাবে
  //       // যেখানে কার্ড নম্বর/বিকাশ দেওয়ার অপশন থাকবে
  //       window.location.href = result.data.redirectUrl; 
  //     } else {
  //       alert("Payment initiation failed: " + (result.message || "Unknown error"));
  //     }
  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //   }
  // };
  // const handlePayment = async (bookingId: string) => {
  //   try {
  //     const result = await initPayment(bookingId);
  //     if (result.success && result.data.redirectUrl) {
  //       // SSLCommerz পেমেন্ট পেজে পাঠিয়ে দিবে
  //       window.location.href = result.data.redirectUrl;
  //     } else {
  //       alert(result.message || "Payment initiation failed");
  //     }
  //   } catch (error) {
  //     console.error("Payment Error:", error);
  //     alert("Something went wrong with payment");
  //   }
  // };
  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Button variant="ghost" onClick={() => router.back()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to Bookings
      </Button>

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold">
            {booking?.tour?.title || "Tour details not available"}
          </h1>
          <p className="text-gray-600">Booking details and information</p>
        </div>
        <div className="flex gap-2">
          <Badge className={getStatusColor(booking.status)} >
            {booking.status}
          </Badge>
          <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
            {booking.paymentStatus}
          </Badge>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column - Tour & Guide Info */}
        <div className="lg:col-span-2 space-y-6">
          {/* Tour Details */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Tour Information</h2>
              <div className="space-y-4">
                <div className="flex items-start">
                  <MapPin className="h-5 w-5 text-gray-500 mr-3 mt-1" />
                  {/* <div>
                    <div className="text-sm text-gray-600">Location</div>
                    <div className="font-medium">
                      {booking.tour.location.city}, {booking.tour.location.country}
                    </div>
                    <div className="text-sm text-gray-600">{booking.tour.meetingPoint}</div>
                  </div> */}
                  <div className="font-medium">
                    {booking?.tour?.location?.city ? (
                      `${booking.tour.location.city}, ${booking.tour.location.country}`
                    ) : (
                      "Location details pending"
                    )}
                  </div>
                  <div className="text-sm text-gray-600">
                    {booking?.tour?.meetingPoint || "Meeting point not specified"}
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Tour Date & Time</div>
                    <div className="font-medium">{formatDateTime(booking.date)}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Calendar className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Duration</div>
                    <div className="font-medium">{booking?.tour?.durationHours} hours</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Users className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Number of Guests</div>
                    <div className="font-medium">{booking.guestCount} people</div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Guide Information */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Guide Information</h2>
              <div className="space-y-4">
                <div className="flex items-center">
                  <User className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Guide Name</div>
                    <div className="font-medium">{booking.guide.name}</div>
                  </div>
                </div>
                <div className="flex items-center">
                  <Mail className="h-5 w-5 text-gray-500 mr-3" />
                  <div>
                    <div className="text-sm text-gray-600">Email</div>
                    <div className="font-medium">{booking.guide.email}</div>
                  </div>
                </div>
                {booking.guide.phone && (
                  <div className="flex items-center">
                    <Phone className="h-5 w-5 text-gray-500 mr-3" />
                    <div>
                      <div className="text-sm text-gray-600">Phone</div>
                      <div className="font-medium">{booking.guide.phone}</div>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Column - Price & Actions */}
        <div className="space-y-6">
          {/* Price Summary */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Price Details</h2>
              <div className="space-y-3">
                <div className="flex justify-between">
                  <span className="text-gray-600">Tour Price</span>
                  <span>${booking?.tour?.price}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Number of Guests</span>
                  <span>{booking.guestCount}</span>
                </div>
                <div className="flex justify-between border-t pt-3 font-bold text-lg">
                  <span>Total Amount</span>
                  <span className="text-green-600">
                    <DollarSign className="inline h-5 w-5" />
                    {booking.totalPrice}
                  </span>
                </div>
                <div className="flex justify-between text-sm text-gray-600">
                  <span>Payment Status</span>
                  <Badge className={getPaymentStatusColor(booking.paymentStatus)}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Booking Info */}
          <Card>
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">Booking Information</h2>
              <div className="space-y-3 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Booking ID</span>
                  <span className="font-mono">{booking._id?.substring(0, 8)}...</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Booked On</span>
                  <span>{formatDateTime(booking.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Last Updated</span>
                  <span>{formatDateTime(booking.updatedAt)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Actions */}

          {booking.status === "CONFIRMED" && booking.paymentStatus !== "PAID" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4 text-center">Complete Your Booking</h3>
                <Button
                  className="w-full bg-green-600 hover:bg-green-700 h-12 text-lg"
                  onClick={() => handlePayment(booking._id)}
                >
                  <DollarSign className="mr-2 h-5 w-5" />
                  Pay & Confirm Now
                </Button>
                <p className="text-xs text-center text-gray-500 mt-2">
                  You will be redirected to SSLCommerz secure payment gateway.
                </p>
              </CardContent>
            </Card>
          )}
          {booking.status === "PENDING" && (
            <Card>
              <CardContent className="p-6">
                <h3 className="font-semibold mb-4">Actions</h3>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={loading}
                >
                  <AlertCircle className="mr-2 h-4 w-4" />
                  {loading ? "Cancelling..." : "Cancel Booking"}
                </Button>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
}

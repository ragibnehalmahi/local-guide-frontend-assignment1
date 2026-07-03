"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { revalidate } from "@/lib/revalidate";
import { CheckCircle2, MapPin, Calendar, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

const PaymentSuccessContent = () => {
  const router = useRouter();
  const [countdown, setCountdown] = useState(5);
  const [bookingDetails, setBookingDetails] = useState<{
    tourName: string;
    guideName: string;
    date: string;
    location: string;
    amount: number;
    bookingId: string;
  } | null>(null);

  useEffect(() => {
    // Get booking details from session storage
    const storedBooking = sessionStorage.getItem("lastBookingDetails");
    if (storedBooking) {
      try {
        setBookingDetails(JSON.parse(storedBooking));
      } catch (e) {
        console.error("Failed to parse booking details", e);
      }
    }

    // Revalidate user bookings
    revalidate("my-bookings");
    revalidate("my-tours");

    // Get return URL from session storage
    const storedUrl = sessionStorage.getItem("paymentReturnUrl") || "/dashboard";
    sessionStorage.removeItem("paymentReturnUrl");

    // Start countdown
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // Redirect after countdown
    const redirectTimer = setTimeout(() => {
      router.push(storedUrl === "/dashboard" ? "/tourist/dashboard" : storedUrl);
    }, 5000);

    return () => {
      clearInterval(timer);
      clearTimeout(redirectTimer);
    };
  }, [router]);

  const handleManualRedirect = () => {
    const storedUrl = sessionStorage.getItem("paymentReturnUrl") || "/tourist/dashboard";
    sessionStorage.removeItem("paymentReturnUrl");
    router.push(storedUrl);
  };

  const handleViewBookingDetails = () => {
    if (bookingDetails?.bookingId) {
      router.push(`/tourist/dashboard/bookings/${bookingDetails.bookingId}`);
    } else {
      router.push("/tourist/dashboard/bookings");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
    } catch (e) {
      return dateString;
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-gradient-to-br from-blue-50 to-emerald-50">
      <Card className="max-w-md w-full border-2 border-green-200 shadow-2xl overflow-hidden">
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 h-2 w-full"></div>
        
        <CardContent className="pt-8 pb-6 px-6">
          <div className="text-center space-y-6">
            {/* Success Icon with Animation */}
            <div className="flex justify-center">
              <div className="relative">
                <div className="absolute inset-0 bg-green-400 rounded-full blur-xl opacity-30 animate-ping"></div>
                <div className="relative bg-gradient-to-br from-green-100 to-emerald-100 rounded-full p-4 border-4 border-white shadow-lg">
                  <CheckCircle2 className="h-24 w-24 text-green-600" strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* Success Message */}
            <div className="space-y-3">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-green-700 to-emerald-800 bg-clip-text text-transparent">
                Payment Successful! 🎉
              </h1>
              <p className="text-gray-700 text-lg">
                Your tour booking is now confirmed!
              </p>
            </div>

            {/* Booking Details */}
            {bookingDetails && (
              <Card className="bg-gradient-to-br from-white to-blue-50 border-green-100 shadow-sm">
                <CardContent className="p-4 space-y-3">
                  <h3 className="font-semibold text-lg text-gray-800 mb-2">Booking Details</h3>
                  
                  <div className="space-y-2">
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">Tour:</span>
                      <span className="ml-2">{bookingDetails.tourName}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <User className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">Guide:</span>
                      <span className="ml-2">{bookingDetails.guideName}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <Calendar className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">Date:</span>
                      <span className="ml-2">{formatDate(bookingDetails.date)}</span>
                    </div>
                    
                    <div className="flex items-center text-gray-700">
                      <MapPin className="h-4 w-4 text-green-600 mr-2" />
                      <span className="font-medium">Location:</span>
                      <span className="ml-2">{bookingDetails.location}</span>
                    </div>
                    
                    <div className="pt-2 border-t border-gray-200">
                      <div className="flex justify-between items-center">
                        <span className="font-medium text-gray-800">Total Paid:</span>
                        <span className="text-2xl font-bold text-green-700">
                          ${bookingDetails.amount.toFixed(2)}
                        </span>
                      </div>
                      <p className="text-xs text-gray-500 mt-1">
                        Booking ID: {bookingDetails.bookingId}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Confirmation Message */}
            <div className="bg-gradient-to-r from-green-50 to-blue-50 rounded-lg p-4 border border-green-100">
              <p className="text-sm text-gray-700">
                A confirmation email with all booking details has been sent to your registered email address.
                You can also download the itinerary from your dashboard.
              </p>
            </div>

            {/* Countdown */}
            <div className="flex items-center justify-center text-sm text-gray-600">
              <div className="bg-gray-100 rounded-full px-4 py-2">
                <span className="font-semibold text-green-600">{countdown}</span>
                <span className="ml-2">
                  {countdown === 1 ? 'second' : 'seconds'} until redirect...
                </span>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <Button
                onClick={handleViewBookingDetails}
                className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white shadow-lg"
                size="lg"
              >
                View Booking Details
              </Button>
              
              <Button
                onClick={handleManualRedirect}
                variant="outline"
                className="w-full border-green-300 text-green-700 hover:bg-green-50"
              >
                Go to Dashboard
              </Button>
            </div>

            {/* Additional Info */}
            <div className="pt-4 border-t border-gray-200">
              <p className="text-xs text-gray-500">
                Need help? Contact support at{" "}
                <a href="mailto:support@localguide.com" className="text-green-600 hover:underline">
                  support@localguide.com
                </a>
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default PaymentSuccessContent;
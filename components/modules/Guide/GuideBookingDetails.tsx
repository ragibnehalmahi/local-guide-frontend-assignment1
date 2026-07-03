// src/components/modules/guide/GuideBookingDetails.tsx
"use client";

import { IBooking } from "@/types/booking.interface";
import { format } from "date-fns";
import { MapPin, User, Calendar, CreditCard, ArrowLeft, Users, Clock, Mail, Phone, AlertCircle, CheckCircle2, XCircle, DollarSign } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { confirmBooking, declineBooking, completeBooking } from "@/services/booking/booking.service";
import { useState } from "react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export default function GuideBookingDetails({ booking }: { booking: IBooking }) {
  const router = useRouter();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const result = await confirmBooking(booking._id);
      if (result.success) {
        toast.success("Booking confirmed successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to confirm booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async () => {
    if (!confirm("Are you sure you want to decline this booking? This action cannot be undone.")) {
      return;
    }

    setIsProcessing(true);
    try {
      const result = await declineBooking(booking._id);
      if (result.success) {
        toast.success("Booking declined");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to decline booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleComplete = async () => {
    setIsProcessing(true);
    try {
      const result = await completeBooking(booking._id);
      if (result.success) {
        toast.success("Booking marked as completed");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to complete booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setIsProcessing(false);
    }
  };

  const getStatusInfo = () => {
    switch (booking.status) {
      case 'PENDING':
        return {
          message: 'Awaiting your confirmation',
          color: 'text-yellow-600',
          bg: 'bg-yellow-50',
          border: 'border-yellow-200',
          icon: <Clock className="h-5 w-5 text-yellow-600" />
        };
      case 'CONFIRMED':
        return {
          message: booking.paymentStatus === 'PAID' ? 'Confirmed & Paid' : 'Confirmed - Awaiting Payment',
          color: booking.paymentStatus === 'PAID' ? 'text-green-600' : 'text-blue-600',
          bg: booking.paymentStatus === 'PAID' ? 'bg-green-50' : 'bg-blue-50',
          border: booking.paymentStatus === 'PAID' ? 'border-green-200' : 'border-blue-200',
          icon: booking.paymentStatus === 'PAID' ? 
            <CheckCircle2 className="h-5 w-5 text-green-600" /> : 
            <Clock className="h-5 w-5 text-blue-600" />
        };
      case 'COMPLETED':
        return {
          message: 'Tour completed successfully',
          color: 'text-purple-600',
          bg: 'bg-purple-50',
          border: 'border-purple-200',
          icon: <CheckCircle2 className="h-5 w-5 text-purple-600" />
        };
      case 'CANCELLED':
        return {
          message: 'Booking cancelled',
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: <XCircle className="h-5 w-5 text-gray-600" />
        };
      case 'DECLINED':
        return {
          message: 'Declined by you',
          color: 'text-red-600',
          bg: 'bg-red-50',
          border: 'border-red-200',
          icon: <XCircle className="h-5 w-5 text-red-600" />
        };
      default:
        return {
          message: booking.status,
          color: 'text-gray-600',
          bg: 'bg-gray-50',
          border: 'border-gray-200',
          icon: null
        };
    }
  };

  const statusInfo = getStatusInfo();

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Link 
          href="/guide/dashboard/bookings" 
          className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-primary"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Bookings
        </Link>
        <Badge variant="outline">
          Booking #{booking._id.slice(-8).toUpperCase()}
        </Badge>
      </div>

      <div className="space-y-6">
        {/* Status Card */}
        <Card className={`${statusInfo.bg} ${statusInfo.border}`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                {statusInfo.icon}
                <div>
                  <h3 className={`font-semibold ${statusInfo.color}`}>
                    {statusInfo.message}
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    {booking.status === 'PENDING' && 'Please respond within 24 hours'}
                    {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID' && 'Payment received'}
                    {booking.status === 'CONFIRMED' && booking.paymentStatus !== 'PAID' && 'Awaiting payment from tourist'}
                    {booking.status === 'COMPLETED' && 'You can now request payment if not already received'}
                    {booking.status === 'CANCELLED' && 'This booking has been cancelled'}
                    {booking.status === 'DECLINED' && 'You have declined this booking'}
                  </p>
                </div>
              </div>
              <div className="text-right">
                <div className="text-2xl font-bold text-primary">
                  ${booking.totalPrice}
                </div>
                <div className="text-sm text-muted-foreground">
                  <Badge variant={booking.paymentStatus === 'PAID' ? "default" : "outline"}>
                    {booking.paymentStatus}
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        {(booking.status === 'PENDING' || booking.status === 'CONFIRMED') && (
          <div className="flex flex-wrap gap-3">
            {booking.status === 'PENDING' && (
              <>
                <Button
                  onClick={handleConfirm}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  <CheckCircle2 className="h-4 w-4" />
                  {isProcessing ? "Confirming..." : "Confirm Booking"}
                </Button>
                <Button
                  variant="destructive"
                  onClick={handleDecline}
                  disabled={isProcessing}
                  className="gap-2"
                >
                  <XCircle className="h-4 w-4" />
                  {isProcessing ? "Declining..." : "Decline Booking"}
                </Button>
              </>
            )}
            
            {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID' && (
              <Button
                onClick={handleComplete}
                disabled={isProcessing}
                className="gap-2"
              >
                <CheckCircle2 className="h-4 w-4" />
                {isProcessing ? "Completing..." : "Mark as Completed"}
              </Button>
            )}
            
            {booking.status === 'CONFIRMED' && booking.paymentStatus !== 'PAID' && (
              <Button variant="outline" disabled className="text-muted-foreground">
                Awaiting payment from tourist
              </Button>
            )}
          </div>
        )}

        <div className="grid md:grid-cols-2 gap-6">
          {/* Tourist Details */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold flex items-center gap-2">
                <User className="h-5 w-5" />
                Tourist Information
              </h3>
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={booking.tourist?.profilePicture} />
                  <AvatarFallback className="bg-indigo-100 text-indigo-600">
                    {booking.tourist?.name?.charAt(0) || 'T'}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1">
                  <h4 className="font-medium">{booking.tourist?.name || "Tourist"}</h4>
                  <p className="text-sm text-muted-foreground">{booking.tourist?.email}</p>
                </div>
              </div>
              
              <Separator />
              
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Mail className="h-4 w-4 text-muted-foreground" />
                  <span>{booking.tourist?.email}</span>
                </div>
                {booking.tourist?.phone && (
                  <div className="flex items-center gap-2 text-sm">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <span>{booking.tourist.phone}</span>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Tour Details */}
          <Card>
            <CardContent className="pt-6 space-y-4">
              <h3 className="font-semibold">Tour Details</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">Tour</span>
                  <span className="font-medium">{booking.tourTitle}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Calendar className="h-4 w-4" />
                    Date
                  </span>
                  <span className="font-medium">
                    {format(new Date(booking.date), "PPP")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Time
                  </span>
                  <span className="font-medium">
                    {format(new Date(booking.date), "p")}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Guests
                  </span>
                  <span className="font-medium">{booking.guestCount} people</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground flex items-center gap-1">
                    <MapPin className="h-4 w-4" />
                    Meeting Point
                  </span>
                  <span className="font-medium text-right max-w-[200px] truncate">
                    {booking.meetingPoint || "To be confirmed"}
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Payment Breakdown */}
        <Card>
          <CardContent className="pt-6 space-y-4">
            <h3 className="font-semibold flex items-center gap-2">
              <DollarSign className="h-5 w-5" />
              Payment Breakdown
            </h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-muted-foreground">Price per person</span>
                <span>${booking.listing?.price?.toFixed(2) || booking.totalPrice / booking.guestCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-muted-foreground">Number of guests</span>
                <span>× {booking.guestCount}</span>
              </div>
              <Separator />
              <div className="flex justify-between font-bold text-lg">
                <span>Total Amount</span>
                <span className="text-primary">${booking.totalPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Payment Status</span>
                <Badge variant={booking.paymentStatus === 'PAID' ? "default" : "outline"}>
                  {booking.paymentStatus}
                </Badge>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-muted-foreground">Booking Status</span>
                <Badge variant="outline">{booking.status}</Badge>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Important Notes */}
        {booking.status === 'PENDING' && (
          <Card className="border-blue-200 bg-blue-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-blue-800">Action Required</h4>
                  <ul className="text-sm text-blue-700 space-y-1 list-disc pl-4">
                    <li>Please respond to this booking request within 24 hours</li>
                    <li>Once confirmed, the tourist will proceed to payment</li>
                    <li>If declined, the tourist will be notified immediately</li>
                    <li>After payment, mark the booking as completed after the tour</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}

        {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID' && (
          <Card className="border-green-200 bg-green-50">
            <CardContent className="pt-6">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div className="space-y-2">
                  <h4 className="font-semibold text-green-800">Ready for Tour</h4>
                  <ul className="text-sm text-green-700 space-y-1 list-disc pl-4">
                    <li>Payment has been received</li>
                    <li>Please prepare for the tour on the scheduled date</li>
                    <li>After completing the tour, mark it as completed</li>
                    <li>The tourist will be able to leave a review after completion</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>
        )}
      </div>
    </div>
  );
}
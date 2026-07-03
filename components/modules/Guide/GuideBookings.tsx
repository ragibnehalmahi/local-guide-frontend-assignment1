// src/components/modules/guide/GuideBookings.tsx
"use client";

import { IBooking } from "@/types/booking.interface";
import { format } from "date-fns";
import { Eye, CheckCircle, XCircle, Clock, User, DollarSign, MapPin } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { confirmBooking, declineBooking, completeBooking } from "@/services/booking/booking.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { MoreVertical } from "lucide-react";

export default function GuideBookings({ bookings }: { bookings: IBooking[] }) {
  const router = useRouter();
  const [loadingId, setLoadingId] = useState<string | null>(null);

  const handleConfirm = async (bookingId: string) => {
    setLoadingId(bookingId);
    try {
      const result = await confirmBooking(bookingId);
      if (result.success) {
        toast.success("Booking confirmed successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to confirm booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleDecline = async (bookingId: string) => {
    if (!confirm("Are you sure you want to decline this booking?")) {
      return;
    }

    setLoadingId(bookingId);
    try {
      const result = await declineBooking(bookingId);
      if (result.success) {
        toast.success("Booking declined");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to decline booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const handleComplete = async (bookingId: string) => {
    setLoadingId(bookingId);
    try {
      const result = await completeBooking(bookingId);
      if (result.success) {
        toast.success("Booking marked as completed");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to complete booking");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return (
          <Badge variant="outline" className="bg-yellow-50 text-yellow-700 border-yellow-200">
            <Clock className="mr-1 h-3 w-3" />
            Pending
          </Badge>
        );
      case 'CONFIRMED':
        return (
          <Badge variant="default" className="bg-green-100 text-green-700 border-green-200">
            <CheckCircle className="mr-1 h-3 w-3" />
            Confirmed
          </Badge>
        );
      case 'COMPLETED':
        return (
          <Badge variant="secondary" className="bg-purple-100 text-purple-700">
            Completed
          </Badge>
        );
      case 'CANCELLED':
        return (
          <Badge variant="outline" className="bg-gray-100 text-gray-700">
            Cancelled
          </Badge>
        );
      case 'DECLINED':
        return (
          <Badge variant="outline" className="bg-red-50 text-red-700 border-red-200">
            <XCircle className="mr-1 h-3 w-3" />
            Declined
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  return (
    <div className="rounded-lg border bg-white overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 border-b font-semibold text-slate-700">
            <tr>
              <th className="px-6 py-4">Tourist</th>
              <th className="px-6 py-4">Tour</th>
              <th className="px-6 py-4">Date</th>
              <th className="px-6 py-4">Guests</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Payment</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y">
            {bookings.map((booking) => (
              <tr key={booking._id} className="hover:bg-slate-50/50 transition-colors">
                <td className="px-6 py-4">
                  <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-indigo-100 rounded-full flex items-center justify-center">
                      <User className="h-4 w-4 text-indigo-600" />
                    </div>
                    <div>
                      <p className="font-medium">{booking.tourist?.name || "Tourist"}</p>
                      <p className="text-xs text-slate-500">{booking.tourist?.email}</p>
                    </div>
                  </div>
                </td>
                <td className="px-6 py-4">
                  <p className="font-medium">{booking.tourTitle}</p>
                  <p className="text-xs text-slate-500 flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {/* {booking.listing?.location?.city || "City"} */}
                    {((booking.listing as { location?: { city: string } }) || {}).location?.city || "City"}
                  </p>
                </td>
                <td className="px-6 py-4 text-slate-500">
                  {format(new Date(booking.date), "dd MMM yyyy")}
                </td>
                <td className="px-6 py-4">
                  <Badge variant="outline">{booking.guestCount} people</Badge>
                </td>
                <td className="px-6 py-4 font-semibold">
                  <div className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4 text-green-600" />
                    ${booking.totalPrice}
                  </div>
                </td>
                <td className="px-6 py-4">
                  {getStatusBadge(booking.status)}
                </td>
                <td className="px-6 py-4">
                  <Badge variant={booking.paymentStatus === 'PAID' ? "default" : "outline"}>
                    {booking.paymentStatus}
                  </Badge>
                </td>
                <td className="px-6 py-4">
                  <div className="flex justify-end gap-2">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="sm">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link href={`/guide/dashboard/bookings/${booking._id}`}>
                            <Eye className="mr-2 h-4 w-4" />
                            View Details
                          </Link>
                        </DropdownMenuItem>
                        
                        {booking.status === 'PENDING' && (
                          <>
                            <DropdownMenuItem 
                              onClick={() => handleConfirm(booking._id)}
                              disabled={loadingId === booking._id}
                            >
                              <CheckCircle className="mr-2 h-4 w-4 text-green-600" />
                              {loadingId === booking._id ? "Confirming..." : "Confirm Booking"}
                            </DropdownMenuItem>
                            <DropdownMenuItem 
                              onClick={() => handleDecline(booking._id)}
                              disabled={loadingId === booking._id}
                              className="text-red-600"
                            >
                              <XCircle className="mr-2 h-4 w-4" />
                              {loadingId === booking._id ? "Declining..." : "Decline Booking"}
                            </DropdownMenuItem>
                          </>
                        )}
                        
                        {booking.status === 'CONFIRMED' && booking.paymentStatus === 'PAID' && (
                          <DropdownMenuItem 
                            onClick={() => handleComplete(booking._id)}
                            disabled={loadingId === booking._id}
                          >
                            {loadingId === booking._id ? "Completing..." : "Mark as Completed"}
                          </DropdownMenuItem>
                        )}
                        
                        {booking.status === 'COMPLETED' && !booking.reviewed && (
                          <DropdownMenuItem className="text-green-600">
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Awaiting Review
                          </DropdownMenuItem>
                        )}
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      
      {bookings.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <div className="mb-4">No bookings found</div>
          <p className="text-sm text-slate-400">When tourists book your tours, they will appear here</p>
        </div>
      )}
    </div>
  );
}
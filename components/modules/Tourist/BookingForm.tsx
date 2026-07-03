// src/components/modules/Tourist/BookingForm.tsx
"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { CalendarIcon, Users } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { createBooking } from "@/services/booking/booking.service";
import { IListing } from "@/types/listing.interface";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { Badge } from "@/components/ui/badge";

interface BookingFormProps {
  listing: IListing;
  onSuccess?: () => void;
}

const BookingForm = ({ listing, onSuccess }: BookingFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [date, setDate] = useState<Date>();
  const [guestCount, setGuestCount] = useState(1);
  const [availableDates, setAvailableDates] = useState<Date[]>([]);

  useEffect(() => {
    if (!listing?.availableDates) return;
    
    // Convert available dates from string to Date objects
    const dates = listing.availableDates
      .map(d => new Date(d))
      .filter(d => d >= new Date()); // Only future dates
    setAvailableDates(dates);
    
    // Set first available date as default
    if (dates.length > 0 && !date) {
      setDate(dates[0]);
    }
  }, [listing, date]);

  const calculateTotal = () => {
    return (listing?.price || 0) * guestCount;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!date) {
      toast.error("Please select a date");
      return;
    }

    const maxGroupSize = listing?.maxGroupSize || 1;
    if (guestCount > maxGroupSize) {
      toast.error(`Maximum ${maxGroupSize} guests allowed`);
      return;
    }

    if (guestCount < 1) {
      toast.error("At least 1 guest required");
      return;
    }

    setIsSubmitting(true);

    try {
      const listingId = listing?._id || listing?.id;
      if (!listingId) {
        throw new Error("Listing ID is missing");
      }

      const bookingData = {
        listingId,
        date: date.toISOString(),
        guestCount
      };

      const result = await createBooking(bookingData);
      
      if (result.success) {
        toast.success("Booking request sent successfully!");
        if (onSuccess) {
          onSuccess();
        } else {
          // If result.data exists, we might have a booking ID
          const bookingId = result.data?._id || result.data?.id;
          if (bookingId) {
            router.push(`/tourist/dashboard/bookings/${bookingId}`);
          } else {
            router.push("/tourist/dashboard/bookings");
          }
          router.refresh();
        }
      } else {
        toast.error(result.message || "Failed to create booking");
      }
    } catch (error: any) {
      console.error("Error creating booking:", error);
      toast.error(error.message || "An error occurred while creating booking");
    } finally {
      setIsSubmitting(false);
    }
  };

  const isDateAvailable = (date: Date) => {
    return availableDates.some(availableDate => 
      availableDate.toDateString() === date.toDateString()
    );
  };

  if (!listing) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Book This Tour</CardTitle>
        <p className="text-sm text-muted-foreground">
          Select your preferred date and number of guests
        </p>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Date Selection */}
          <div className="space-y-3">
            <Label>Select Date *</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className={cn(
                    "w-full justify-start text-left font-normal",
                    !date && "text-muted-foreground"
                  )}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {date ? format(date, "PPP") : "Pick a date"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={setDate}
                  disabled={(date) => 
                    !isDateAvailable(date) || date < new Date()
                  }
                  initialFocus
                  className="p-3"
                />
              </PopoverContent>
            </Popover>
            
            <div className="flex flex-wrap gap-2">
              {availableDates.slice(0, 5).map((availableDate, index) => (
                <Badge
                  key={index}
                  variant={date?.toDateString() === availableDate.toDateString() ? "default" : "outline"}
                  className="cursor-pointer"
                  onClick={() => setDate(availableDate)}
                >
                  {format(availableDate, "MMM d")}
                </Badge>
              ))}
              {availableDates.length > 5 && (
                <Badge variant="secondary" className="opacity-70">
                  +{availableDates.length - 5} more
                </Badge>
              )}
            </div>
            
            {availableDates.length === 0 && (
              <p className="text-sm text-red-500">
                No available dates for this tour
              </p>
            )}
          </div>

          {/* Guest Count */}
          <div className="space-y-3">
            <Label>Number of Guests *</Label>
            <div className="flex items-center space-x-4">
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setGuestCount(prev => Math.max(1, prev - 1))}
                disabled={guestCount <= 1}
              >
                -
              </Button>
              <div className="flex-1 flex items-center justify-between px-4 py-2 border rounded-md">
                <span className="flex items-center gap-2">
                  <Users className="h-4 w-4" />
                  {guestCount} guest{guestCount !== 1 ? 's' : ''}
                </span>
                <span className="text-sm text-muted-foreground">
                  Max: {listing?.maxGroupSize || "N/A"}
                </span>
              </div>
              <Button
                type="button"
                variant="outline"
                size="icon"
                onClick={() => setGuestCount(prev => Math.min(listing?.maxGroupSize || 1, prev + 1))}
                disabled={guestCount >= (listing?.maxGroupSize || 1)}
              >
                +
              </Button>
            </div>
          </div>

          {/* Price Calculation */}
          <div className="space-y-2 rounded-lg bg-muted p-4">
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Price per person</span>
              <span>${(listing?.price || 0).toFixed(2)}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-sm text-muted-foreground">Guests</span>
              <span>× {guestCount}</span>
            </div>
            <div className="border-t pt-2 mt-2">
              <div className="flex justify-between font-bold text-lg">
                <span>Total</span>
                <span className="text-primary">${calculateTotal().toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Terms */}
          <div className="text-xs text-muted-foreground space-y-1">
            <p>• Booking request will be sent to the guide for confirmation</p>
            <p>• You can cancel up to 24 hours before the tour for a full refund</p>
            <p>• Payment will be processed once the guide confirms your booking</p>
          </div>

          {/* Submit Button */}
          <Button
            type="submit"
            className="w-full"
            size="lg"
            disabled={isSubmitting || availableDates.length === 0}
          >
            {isSubmitting ? "Processing..." : "Request to Book"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default BookingForm;
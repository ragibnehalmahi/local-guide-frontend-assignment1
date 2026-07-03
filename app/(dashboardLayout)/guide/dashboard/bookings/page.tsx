// src/app/(dashboardLayout)/(guideDashboardLayout)/dashboard/bookings/page.tsx
import GuideBookings from "@/components/modules/Guide/GuideBookings";  
import { getBookingsForGuide } from "@/services/booking/booking.service";  
import { IBooking } from "@/types/booking.interface";

export default async function GuideBookingsPage() {
  const response = await getBookingsForGuide();
  const bookings: IBooking[] = response?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Bookings</h1>
        <p className="text-muted-foreground mt-2">
          Manage tourist bookings for your tours
        </p>
      </div>

      <GuideBookings bookings={bookings} />
    </div>
  );
}
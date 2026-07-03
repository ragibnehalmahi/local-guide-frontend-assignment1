//app/(dashboardLayout)/tourist/dashboard/bookings/[id]/page.tsx
import TouristBookingDetails from "@/components/modules/Tourist/TouristBookingDetails";
import { getBookingById } from "@/services/booking/booking.service";
import { notFound } from "next/navigation";

interface BookingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function BookingDetailPage({ params }: BookingDetailPageProps) {
  const { id } = await params;
  const bookingResult = await getBookingById(id);

  if (!bookingResult?.success || !bookingResult.data) {
    notFound();
  }

  return <TouristBookingDetails booking={bookingResult.data} />;
}


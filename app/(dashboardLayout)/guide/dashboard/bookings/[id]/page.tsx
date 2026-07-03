// src/app/(dashboardLayout)/(guideDashboardLayout)/dashboard/bookings/[id]/page.tsx
import GuideBookingDetails from "@/components/modules/Guide/GuideBookingDetails";  
import { getBookingById } from "@/services/booking/booking.service";   
import { IBooking } from "@/types/booking.interface";
import { notFound } from "next/navigation";

interface GuideBookingDetailPageProps {
  params: Promise<{ 
    id: string;
  }>;
}

export default async function GuideBookingDetailPage({
  params,
}: GuideBookingDetailPageProps) {
  const { id } = await params;

  const response = await getBookingById(id);

  if (!response?.success || !response?.data) {
    notFound();
  }

  const booking: IBooking = response.data;

  return (
    <div className="container mx-auto px-4 py-8">
      <GuideBookingDetails booking={booking} />
    </div>
  );
}
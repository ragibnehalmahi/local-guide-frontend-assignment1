//app/(dashboardLayout)/tourist/dashboard/bookings/page.tsx

import TouristBookings from "@/components/modules/Tourist/TouristBookings";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getMyBookings } from "@/services/booking/booking.service";
import { Suspense } from "react";

interface BookingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BookingsPage({ searchParams }: BookingsPageProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const bookingsResult = await getMyBookings(queryString);

  return (
    <Suspense fallback={<TableSkeleton columns={6} rows={8} />}>
      <TouristBookings
        bookings={bookingsResult?.data || []}
        meta={bookingsResult?.meta}
      />
    </Suspense>
  );
}


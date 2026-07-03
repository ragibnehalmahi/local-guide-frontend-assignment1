// app/(dashboardLayout)/tourist/dashboard/listings/page.tsx  
import TouristListings from "@/components/modules/Tourist/TouristListings";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { queryStringFormatter } from "@/lib/formatters";
import { getListings } from "@/services/listing/listing.service";
// import { getMyListings } from "@/services/listing/listing.service";  
import { Suspense } from "react";

interface ListingsPageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function ListingsPage({ searchParams }: ListingsPageProps) {
  const searchParamsObj = await searchParams;
  const queryString = queryStringFormatter(searchParamsObj);
  const listingsResult = await getListings(queryString);

  return (
    <Suspense fallback={<TableSkeleton columns={4} rows={6} />}>
      <TouristListings
        listings={listingsResult?.data || []}
        meta={listingsResult?.meta}
      />
    </Suspense>
  );
}



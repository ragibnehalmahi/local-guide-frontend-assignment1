//app/(dashboardLayout)/tourist/dashboard/listings/[id]/page.tsx

import TouristListingDetail from "@/components/modules/Tourist/TouristListingDetail";
import { getListingById } from "@/services/listing/listing.service";
import { notFound } from "next/navigation";

interface ListingDetailPageProps {
  params: Promise<{ id: string }>;
}

export default async function ListingDetailPage({ params }: ListingDetailPageProps) {
  const { id } = await params;
  const listingResult = await getListingById(id);

  if (!listingResult?.success || !listingResult.data) {
    notFound();
  }

  return <TouristListingDetail listing={listingResult.data} />;
}




// src/app/(dashboardLayout)/(guideDashboardLayout)/dashboard/listings/page.tsx
import GuideListings from "@/components/modules/Guide/GuideListings";  
import { getMyListings } from "@/services/listing/listing.service";  
import { IListing } from "@/types/listing.interface";

export default async function MyListingsPage() {
  const response = await getMyListings();
  const listings: IListing[] = response?.data || [];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">My Listings</h1>
        <p className="text-muted-foreground mt-2">
          Manage your tour listings and view their performance
        </p>
      </div>

      <GuideListings listings={listings} />
    </div>
  );
}
// app/(dashboardLayout)/tourist/dashboard/wishlist/page.tsx
import TouristWishlist from "@/components/modules/Tourist/TouristWishlist";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";

export const dynamic = "force-dynamic";
export const revalidate = 0;

export default async function WishlistPage() {
    return (
        <div className="space-y-6">
            <div>
                <h1 className="text-3xl font-bold tracking-tight">Wishlist</h1>
                <p className="text-muted-foreground">Tours you've saved for later</p>
            </div>
            <Suspense fallback={<TableSkeleton columns={4} rows={3} />}>
                <TouristWishlist />
            </Suspense>
        </div>
    );
}
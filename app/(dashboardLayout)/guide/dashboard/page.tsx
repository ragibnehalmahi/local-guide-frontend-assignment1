// app/dashboard/guide/page.tsx
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { StatsCard } from "@/components/shared/StatCard";
import { getGuideDashboardMetaData } from "@/services/guide/dashboard.service";
import { IGuideDashboardMeta } from "@/types/guide.interface";
import { Suspense } from "react";
import { Star, AlertCircle } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function GuideDashboardContent() {
  try {
    const result = await getGuideDashboardMetaData();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch dashboard data");
    }

    const data: IGuideDashboardMeta = result.data || {
      totalListings: 0,
      totalBookings: 0,
      totalEarnings: 0,
      averageRating: 0,
      pendingBookings: 0,
      upcomingTours: 0,
      recentReviews: [],
      recentBookings: []
    };

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6">
          <StatsCard
            title="Upcoming Bookings"
            value={data.upcomingTours.toString()}
            iconName="Calendar"
            description="Confirmed future trips"
            iconClassName="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="Pending Requests"
            value={data.pendingBookings.toString()}
            iconName="Clock"
            description="Waiting for approval"
            iconClassName="bg-orange-100 text-orange-600"
          />
          <StatsCard
            title="My Listings"
            value={data.totalListings.toString()}
            iconName="MapPin"
            description="Active tour listings"
            iconClassName="bg-purple-100 text-purple-600"
          />
          <StatsCard
            title="Total Earnings"
            value={`$${data.totalEarnings.toFixed(2)}`}
            iconName="DollarSign"
            description="From completed tours"
            iconClassName="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Average Rating"
            value={data.averageRating.toFixed(1)}
            iconName="Star"
            description="From tourist reviews"
            iconClassName="bg-yellow-100 text-yellow-600"
          />
          <StatsCard
            title="Total Bookings"
            value={data.totalBookings.toString()}
            iconName="BarChart3"
            description="All time bookings"
            iconClassName="bg-indigo-100 text-indigo-600"
          />
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Recent Bookings */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Bookings</h3>
              <Link href="/guide/dashboard/bookings" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            {!data.recentBookings || data.recentBookings.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No recent bookings
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentBookings.map((booking: any) => (
                  <div key={booking._id} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                    <div>
                      <p className="font-medium text-sm">{booking.tourTitle || "Tour Package"}</p>
                      <p className="text-xs text-muted-foreground">
                        Tourist: {booking.tourist?.name || "Guest"} • {new Date(booking.date).toLocaleDateString()}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-gray-100 text-gray-800'
                        }`}>
                        {booking.status}
                      </span>
                      <p className="text-xs font-semibold mt-0.5">${booking.totalPrice}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Recent Reviews */}
          <div className="bg-card rounded-lg border p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-semibold">Recent Reviews</h3>
              <Link href="/guide/dashboard/reviews" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            {!data.recentReviews || data.recentReviews.length === 0 ? (
              <div className="text-center py-8 text-muted-foreground">
                No reviews yet
              </div>
            ) : (
              <div className="space-y-4">
                {data.recentReviews.map((review: any) => (
                  <div key={review._id} className="border-b pb-4 last:border-0 last:pb-0">
                    <div className="flex items-center gap-2 mb-1">
                      <div className="flex text-yellow-500">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star key={i} className={`h-3 w-3 ${i < review.rating ? 'fill-current' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-xs font-medium">{review.tourist?.name}</span>
                    </div>
                    <p className="text-xs text-muted-foreground line-clamp-2">
                      "{review.comment}"
                    </p>
                    <p className="text-[10px] text-gray-400 mt-1">
                      {new Date(review.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-2 text-sm">Create New Listing</h4>
            <p className="text-xs text-blue-700 mb-3">Add a new tour to attract more tourists</p>
            <Link
              href="/guide/dashboard/listings/create"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-xs px-4 py-2 rounded-md transition"
            >
              Create Listing
            </Link>
          </div>
          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-2 text-sm">Manage Bookings</h4>
            <p className="text-xs text-green-700 mb-3">Review and confirm incoming requests</p>
            <Link
              href="/guide/dashboard/bookings"
              className="inline-block bg-green-600 hover:bg-green-700 text-white text-xs px-4 py-2 rounded-md transition"
            >
              View Bookings
            </Link>
          </div>
          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-2 text-sm">Tour Analytics</h4>
            <p className="text-xs text-purple-700 mb-3">Check how your tours are performing</p>
            <Link
              href="/guide/dashboard/reports"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-xs px-4 py-2 rounded-md transition"
            >
              View Reports
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6 text-center">
        <AlertCircle className="h-10 w-10 text-red-600 mx-auto mb-2" />
        <h3 className="text-lg font-semibold text-red-800">Something went wrong!</h3>
        <p className="text-red-700">Please refresh the page to try again.</p>
      </div>
    );
  }
}

export default function GuideDashboardPage() {
  return (
    <div className="p-6 space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Guide Dashboard</h1>
        <p className="text-muted-foreground">Overview of your tour business</p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <GuideDashboardContent />
      </Suspense>
    </div>
  );
}




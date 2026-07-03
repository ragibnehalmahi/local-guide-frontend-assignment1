
//local-guide-frontend\my-app\app\(dashboardLayout)\tourist\dashboard\page.tsx

import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";
import { StatsCard } from "@/components/shared/StatCard";
import { getTouristDashboardMetaData } from "@/services/tourist/dashboard.service";
import { ITouristDashboardMeta } from "@/types/tourist.interface";
import { Suspense } from "react";
import { AlertCircle, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";

export const dynamic = "force-dynamic";

async function TouristDashboardContent() {
  try {
    const result = await getTouristDashboardMetaData();

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch dashboard data");
    }

    const data: ITouristDashboardMeta = result.data || {
      totalBookings: 0,
      totalSpent: 0,
      upcomingTours: 0,
      completedTours: 0,
      wishlistCount: 0,
      recentBookings: []
    };

    return (
      <div className="space-y-6">
        {/* Stats Cards */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
          <StatsCard
            title="My Trips - Upcoming"
            value={data.upcomingTours.toString()}
            iconName="Calendar"
            description="Future confirmed bookings"
            iconClassName="bg-blue-100 text-blue-600"
          />
          <StatsCard
            title="My Trips - Past"
            value={data.completedTours.toString()}
            iconName="CheckCircle"
            description="Completed tours"
            iconClassName="bg-emerald-100 text-emerald-600"
          />
          <StatsCard
            title="Total Bookings"
            value={data.totalBookings.toString()}
            iconName="TrendingUp"
            description="Count of all bookings"
            iconClassName="bg-purple-100 text-purple-600"
          />
          <StatsCard
            title="Total Spent"
            value={`$${data.totalSpent.toFixed(2)}`}
            iconName="DollarSign"
            description="Total tour expenditure"
            iconClassName="bg-green-100 text-green-600"
          />
          <StatsCard
            title="Wishlist"
            value={data.wishlistCount.toString()}
            iconName="Heart"
            description="Saved tours for later"
            iconClassName="bg-pink-100 text-pink-600"
          />
        </div>

        {/* Recent Bookings */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Recent Bookings</h3>
            <Link
              href="/tourist/dashboard/bookings"
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {!data.recentBookings || data.recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No recent bookings. Start exploring tours!
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {data.recentBookings.map((booking: any) => (
                <Link
                  key={booking._id}
                  href={`/tourist/dashboard/bookings/${booking._id}`}
                  className="group block border rounded-xl overflow-hidden hover:shadow-md transition bg-gray-50/50"
                >
                  <div className="p-4">
                    <div className="flex justify-between items-start mb-2">
                      <span className={`text-[10px] px-2 py-0.5 rounded-full ${booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                          booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                            'bg-blue-50 text-blue-700'
                        }`}>
                        {booking.status}
                      </span>
                      <p className="text-xs font-bold text-primary">${booking.totalPrice}</p>
                    </div>
                    <h4 className="font-semibold text-sm mb-1 line-clamp-1 group-hover:text-primary transition">
                      {booking.listing?.title || "Tour Experience"}
                    </h4>
                    <p className="text-[10px] text-muted-foreground flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {new Date(booking.date).toLocaleDateString()}
                    </p>
                    <div className="mt-3 pt-3 border-t flex items-center justify-between">
                      <p className="text-[10px] text-muted-foreground italic">
                        Guide: {booking.guide?.name || "Local Expert"}
                      </p>
                      <ArrowRight className="h-3 w-3 text-primary" />
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border border-blue-200 rounded-lg p-6">
            <h4 className="font-semibold text-blue-800 mb-2">Explore Tours</h4>
            <p className="text-sm text-blue-700 mb-3">Discover unique local experiences</p>
            <Link
              href="/tourist/dashboard/listings"
              className="inline-block bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-md transition"
            >
              Browse Tours
            </Link>
          </div>

          <div className="bg-gradient-to-r from-green-50 to-green-100 border border-green-200 rounded-lg p-6">
            <h4 className="font-semibold text-green-800 mb-2">My Bookings</h4>
            <p className="text-sm text-green-700 mb-3">Manage your upcoming tours</p>
            <Link
              href="/tourist/dashboard/bookings"
              className="inline-block bg-green-600 hover:bg-green-700 text-white text-sm px-4 py-2 rounded-md transition"
            >
              View Bookings
            </Link>
          </div>

          <div className="bg-gradient-to-r from-purple-50 to-purple-100 border border-purple-200 rounded-lg p-6">
            <h4 className="font-semibold text-purple-800 mb-2">My Wishlist</h4>
            <p className="text-sm text-purple-700 mb-3">Tours you've saved for later</p>
            <Link
              href="/tourist/dashboard/wishlist"
              className="inline-block bg-purple-600 hover:bg-purple-700 text-white text-sm px-4 py-2 rounded-md transition"
            >
              View Wishlist
            </Link>
          </div>
        </div>
      </div>
    );
  } catch (error: any) {
    console.error("Error in TouristDashboardContent:", error);

    return (
      <div className="bg-red-50 border border-red-200 rounded-lg p-6">
        <div className="flex items-center gap-3 mb-4">
          <AlertCircle className="h-6 w-6 text-red-600" />
          <h3 className="text-lg font-semibold text-red-800">Failed to Load Dashboard</h3>
        </div>
        <p className="text-red-700 mb-4">
          {error.message || "Unable to fetch dashboard data. Please try again."}
        </p>
        <button
          onClick={() => window.location.reload()}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-md text-sm"
        >
          Retry
        </button>
      </div>
    );
  }
}

const TouristDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Tourist Dashboard</h1>
        <p className="text-muted-foreground">
          Welcome back! Here's an overview of your travel experiences.
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <TouristDashboardContent />
      </Suspense>
    </div>
  );
};

export default TouristDashboardPage;






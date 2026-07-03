// src/app/(dashboardLayout)/(adminDashboardLayout)/dashboard/page.tsx
import { DashboardSkeleton } from "@/components/shared/DashboardSkeleton";  
import { StatsCard } from "@/components/shared/StatCard";  
import { getAdminDashboardMetaData } from "@/services/admin/dashboard.service";  
import { IAdminDashboardMeta } from "@/types/admin.interface";
  
import { Suspense } from "react";
import Link from "next/link";

// Dynamic SSR with fetch-level caching
export const dynamic = "force-dynamic";

async function AdminDashboardContent() {
  const result = await getAdminDashboardMetaData();
  const data: IAdminDashboardMeta = result.data || {
    totalUsers: 0,
    totalGuides: 0,
    totalTourists: 0,
    totalListings: 0,
    totalBookings: 0,
    totalRevenue: 0,
    recentSignups: [],
    recentBookings: []
  };

  return (
    <div className="space-y-6">
      {/* Platform Stats */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <StatsCard
          title="Total Users"
          value={data.totalUsers.toString()}
          iconName="Users"
          description={`${data.totalGuides} Guides, ${data.totalTourists} Tourists`}
          iconClassName="bg-blue-100 text-blue-600"
        />
        <StatsCard
          title="Total Listings"
          value={data.totalListings.toString()}
          iconName="MapPin"
          description="Total active/inactive tours"
          iconClassName="bg-orange-100 text-orange-600"
        />
        <StatsCard
          title="Total Bookings"
          value={data.totalBookings.toString()}
          iconName="CalendarCheck"
          description="Across all categories"
          iconClassName="bg-purple-100 text-purple-600"
        />
        <StatsCard
          title="Total Revenue"
          value={`$${data.totalRevenue.toFixed(2)}`}
          iconName="DollarSign"
          description="Total platform income"
          iconClassName="bg-emerald-100 text-emerald-600"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Activities (Signups) */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">User Management</h3>
            <Link href="/admin/dashboard/users-management" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {!data.recentSignups || data.recentSignups.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No users found
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentSignups.map((user: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div className="flex items-center gap-3">
                    <div className="h-8 w-8 rounded-full bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500">
                      {user.name.charAt(0)}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-[10px] text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      user.role === 'GUIDE' ? 'bg-blue-100 text-blue-800' :
                      user.role === 'TOURIST' ? 'bg-green-100 text-green-800' :
                      'bg-purple-100 text-purple-800'
                    }`}>
                      {user.role}
                    </span>
                    <p className="text-[10px] text-gray-400 mt-0.5">{new Date(user.createdAt).toLocaleDateString()}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Booking Management */}
        <div className="bg-card rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-semibold">Booking Management</h3>
            <Link href="/admin/dashboard/bookings-management" className="text-xs text-primary hover:underline">
              View all
            </Link>
          </div>
          
          {!data.recentBookings || data.recentBookings.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              No bookings found
            </div>
          ) : (
            <div className="space-y-4">
              {data.recentBookings.map((booking: any, index: number) => (
                <div key={index} className="flex items-center justify-between border-b pb-4 last:border-0 last:pb-0">
                  <div>
                    <p className="font-medium text-sm line-clamp-1">Tourist: {booking.tourist?.name || "Guest"}</p>
                    <p className="text-[10px] text-muted-foreground">
                      Guide: {booking.guide?.name || "Local Expert"}
                    </p>
                  </div>
                  <div className="text-right">
                    <span className={`text-[10px] px-2 py-0.5 rounded-full ${
                      booking.status === 'CONFIRMED' ? 'bg-green-100 text-green-800' :
                      booking.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {booking.status}
                    </span>
                    <p className="text-[10px] font-semibold mt-0.5">${booking.totalPrice}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

const AdminDashboardPage = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Admin Dashboard</h1>
        <p className="text-muted-foreground">
          System overview and quick actions
        </p>
      </div>

      <Suspense fallback={<DashboardSkeleton />}>
        <AdminDashboardContent />
      </Suspense>
    </div>
  );
};

export default AdminDashboardPage;
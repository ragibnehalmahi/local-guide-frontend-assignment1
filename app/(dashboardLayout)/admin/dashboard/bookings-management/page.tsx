// This page is the main hub for managing bookings in the admin dashboard. It provides an overview of all bookings, key statistics, and a detailed table for monitoring and moderation actions.
//app/(dashboardLayout)/admin/dashboard/bookings-management/page.tsx  

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import BookingsTable from "@/components/modules/Admin/BookingsManagement/BookingsTable";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Filter, TrendingUp, Download } from "lucide-react";
import { getAllBookingsForAdmin } from "@/services/admin/admin.service";

export const metadata = {
  title: "Manage Bookings - Admin Dashboard",
  description: "View and monitor all bookings on the platform",
};

export const dynamic = "force-dynamic";

async function getBookingsData() {
  try {
    const result = await getAllBookingsForAdmin();
    return {
      bookings: result?.data || [],
      total: result?.pagination?.total || (result?.data?.length || 0),
    };
  } catch (error) {
    console.error("Error fetching bookings:", error);
    return { bookings: [], total: 0 };
  }
}

export default async function BookingsManagementPage() {
  const { bookings, total } = await getBookingsData();

  // Calculate stats
  const revenue = bookings
    .filter((b: any) => b.status?.toUpperCase() === 'COMPLETED' || b.paymentStatus?.toUpperCase() === 'PAID')
    .reduce((sum: number, booking: any) => sum + (booking.totalAmount || 0), 0);

  const completedBookings = bookings.filter((b: any) => b.status?.toUpperCase() === 'COMPLETED').length;
  const pendingBookings = bookings.filter((b: any) => b.status?.toUpperCase() === 'PENDING').length;

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title="Bookings Management"
        description={`Monitor ${total.toLocaleString()} bookings on the platform`}
        actions={
          <div className="flex gap-2">
            <Button variant="outline" size="sm" className="gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <TrendingUp className="h-4 w-4" />
              Analytics
            </Button>
            <Button variant="outline" size="sm" className="gap-2">
              <Download className="h-4 w-4" />
              Export
            </Button>
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Total Bookings</p>
              <p className="text-2xl font-bold">{total}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
              <span className="text-blue-600 font-medium">📅</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Completed</p>
              <p className="text-2xl font-bold">{completedBookings}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-green-100 flex items-center justify-center">
              <span className="text-green-600 font-medium">✓</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Pending</p>
              <p className="text-2xl font-bold">{pendingBookings}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-yellow-100 flex items-center justify-center">
              <span className="text-yellow-600 font-medium">⏳</span>
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-500">Revenue</p>
              <p className="text-2xl font-bold">${revenue.toLocaleString()}</p>
            </div>
            <div className="h-10 w-10 rounded-full bg-purple-100 flex items-center justify-center">
              <span className="text-purple-600 font-medium">💰</span>
            </div>
          </div>
        </div>
      </div>

      {/* Status Overview */}
      <div className="bg-white rounded-lg border p-6 shadow-sm">
        <h3 className="font-semibold mb-6 flex items-center gap-2">
          <TrendingUp className="h-4 w-4 text-primary" />
          Bookings by Status
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {['PENDING', 'CONFIRMED', 'COMPLETED', 'CANCELLED'].map(status => {
            const count = bookings.filter((b: any) => (b.status || "").toUpperCase() === status).length;
            const percentage = total > 0 ? ((count / total) * 100).toFixed(1) : 0;

            const statusColors: Record<string, string> = {
              PENDING: 'bg-yellow-100 text-yellow-800',
              CONFIRMED: 'bg-blue-100 text-blue-800',
              COMPLETED: 'bg-green-100 text-green-800',
              CANCELLED: 'bg-red-100 text-red-800',
            };

            return (
              <div key={status} className="space-y-2 p-3 rounded-xl hover:bg-gray-50 transition-colors border-transparent border hover:border-gray-100">
                <div className="flex items-center justify-between">
                  <span className={`px-3 py-0.5 rounded-full text-xs font-bold uppercase tracking-wider ${statusColors[status] || 'bg-gray-100'}`}>
                    {status}
                  </span>
                  <span className="text-xs font-semibold text-gray-400">{percentage}%</span>
                </div>
                <div className="flex items-end justify-between">
                  <span className="text-2xl font-bold">{count}</span>
                  <span className="text-[10px] text-gray-500 uppercase font-bold tracking-tight mb-1">Bookings</span>
                </div>
                <div className="w-full bg-gray-100 h-1 rounded-full overflow-hidden">
                  <div
                    className={`h-full ${status === 'PENDING' ? 'bg-yellow-400' :
                        status === 'CONFIRMED' ? 'bg-blue-400' :
                          status === 'COMPLETED' ? 'bg-green-400' : 'bg-red-400'
                      }`}
                    style={{ width: `${percentage}%` }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Main Table */}
      <Suspense fallback={<TableSkeleton columns={8} rows={8} />}>
        <BookingsTable bookings={bookings} />
      </Suspense>
    </div>
  );
}


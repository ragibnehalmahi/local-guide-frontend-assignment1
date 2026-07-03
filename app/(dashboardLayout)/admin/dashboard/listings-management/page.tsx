// This page is the main hub for managing tour listings in the admin dashboard. It provides an overview of all listings, key statistics, and a detailed table for moderation actions.
//app/(dashboardLayout)/admin/dashboard/listings-management/page.tsx 

import ManagementPageHeader from "@/components/shared/ManagementPageHeader";
import ListingsTable from "@/components/modules/Admin/ListingsManagement/ListingsTable";
import { Suspense } from "react";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Button } from "@/components/ui/button";
import { Filter, TrendingUp, MapPin, Power } from "lucide-react";
import { getAllListings } from "@/services/admin/admin.service";

export const metadata = {
  title: "Manage Listings - Admin Dashboard",
  description: "Moderate and manage tour listings",
};

export const dynamic = "force-dynamic";

async function getListingsData() {
  try {
    const result = await getAllListings();
    return {
      listings: result?.data || [],
      total: result?.pagination?.total || 0,
    };
  } catch (error) {
    console.error("Error fetching listings:", error);
    return { listings: [], total: 0 };
  }
}

export default async function ListingsManagementPage() {
  const { listings, total } = await getListingsData();

  // Calculate stats
  const activeListingsCount = listings.filter((l: any) => l.active === true).length;
  const disabledListingsCount = listings.filter((l: any) => l.active === false).length;

  return (
    <div className="space-y-6">
      <ManagementPageHeader
        title="Listings Management"
        description={`Manage ${total.toLocaleString()} tour listings on the platform`}
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
          </div>
        }
      />

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Total Assets</p>
              <p className="text-2xl font-black text-gray-900">{total}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center">
              <MapPin className="h-5 w-5 text-blue-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Operational</p>
              <p className="text-2xl font-black text-emerald-600">{activeListingsCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center">
              <Power className="h-5 w-5 text-emerald-600" />
            </div>
          </div>
        </div>
        <div className="bg-white rounded-lg border p-4 shadow-sm">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[10px] font-black uppercase text-gray-400 tracking-widest mb-1">Deactivated</p>
              <p className="text-2xl font-black text-red-600">{disabledListingsCount}</p>
            </div>
            <div className="h-10 w-10 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center">
              <Power className="h-5 w-5 text-red-600" />
            </div>
          </div>
        </div>
      </div>

      {/* Categories Overview */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-medium mb-3">Listings by Category</h3>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['History', 'Food', 'Art', 'Adventure', 'Nature', 'Shopping', 'Nightlife', 'Other']
            .map(category => {
              const count = listings.filter((l: any) => l.category === category.toLowerCase()).length;
              return count > 0 ? (
                <div key={category} className="flex items-center justify-between p-2 hover:bg-gray-50 rounded">
                  <span className="text-gray-700">{category}</span>
                  <span className="bg-gray-100 text-gray-800 text-sm px-2 py-1 rounded-full">
                    {count}
                  </span>
                </div>
              ) : null;
            })}
        </div>
      </div>

      {/* Main Table */}
      <Suspense fallback={<TableSkeleton columns={7} rows={8} />}>
        <ListingsTable listings={listings} />
      </Suspense>
    </div>
  );
}
// src/app/(dashboardLayout)/(adminDashboardLayout)/dashboard/users/page.tsx
import UserManagement from "@/components/modules/Admin/UserManagement";
import { TableSkeleton } from "@/components/shared/TableSkeleton";
import { Suspense } from "react";

export default async function UserManagementPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">User Management</h1>
        <p className="text-gray-600">Manage all users</p>
      </div>

      <Suspense fallback={<TableSkeleton columns={6} rows={8} />}>
        <UserManagement />
      </Suspense>
    </div>
  );
}


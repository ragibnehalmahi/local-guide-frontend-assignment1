"use client";

import { ManagementTable } from "@/components/shared/ManagementTable";  
// import { updateUserStatus, deleteUse } from  
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
// import { formatDate } from "@/lib/utils";
import { deleteUser, updateUserStatus } from "@/services/admin/admin.service";
import { formatDate } from "@/lib/formatters";

interface Tourist {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: string;
  profilePicture?: string;
  bookingCount?: number;
  reviewCount?: number;
  createdAt: string;
  lastActive?: string;
  preferences?: {
    language?: string;
    currency?: string;
  };
}

interface TouristsTableProps {
  tourists: Tourist[];
}

export default function TouristsTable({ tourists }: TouristsTableProps) {
  const router = useRouter();
  const [selectedTourist, setSelectedTourist] = useState<Tourist | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);

  const handleStatusChange = async (tourist: Tourist, newStatus: string) => {
    const result = await updateUserStatus(tourist.id, newStatus);
    if (result.success) {
      toast.success(`Tourist ${newStatus === 'blocked' ? 'blocked' : 'activated'} successfully`);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to update status");
    }
  };

  const handleDelete = async (tourist: Tourist) => {
    const result = await deleteUser(tourist.id);
    if (result.success) {
      toast.success("Tourist deleted successfully");
      setDeleteOpen(false);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete tourist");
    }
  };

  const columns = [
    {
      header: "Tourist",
      accessor: (tourist: Tourist) => (
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-full bg-gray-200 flex items-center justify-center">
            {tourist.profilePicture ? (
              <img 
                src={tourist.profilePicture} 
                alt={tourist.name}
                className="h-10 w-10 rounded-full object-cover"
              />
            ) : (
              <span className="font-medium text-gray-600">
                {tourist.name.charAt(0).toUpperCase()}
              </span>
            )}
          </div>
          <div>
            <p className="font-medium">{tourist.name}</p>
            <p className="text-sm text-gray-500">{tourist.email}</p>
          </div>
        </div>
      ),
    },
    {
      header: "Contact",
      accessor: (tourist: Tourist) => (
        <div>
          <p className="font-medium">{tourist.phone || "No phone"}</p>
          <p className="text-sm text-gray-500">{tourist.preferences?.language || "English"}</p>
        </div>
      ),
    },
    {
      header: "Activity",
      accessor: (tourist: Tourist) => (
        <div>
          <p className="font-medium">{tourist.bookingCount || 0} bookings</p>
          <p className="text-sm text-gray-500">{tourist.reviewCount || 0} reviews</p>
        </div>
      ),
    },
    {
      header: "Joined",
      accessor: (tourist: Tourist) => (
        <div>
          <p className="font-medium">{formatDate(tourist.createdAt)}</p>
          {tourist.lastActive && (
            <p className="text-xs text-gray-500">
              Active: {formatDate(tourist.lastActive)}
            </p>
          )}
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (tourist: Tourist) => (
        <Badge 
          variant={
            tourist.status === 'active' ? 'default' :
            tourist.status === 'blocked' ? 'destructive' : 'secondary'
          }
          className="capitalize"
        >
          {tourist.status}
        </Badge>
      ),
    },
  ];

  const handleViewDetails = (tourist: Tourist) => {
    setSelectedTourist(tourist);
    setViewOpen(true);
  };

  return (
    <>
      <ManagementTable
        data={tourists}
        columns={columns}
        onView={handleViewDetails}
        onStatusChange={handleStatusChange}
        onDelete={(tourist) => {
          setSelectedTourist(tourist);
          setDeleteOpen(true);
        }}
        deleteLabel="Delete"
        getRowKey={(tourist) => tourist.id}
        searchable={true}
        searchPlaceholder="Search tourists..."
        searchFields={["name", "email", "phone"]}
        emptyMessage="No tourists found"
      />

      {/* Tourist Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Tourist Details</DialogTitle>
            <DialogDescription>
              View and manage tourist account
            </DialogDescription>
          </DialogHeader>
          
          {selectedTourist && (
            <div className="space-y-6">
              {/* Profile Header */}
              <div className="flex items-start gap-4">
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center">
                  {selectedTourist.profilePicture ? (
                    <img 
                      src={selectedTourist.profilePicture} 
                      alt={selectedTourist.name}
                      className="h-20 w-20 rounded-full object-cover"
                    />
                  ) : (
                    <span className="text-2xl font-medium text-gray-600">
                      {selectedTourist.name.charAt(0).toUpperCase()}
                    </span>
                  )}
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <h3 className="text-xl font-bold">{selectedTourist.name}</h3>
                    <Badge variant={
                      selectedTourist.status === 'active' ? 'default' :
                      selectedTourist.status === 'blocked' ? 'destructive' : 'secondary'
                    }>
                      {selectedTourist.status}
                    </Badge>
                  </div>
                  <p className="text-gray-600">{selectedTourist.email}</p>
                  <p className="text-gray-600">{selectedTourist.phone || "No phone number"}</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Total Bookings</p>
                  <p className="text-2xl font-bold">{selectedTourist.bookingCount || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Reviews</p>
                  <p className="text-2xl font-bold">{selectedTourist.reviewCount || 0}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Joined</p>
                  <p className="text-lg font-medium">{formatDate(selectedTourist.createdAt)}</p>
                </div>
                <div className="bg-gray-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-gray-500">Language</p>
                  <p className="text-lg font-medium">
                    {selectedTourist.preferences?.language || "English"}
                  </p>
                </div>
              </div>

              {/* Actions */}
              <div className="flex flex-wrap gap-2 pt-4 border-t">
                <Button
                  variant={selectedTourist.status === 'active' ? 'destructive' : 'default'}
                  onClick={() => {
                    handleStatusChange(
                      selectedTourist,
                      selectedTourist.status === 'active' ? 'blocked' : 'active'
                    );
                    setViewOpen(false);
                  }}
                >
                  {selectedTourist.status === 'active' ? 'Block Tourist' : 'Activate Tourist'}
                </Button>
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewOpen(false);
                    setDeleteOpen(true);
                  }}
                >
                  Delete Account
                </Button>
                <Button variant="ghost" onClick={() => setViewOpen(false)}>
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Tourist Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedTourist?.name}'s account? 
              This action cannot be undone and will remove all their data including bookings and reviews.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setDeleteOpen(false)}
            >
              Cancel
            </Button>
            <Button
              variant="destructive"
              onClick={() => selectedTourist && handleDelete(selectedTourist)}
            >
              Delete Account
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
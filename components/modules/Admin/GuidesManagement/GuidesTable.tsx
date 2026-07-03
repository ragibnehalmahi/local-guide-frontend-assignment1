"use client";

import { ManagementTable } from "@/components/shared/ManagementTable";  
// import { updateUserStatus, deleteUser, verifyGuide } from "@/services/admin.service";
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
// import { formatDate, formatCurrency } from "@/lib/utils";
import { 
  User, Mail, Phone, MapPin, Star, Calendar, 
  CheckCircle, XCircle, AlertTriangle, Shield
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { deleteUser, updateUserStatus } from "@/services/admin/admin.service";
import { formatDate } from "@/lib/formatters";

interface Guide {
  id: string;
  name: string;
  email: string;
  phone?: string;
  status: 'active' | 'blocked' | 'pending' | 'suspended';
  profilePicture?: string;
  bio?: string;
  location?: string;
  languages?: string[];
  expertise?: string[];
  listingCount: number;
  bookingCount: number;
  totalEarnings: number;
  rating: number;
  isVerified: boolean;
  hasDocuments: boolean;
  createdAt: string;
  lastActive?: string;
  documentUrl?: string;
}

interface GuidesTableProps {
  guides: Guide[];
  pagination?: any;
}

export default function GuidesTable({ guides, pagination }: GuidesTableProps) {
  const router = useRouter();
  const [selectedGuide, setSelectedGuide] = useState<Guide | null>(null);
  const [viewOpen, setViewOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [verificationOpen, setVerificationOpen] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>("all");

  const handleStatusChange = async (guide: Guide, newStatus: string) => {
    const result = await updateUserStatus(guide.id, newStatus);
    if (result.success) {
      toast.success(`Guide ${newStatus} successfully`);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to update status");
    }
  };

  // const handleVerification = async (guideId: string, verified: boolean) => {
  //   const result = await verifyGuide(guideId, verified);
  //   if (result.success) {
  //     toast.success(`Guide ${verified ? 'verified' : 'unverified'} successfully`);
  //     setVerificationOpen(false);
  //     router.refresh();
  //   } else {
  //     toast.error(result.message || "Failed to update verification");
  //   }
  // };

  const handleDelete = async (guide: Guide) => {
    const result = await deleteUser(guide.id);
    if (result.success) {
      toast.success("Guide deleted successfully");
      setDeleteOpen(false);
      router.refresh();
    } else {
      toast.error(result.message || "Failed to delete guide");
    }
  };

  const columns = [
    {
      header: "Guide",
      accessor: (guide: Guide) => (
        <div className="flex items-center gap-3">
          <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
            {guide.profilePicture ? (
              <img 
                src={guide.profilePicture} 
                alt={guide.name}
                className="h-12 w-12 rounded-full object-cover"
              />
            ) : (
              <User className="h-6 w-6 text-blue-600" />
            )}
            {guide.isVerified && (
              <div className="absolute -bottom-1 -right-1 h-5 w-5 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                <CheckCircle className="h-3 w-3 text-white" />
              </div>
            )}
          </div>
          <div>
            <div className="flex items-center gap-2">
              <p className="font-medium">{guide.name}</p>
              {guide.isVerified && (
                <Badge variant="default" className="text-xs">
                  Verified
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <Mail className="h-3 w-3" />
              <span className="truncate max-w-[180px]">{guide.email}</span>
            </div>
          </div>
        </div>
      ),
    },
    {
      header: "Contact & Location",
      accessor: (guide: Guide) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1">
            <Phone className="h-3 w-3 text-gray-400" />
            <span className="text-sm">{guide.phone || "No phone"}</span>
          </div>
          {guide.location && (
            <div className="flex items-center gap-1">
              <MapPin className="h-3 w-3 text-gray-400" />
              <span className="text-sm truncate">{guide.location}</span>
            </div>
          )}
        </div>
      ),
    },
    {
      header: "Performance",
      accessor: (guide: Guide) => (
        <div className="space-y-1">
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1">
              <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{guide.rating?.toFixed(1) || "N/A"}</span>
            </div>
            <div className="text-xs text-gray-500">
              {guide.bookingCount || 0} bookings
            </div>
          </div>
          <div className="text-sm">
            <span className="font-medium">{guide.listingCount || 0}</span>
            <span className="text-gray-500"> listings</span>
          </div>
        </div>
      ),
    },
    {
      header: "Earnings",
      accessor: (guide: Guide) => (
        <div>
          <p className="font-bold text-green-600">
            ${ (guide.totalEarnings || 0)}
          </p>
          <p className="text-xs text-gray-500">Total earnings</p>
        </div>
      ),
    },
    {
      header: "Status",
      accessor: (guide: Guide) => (
        <div className="space-y-1">
          <Badge 
            variant={
              guide.status === 'active' ? 'default' :
              guide.status === 'blocked' ? 'destructive' :
              guide.status === 'pending' ? 'outline' : 'secondary'
            }
            className="capitalize"
          >
            {guide.status}
          </Badge>
          {guide.hasDocuments && !guide.isVerified && (
            <Badge variant="outline" className="text-xs border-yellow-200 text-yellow-700">
              Docs Pending
            </Badge>
          )}
        </div>
      ),
    },
    {
      header: "Joined",
      accessor: (guide: Guide) => (
        <div className="space-y-1">
          <div className="flex items-center gap-1 text-sm">
            <Calendar className="h-3 w-3 text-gray-400" />
            {formatDate(guide.createdAt)}
          </div>
          {guide.lastActive && (
            <p className="text-xs text-gray-500">
              Active: {formatDate(guide.lastActive)}
            </p>
          )}
        </div>
      ),
    },
  ];

  const handleViewDetails = (guide: Guide) => {
    setSelectedGuide(guide);
    setViewOpen(true);
  };

  const filteredGuides = guides.filter(guide => {
    if (selectedStatus === "all") return true;
    return guide.status === selectedStatus;
  });

  return (
    <>
      {/* Status Filter */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-sm text-gray-600">Filter by status:</span>
            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="All Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Status</SelectItem>
                <SelectItem value="active">Active</SelectItem>
                <SelectItem value="pending">Pending</SelectItem>
                <SelectItem value="blocked">Blocked</SelectItem>
                <SelectItem value="suspended">Suspended</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="flex items-center gap-2 text-sm">
            <span className="text-gray-600">Showing:</span>
            <span className="font-medium">{filteredGuides.length}</span>
            <span className="text-gray-500">of</span>
            <span className="font-medium">{guides.length}</span>
            <span className="text-gray-500">guides</span>
          </div>
        </div>

        {pagination && (
          <div className="text-sm text-gray-500">
            Page {pagination.page} of {pagination.totalPages}
          </div>
        )}
      </div>

      <ManagementTable
        data={filteredGuides}
        columns={columns}
        onView={handleViewDetails}
        onStatusChange={handleStatusChange}
        onDelete={(guide) => {
          setSelectedGuide(guide);
          setDeleteOpen(true);
        }}
        deleteLabel={(guide) => guide.status === 'active' ? 'BLOCK Guide' : 'Activate Guide'}
        getRowKey={(guide) => guide.id}
        searchable={true}
        searchPlaceholder="Search guides by name, email, location..."
        searchFields={["name", "email", "location", "expertise"]}
        emptyMessage="No guides found matching your criteria"
      />

      {/* Guide Details Dialog */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Guide Details</DialogTitle>
            <DialogDescription>
              Complete guide profile and management options
            </DialogDescription>
          </DialogHeader>
          
          {selectedGuide && (
            <div className="space-y-6">
              {/* Header Section */}
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-4">
                  <div className="h-20 w-20 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center relative">
                    {selectedGuide.profilePicture ? (
                      <img 
                        src={selectedGuide.profilePicture} 
                        alt={selectedGuide.name}
                        className="h-20 w-20 rounded-full object-cover"
                      />
                    ) : (
                      <User className="h-10 w-10 text-blue-600" />
                    )}
                    {selectedGuide.isVerified && (
                      <div className="absolute -bottom-1 -right-1 h-7 w-7 rounded-full bg-green-500 border-2 border-white flex items-center justify-center">
                        <CheckCircle className="h-4 w-4 text-white" />
                      </div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <div className="flex items-center gap-2">
                      <h3 className="text-2xl font-bold">{selectedGuide.name}</h3>
                      <Badge 
                        variant={
                          selectedGuide.status === 'active' ? 'default' :
                          selectedGuide.status === 'blocked' ? 'destructive' :
                          selectedGuide.status === 'pending' ? 'outline' : 'secondary'
                        }
                        className="text-sm"
                      >
                        {selectedGuide.status}
                      </Badge>
                    </div>
                    <div className="space-y-1">
                      <p className="text-gray-600 flex items-center gap-2">
                        <Mail className="h-4 w-4" />
                        {selectedGuide.email}
                      </p>
                      {selectedGuide.phone && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <Phone className="h-4 w-4" />
                          {selectedGuide.phone}
                        </p>
                      )}
                      {selectedGuide.location && (
                        <p className="text-gray-600 flex items-center gap-2">
                          <MapPin className="h-4 w-4" />
                          {selectedGuide.location}
                        </p>
                      )}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-3xl font-bold text-green-600">
                    ${ (selectedGuide.totalEarnings || 0)}
                  </p>
                  <p className="text-sm text-gray-500">Total Earnings</p>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <div className="bg-blue-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-blue-700">{selectedGuide.listingCount || 0}</p>
                  <p className="text-sm text-blue-600">Active Listings</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-green-700">{selectedGuide.bookingCount || 0}</p>
                  <p className="text-sm text-green-600">Total Bookings</p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4 text-center">
                  <div className="flex items-center justify-center gap-1">
                    <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                    <p className="text-2xl font-bold text-yellow-700">
                      {selectedGuide.rating?.toFixed(1) || "N/A"}
                    </p>
                  </div>
                  <p className="text-sm text-yellow-600">Average Rating</p>
                </div>
                <div className="bg-purple-50 rounded-lg p-4 text-center">
                  <p className="text-2xl font-bold text-purple-700">
                    {selectedGuide.listingCount > 0 
                      ? Math.round((selectedGuide.bookingCount / selectedGuide.listingCount) * 100) 
                      : 0}%
                  </p>
                  <p className="text-sm text-purple-600">Conversion Rate</p>
                </div>
              </div>

              {/* Bio and Expertise */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {selectedGuide.bio && (
                  <div className="space-y-2">
                    <h4 className="font-medium">Bio</h4>
                    <p className="text-gray-700 bg-gray-50 rounded-lg p-4">{selectedGuide.bio}</p>
                  </div>
                )}
                
                <div className="space-y-4">
                  {selectedGuide.expertise && selectedGuide.expertise.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Expertise</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.expertise.map((exp, idx) => (
                          <Badge key={idx} variant="outline" className="bg-blue-50 text-blue-700">
                            {exp}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                  
                  {selectedGuide.languages && selectedGuide.languages.length > 0 && (
                    <div className="space-y-2">
                      <h4 className="font-medium">Languages</h4>
                      <div className="flex flex-wrap gap-2">
                        {selectedGuide.languages.map((lang, idx) => (
                          <Badge key={idx} variant="secondary">
                            {lang}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              {/* Account Information */}
              <div className="bg-gray-50 rounded-lg p-4 space-y-3">
                <h4 className="font-medium flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Account Information
                </h4>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm text-gray-500">Joined Date</p>
                    <p className="font-medium">{formatDate(selectedGuide.createdAt)}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Last Active</p>
                    <p className="font-medium">
                      {selectedGuide.lastActive 
                        ? formatDate(selectedGuide.lastActive) 
                        : "Not available"}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Verification Status</p>
                    <div className="flex items-center gap-2">
                      <Badge variant={selectedGuide.isVerified ? "default" : "outline"}>
                        {selectedGuide.isVerified ? "Verified" : "Not Verified"}
                      </Badge>
                      {selectedGuide.hasDocuments && !selectedGuide.isVerified && (
                        <Badge variant="outline" className="border-yellow-200 text-yellow-700">
                          Documents Uploaded
                        </Badge>
                      )}
                    </div>
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Document Status</p>
                    <p className="font-medium">
                      {selectedGuide.hasDocuments ? "Uploaded" : "Not Uploaded"}
                    </p>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap gap-3 pt-6 border-t">
                {/* Status Actions */}
                {selectedGuide.status === 'active' ? (
                  <Button
                    variant="destructive"
                    onClick={() => {
                      handleStatusChange(selectedGuide, 'blocked');
                      setViewOpen(false);
                    }}
                    className="gap-2"
                  >
                    <XCircle className="h-4 w-4" />
                    Block Guide
                  </Button>
                ) : selectedGuide.status === 'blocked' ? (
                  <Button
                    variant="default"
                    onClick={() => {
                      handleStatusChange(selectedGuide, 'active');
                      setViewOpen(false);
                    }}
                    className="gap-2"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Activate Guide
                  </Button>
                ) : selectedGuide.status === 'pending' && (
                  <>
                    <Button
                      variant="default"
                      onClick={() => {
                        handleStatusChange(selectedGuide, 'active');
                        setViewOpen(false);
                      }}
                      className="gap-2"
                    >
                      <CheckCircle className="h-4 w-4" />
                      Approve Guide
                    </Button>
                    <Button
                      variant="destructive"
                      onClick={() => {
                        handleStatusChange(selectedGuide, 'rejected');
                        setViewOpen(false);
                      }}
                      className="gap-2"
                    >
                      <XCircle className="h-4 w-4" />
                      Reject Guide
                    </Button>
                  </>
                )}

                {/* Verification Actions */}
                {!selectedGuide.isVerified && selectedGuide.hasDocuments && (
                  <Button
                    variant="outline"
                    onClick={() => setVerificationOpen(true)}
                    className="gap-2 border-green-200 text-green-700 hover:bg-green-50"
                  >
                    <CheckCircle className="h-4 w-4" />
                    Verify Guide
                  </Button>
                )}

                {selectedGuide.isVerified && (
                  <Button
                    variant="outline"
                    onClick={() => setVerificationOpen(true)}
                    className="gap-2 border-yellow-200 text-yellow-700 hover:bg-yellow-50"
                  >
                    <AlertTriangle className="h-4 w-4" />
                    Remove Verification
                  </Button>
                )}

                {/* View Documents */}
                {selectedGuide.documentUrl && (
                  <Button
                    variant="outline"
                    asChild
                    className="gap-2"
                  >
                    <a href={selectedGuide.documentUrl} target="_blank" rel="noopener noreferrer">
                      View Documents
                    </a>
                  </Button>
                )}

                {/* Delete Button */}
                <Button
                  variant="outline"
                  onClick={() => {
                    setViewOpen(false);
                    setDeleteOpen(true);
                  }}
                  className="gap-2 border-red-200 text-red-700 hover:bg-red-50"
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

      {/* Verification Confirmation Dialog */}
      <Dialog open={verificationOpen} onOpenChange={setVerificationOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {selectedGuide?.isVerified ? 'Remove Verification' : 'Verify Guide'}
            </DialogTitle>
            <DialogDescription>
              {selectedGuide?.isVerified
                ? `Are you sure you want to remove verification from ${selectedGuide?.name}? This will affect their credibility.`
                : `Verify ${selectedGuide?.name} as a trusted guide? This will add a verification badge to their profile.`
              }
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => setVerificationOpen(false)}
            >
              Cancel
            </Button>
            {/* <Button
              variant={selectedGuide?.isVerified ? "destructive" : "default"}
              onClick={() => {
                if (selectedGuide) {
                  handleVerification(selectedGuide._id, !selectedGuide.isVerified);
                }
              }}
            >
              {selectedGuide?.isVerified ? 'Remove Verification' : 'Verify Guide'}
            </Button> */}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Dialog */}
      <Dialog open={deleteOpen} onOpenChange={setDeleteOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Guide Account</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete {selectedGuide?.name}'s account? 
              This action is permanent and will:
              <ul className="list-disc pl-5 mt-2 space-y-1">
                <li>Remove all their listings</li>
                <li>Cancel all upcoming bookings</li>
                <li>Delete their reviews and ratings</li>
                <li>Remove all earnings history</li>
              </ul>
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
              onClick={() => selectedGuide && handleDelete(selectedGuide)}
            >
              Delete Permanently
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
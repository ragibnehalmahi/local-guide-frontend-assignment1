// src/components/modules/Admin/AdminListings.tsx
"use client";

import { IListing, ListingStatus } from "@/types/listing.interface";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  MoreVertical,
  Search,
  Filter,
  MapPin,
  DollarSign,
  Users,
  Calendar,
  CheckCircle,
  XCircle,
  Eye,
  Trash2,
  AlertTriangle,
  Clock,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { deleteListing, updateListingStatus } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { format } from "date-fns";

interface AdminListingsProps {
  initialListings: IListing[];
}

export default function AdminListings({ initialListings }: AdminListingsProps) {
  const router = useRouter();
  const [listings, setListings] = useState<IListing[]>(initialListings);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [categoryFilter, setCategoryFilter] = useState<string>("all");
  const [selectedListing, setSelectedListing] = useState<IListing | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showRejectDialog, setShowRejectDialog] = useState(false);
  const [loadingId, setLoadingId] = useState<string | null>(null);

  // Filter listings
  const filteredListings = listings.filter(listing => {
    const matchesSearch = 
      listing.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      listing.guide?.name?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === "all" || listing.status === statusFilter;
    const matchesCategory = categoryFilter === "all" || listing.category === categoryFilter;
    
    return matchesSearch && matchesStatus && matchesCategory;
  });

  // Handle status update
  const handleStatusUpdate = async (listingId: string, status: ListingStatus) => {
    setLoadingId(listingId);
    try {
      const result = await updateListingStatus(listingId, status);
      if (result.success) {
        setListings(listings.map(listing => 
          listing._id === listingId ? { ...listing, status } : listing
        ));
        toast.success(`Listing ${status === ListingStatus.APPROVED ? 'approved' : 'rejected'} successfully`);
      } else {
        toast.error(result.message || "Failed to update listing status");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
    }
  };

  // Handle delete listing
  const handleDeleteListing = async () => {
    if (!selectedListing) return;
    
    setLoadingId(selectedListing._id);
    try {
      const result = await deleteListing(selectedListing._id);
      if (result.success) {
        setListings(listings.filter(listing => listing._id !== selectedListing._id));
        toast.success("Listing deleted successfully");
      } else {
        toast.error(result.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("An error occurred");
    } finally {
      setLoadingId(null);
      setShowDeleteDialog(false);
      setSelectedListing(null);
    }
  };

  // Get status badge
  const getStatusBadge = (status: ListingStatus) => {
    switch (status) {
      case ListingStatus.APPROVED:
        return (
          <Badge variant="default" className="bg-green-100 text-green-700">
            <CheckCircle className="h-3 w-3 mr-1" />
            Approved
          </Badge>
        );
      case ListingStatus.PENDING:
        return (
          <Badge variant="outline" className="bg-yellow-100 text-yellow-700">
            <Clock className="h-3 w-3 mr-1" />
            Pending
          </Badge>
        );
      case ListingStatus.REJECTED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            <XCircle className="h-3 w-3 mr-1" />
            Rejected
          </Badge>
        );
      case ListingStatus.BLOCKED:
        return (
          <Badge variant="destructive" className="bg-red-100 text-red-700">
            <AlertTriangle className="h-3 w-3 mr-1" />
            Blocked
          </Badge>
        );
      default:
        return <Badge variant="outline">{status}</Badge>;
    }
  };

  // Get category badge
  const getCategoryBadge = (category: string) => {
    return (
      <Badge variant="outline" className="text-xs">
        {category}
      </Badge>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold">Listing Management</h1>
          <p className="text-sm text-muted-foreground">
            Manage and moderate all tour listings
          </p>
        </div>
        <div className="text-sm text-muted-foreground">
          Total: {filteredListings.length} listings
        </div>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* Search */}
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
                <Input
                  placeholder="Search by title, guide, or description..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>

              {/* Status Filter */}
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="PENDING">Pending</SelectItem>
                  <SelectItem value="APPROVED">Approved</SelectItem>
                  <SelectItem value="REJECTED">Rejected</SelectItem>
                  <SelectItem value="BLOCKED">Blocked</SelectItem>
                </SelectContent>
              </Select>

              {/* Category Filter */}
              <Select value={categoryFilter} onValueChange={setCategoryFilter}>
                <SelectTrigger>
                  <SelectValue placeholder="Filter by category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Categories</SelectItem>
                  <SelectItem value="FOOD">Food</SelectItem>
                  <SelectItem value="ADVENTURE">Adventure</SelectItem>
                  <SelectItem value="CULTURAL">Cultural</SelectItem>
                  <SelectItem value="HISTORICAL">Historical</SelectItem>
                  <SelectItem value="NATURE">Nature</SelectItem>
                  <SelectItem value="SHOPPING">Shopping</SelectItem>
                  <SelectItem value="NIGHTLIFE">Nightlife</SelectItem>
                  <SelectItem value="PHOTOGRAPHY">Photography</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Quick Stats */}
            <div className="flex flex-wrap gap-2">
              <Badge variant="outline" className="gap-1">
                <Clock className="h-3 w-3" />
                Pending: {listings.filter(l => l.status === ListingStatus.PENDING).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <CheckCircle className="h-3 w-3" />
                Approved: {listings.filter(l => l.status === ListingStatus.APPROVED).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <XCircle className="h-3 w-3" />
                Rejected: {listings.filter(l => l.status === ListingStatus.REJECTED).length}
              </Badge>
              <Badge variant="outline" className="gap-1">
                <AlertTriangle className="h-3 w-3" />
                Blocked: {listings.filter(l => l.status === ListingStatus.BLOCKED).length}
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Listings Table */}
      <div className="rounded-lg border overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Listing</TableHead>
                <TableHead>Guide</TableHead>
                <TableHead>Category</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Created</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.map((listing) => (
                <TableRow key={listing._id} className="hover:bg-muted/50">
                  <TableCell>
                    <div className="space-y-1">
                      <div className="font-medium">{listing.title}</div>
                      <div className="flex items-center gap-1 text-sm text-muted-foreground">
                        <MapPin className="h-3 w-3" />
                        {listing.location.city}, {listing.location.country}
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <div className="h-6 w-6 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-medium">
                          {listing.guide?.name?.charAt(0) || "G"}
                        </span>
                      </div>
                      <div className="text-sm">{listing.guide?.name || "Unknown"}</div>
                    </div>
                  </TableCell>
                  <TableCell>
                    {getCategoryBadge(listing.category)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1 font-medium">
                      <DollarSign className="h-4 w-4 text-green-600" />
                      {listing.price}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      {getStatusBadge(listing.status)}
                      {listing.status === ListingStatus.PENDING && (
                        <>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => handleStatusUpdate(listing._id, ListingStatus.APPROVED)}
                            disabled={loadingId === listing._id}
                            className="h-8 text-green-600"
                          >
                            <CheckCircle className="h-3 w-3 mr-1" />
                            Approve
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => {
                              setSelectedListing(listing);
                              setShowRejectDialog(true);
                            }}
                            disabled={loadingId === listing._id}
                            className="h-8 text-red-600"
                          >
                            <XCircle className="h-3 w-3 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="text-sm text-muted-foreground">
                      {format(new Date(listing.createdAt), "MMM dd, yyyy")}
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem onClick={() => router.push(`/listings/${listing._id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Public
                        </DropdownMenuItem>
                        <DropdownMenuItem onClick={() => router.push(`/admin/dashboard/listings/${listing._id}`)}>
                          <Eye className="mr-2 h-4 w-4" />
                          View Details
                        </DropdownMenuItem>
                        {listing.status === ListingStatus.APPROVED && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(listing._id, ListingStatus.BLOCKED)}
                          >
                            <AlertTriangle className="mr-2 h-4 w-4" />
                            Block Listing
                          </DropdownMenuItem>
                        )}
                        {listing.status === ListingStatus.BLOCKED && (
                          <DropdownMenuItem 
                            onClick={() => handleStatusUpdate(listing._id, ListingStatus.APPROVED)}
                          >
                            <CheckCircle className="mr-2 h-4 w-4" />
                            Unblock Listing
                          </DropdownMenuItem>
                        )}
                        <DropdownMenuItem 
                          onClick={() => {
                            setSelectedListing(listing);
                            setShowDeleteDialog(true);
                          }}
                          className="text-red-600"
                        >
                          <Trash2 className="mr-2 h-4 w-4" />
                          Delete Listing
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {filteredListings.length === 0 && (
          <div className="text-center py-12">
            <div className="text-muted-foreground mb-4">No listings found</div>
            <Button variant="outline" onClick={() => {
              setSearchTerm("");
              setStatusFilter("all");
              setCategoryFilter("all");
            }}>
              Clear Filters
            </Button>
          </div>
        )}
      </div>

      {/* Delete Listing Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete listing "{selectedListing?.title}"? 
              This action cannot be undone. All associated bookings and reviews will also be removed.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDeleteListing}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === selectedListing?._id}
            >
              {loadingId === selectedListing?._id ? "Deleting..." : "Delete Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Reject Listing Dialog */}
      <AlertDialog open={showRejectDialog} onOpenChange={setShowRejectDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Reject Listing</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to reject listing "{selectedListing?.title}"? 
              The guide will be notified and can update the listing for re-submission.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                if (selectedListing) {
                  handleStatusUpdate(selectedListing._id, ListingStatus.REJECTED);
                  setShowRejectDialog(false);
                  setSelectedListing(null);
                }
              }}
              className="bg-red-600 hover:bg-red-700"
              disabled={loadingId === selectedListing?._id}
            >
              {loadingId === selectedListing?._id ? "Rejecting..." : "Reject Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
// components/admin/ListingsTable.tsx - UPDATED VERSION

"use client";

import { useState, useMemo } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import {
  MoreVertical,
  Eye,
  Edit,
  Trash2,
  MapPin,
  User,
  Power,
  DollarSign,
  Clock,
  ExternalLink,
  Search,
  Filter,
  Check,
  Package,
  Loader2
} from "lucide-react";
import { toast } from "sonner";
import {
  deleteListing,
  toggleListingActive,
  updateListing
} from "@/services/admin/admin.service";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogDescription
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useRouter } from "next/navigation";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  durationHours: number;
  category: string;
  active: boolean;
  location: {
    city: string;
    country: string;
  };
  maxGroupSize: number;
  images: string[];
  guide: {
    _id: string;
    name: string;
    email: string;
  };
  createdAt: string;
}

interface ListingsTableProps {
  listings: Listing[];
}

export default function ListingsTable({ listings }: ListingsTableProps) {
  const router = useRouter();

  // Selection/Modal States
  const [selectedListing, setSelectedListing] = useState<Listing | null>(null);
  const [viewOpen, setViewOpen] = useState(false);

  // Edit States
  const [editOpen, setEditOpen] = useState(false);
  const [editingListing, setEditingListing] = useState<any>(null);
  const [isUpdating, setIsUpdating] = useState(false);

  // Filter States
  const [searchTerm, setSearchTerm] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all"); // ✅ New: Status filter

  // Global Loading
  const [loadingId, setLoadingId] = useState<string | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [modifiedIds, setModifiedIds] = useState<Set<string>>(new Set());

  // Client-side Filter Logic
  const filteredListings = useMemo(() => {
    return listings.filter(listing => {
      // Search filter
      const titleMatch = listing.title?.toLowerCase().includes(searchTerm.toLowerCase());
      const guideMatch = listing.guide?.name?.toLowerCase().includes(searchTerm.toLowerCase());
      const locationMatch = listing.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());

      const matchesSearch = searchTerm === "" || titleMatch || guideMatch || locationMatch;

      // Category filter
      const matchesCategory = categoryFilter === "all" || listing.category?.toLowerCase() === categoryFilter.toLowerCase();

      // ✅ Status filter - Updated to keep modified items visible
      const isModified = modifiedIds.has(listing._id);
      const matchesStatus = statusFilter === "all" ||
        isModified || // Always show if modified in this session
        (statusFilter === "active" && listing.active === true) ||
        (statusFilter === "inactive" && listing.active === false);

      return matchesSearch && matchesCategory && matchesStatus;
    });
  }, [listings, searchTerm, categoryFilter, statusFilter, modifiedIds]);

  // ✅ FIXED: Toggle listing status - Updates locally without page refresh
  const handleToggleActive = async (listingId: string, currentActive: boolean) => {
    const newActiveState = !currentActive;
    const actionText = newActiveState ? "activate" : "deactivate";

    setTogglingId(listingId);
    const toastId = toast.loading(`Processing ${actionText} request...`);

    try {
      const response = await toggleListingActive(listingId, newActiveState);

      if (response.success) {
        // ✅ Update modified IDs to keep this item visible even if it doesn't match filter
        setModifiedIds(prev => new Set(prev).add(listingId));

        // ✅ Update local state immediately - No page refresh needed
        // Find and update the listing in the parent component
        // Since we can't modify props directly, we'll trigger a refresh
        router.refresh(); // This will fetch fresh data from server
      } else {
        toast.error(response.message || `Failed to ${actionText} listing`, { id: toastId });
      }
    } catch (error: any) {
      console.error("Toggle error:", error);
      toast.error("Something went wrong! Please try again.", { id: toastId });
    } finally {
      setTogglingId(null);
    }
  };

  const handleUpdateRecord = async () => {
    if (!editingListing) return;
    setIsUpdating(true);
    const toastId = toast.loading("Updating listing...");
    try {
      const response = await updateListing(editingListing._id, {
        price: Number(editingListing.price),
        category: editingListing.category,
        active: editingListing.active,
        title: editingListing.title
      });

      if (response.success) {
        toast.success("Listing updated successfully!", { id: toastId });
        setModifiedIds(prev => new Set(prev).add(editingListing._id));
        setEditOpen(false);
        router.refresh(); // Refresh to get updated data
      } else {
        toast.error(response.message || "Update failed", { id: toastId });
      }
    } catch (error: any) {
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleDeleteRecord = async (listingId: string) => {
    if (!confirm("⚠️ This will permanently DELETE the listing. Are you absolutely sure?")) return;

    const toastId = toast.loading("Deleting listing...");
    try {
      setLoadingId(listingId);
      const response = await deleteListing(listingId);

      if (response.success) {
        toast.success("Listing deleted successfully!", { id: toastId });
        router.refresh(); // Refresh to remove deleted listing
      } else {
        toast.error(response.message || "Delete failed", { id: toastId });
      }
    } catch (error: any) {
      toast.error("Something went wrong!", { id: toastId });
    } finally {
      setLoadingId(null);
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      history: "bg-purple-100 text-purple-700",
      food: "bg-orange-100 text-orange-700",
      art: "bg-pink-100 text-pink-700",
      adventure: "bg-blue-100 text-blue-700",
      nature: "bg-emerald-100 text-emerald-700",
      shopping: "bg-rose-100 text-rose-700",
      nightlife: "bg-indigo-100 text-indigo-700",
    };
    return colors[category?.toLowerCase()] || "bg-gray-100 text-gray-700";
  };

  return (
    <>
      {/* Dynamic Filter Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-8">
        <div className="relative flex-1 group">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 group-focus-within:text-primary transition-colors" />
          <Input
            placeholder="Search by title, guide, or location..."
            className="pl-12 h-14 rounded-2xl border-gray-100 bg-gray-50/30 focus:bg-white shadow-sm focus:ring-primary/10 transition-all font-medium"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {/* ✅ Category Filter */}
        <Select value={categoryFilter} onValueChange={setCategoryFilter}>
          <SelectTrigger className="w-[180px] h-14 rounded-2xl border-gray-100 bg-white shadow-sm">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Categories</SelectItem>
            <SelectItem value="history">History</SelectItem>
            <SelectItem value="food">Food</SelectItem>
            <SelectItem value="art">Art</SelectItem>
            <SelectItem value="adventure">Adventure</SelectItem>
            <SelectItem value="nature">Nature</SelectItem>
            <SelectItem value="shopping">Shopping</SelectItem>
            <SelectItem value="nightlife">Nightlife</SelectItem>
          </SelectContent>
        </Select>

        {/* ✅ NEW: Status Filter */}
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[160px] h-14 rounded-2xl border-gray-100 bg-white shadow-sm">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="active">Active Only</SelectItem>
            <SelectItem value="inactive">Inactive Only</SelectItem>
          </SelectContent>
        </Select>

        {/* Clear Filters Button */}
        <Button
          variant="outline"
          className="h-14 px-6 rounded-2xl border-gray-200 hover:bg-red-50 hover:border-red-100 group transition-all"
          onClick={() => {
            setSearchTerm("");
            setCategoryFilter("all");
            setStatusFilter("all");
          }}
        >
          <Trash2 className="h-4 w-4 text-gray-400 group-hover:text-red-500" />
          <span className="ml-2 text-sm">Clear</span>
        </Button>
      </div>

      {/* Stats Summary */}
      <div className="flex justify-between items-center mb-4 px-2">
        <p className="text-sm text-gray-500">
          Showing <span className="font-bold text-gray-900">{filteredListings.length}</span> of{" "}
          <span className="font-bold text-gray-900">{listings.length}</span> listings
        </p>
        <div className="flex gap-3">
          <Badge className="bg-emerald-100 text-emerald-700">
            Active: {listings.filter(l => l.active).length}
          </Badge>
          <Badge className="bg-red-100 text-red-700">
            Inactive: {listings.filter(l => !l.active).length}
          </Badge>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-3xl border border-gray-100 shadow-2xl shadow-gray-100/50 overflow-hidden">
        <div className="overflow-x-auto">
          <Table>
            <TableHeader className="bg-gray-50/40">
              <TableRow className="hover:bg-transparent border-gray-100">
                <TableHead className="text-[10px] uppercase font-black tracking-widest py-6 px-8">Tour Details</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest py-6">Guide</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest py-6">Price</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest py-6">Status</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest py-6">Actions</TableHead>
                <TableHead className="text-[10px] uppercase font-black tracking-widest py-6 text-right px-8">Menu</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredListings.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-20 bg-gray-50/20">
                    <div className="flex flex-col items-center gap-3">
                      <Package className="h-10 w-10 text-gray-200" />
                      <p className="text-gray-400 font-black text-[10px] uppercase tracking-[0.2em]">No listings found</p>
                    </div>
                  </TableCell>
                </TableRow>
              ) : (
                filteredListings.map((listing) => (
                  <TableRow key={listing._id} className="border-gray-50 hover:bg-gray-50/40 transition-colors group">
                    <TableCell className="px-8 py-6">
                      <div className="flex items-center gap-5">
                        <div className="h-14 w-14 rounded-2xl bg-gray-100 border border-gray-200 overflow-hidden flex-shrink-0 shadow-sm relative group-hover:scale-105 transition-transform">
                          {listing.images && listing.images[0] ? (
                            <img
                              src={listing.images[0]}
                              alt={listing.title}
                              className="h-full w-full object-cover"
                            />
                          ) : (
                            <MapPin className="h-6 w-6 text-gray-300 m-auto" />
                          )}
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 text-[13px] truncate uppercase tracking-tight italic leading-tight">{listing.title}</p>
                          <div className="flex items-center gap-2 mt-1.5">
                            <Badge variant="outline" className={`${getCategoryColor(listing.category)} border-none shadow-none h-5 px-2 font-black rounded-lg text-[9px]`}>
                              {listing.category}
                            </Badge>
                            <span className="text-gray-300">•</span>
                            <span className="text-gray-400 text-[9px] font-bold">{listing.location?.city || "Unknown"}</span>
                          </div>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <div className="h-10 w-10 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center flex-shrink-0">
                          <User className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="min-w-0">
                          <p className="font-black text-gray-900 text-xs truncate leading-none uppercase tracking-tight">{listing.guide?.name || "Unknown"}</p>
                          <p className="text-[10px] text-gray-400 mt-1 truncate max-w-[120px] font-bold">{listing.guide?.email || "No email"}</p>
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="space-y-0.5">
                        <p className="font-black text-emerald-600 text-[14px] tracking-tight leading-none">${listing.price}</p>
                        <p className="text-[9px] text-gray-400 font-black uppercase tracking-widest">per person</p>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge className={`${listing.active ? "bg-emerald-50 text-emerald-700" : "bg-red-50 text-red-700"} text-[9px] font-black uppercase tracking-widest border-none shadow-none h-6 px-3 rounded-full`}>
                        <span className={`h-1.5 w-1.5 rounded-full mr-2 ${listing.active ? "bg-emerald-500 animate-pulse" : "bg-red-500"}`} />
                        {listing.active ? "Active" : "Inactive"}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {/* ✅ EXPLICIT STATUS CONTROLS - FIXED APPROACH */}
                      <div className="flex items-center gap-2">
                        {togglingId === listing._id ? (
                          <div className="h-8 w-16 flex items-center justify-center bg-gray-50 rounded-lg border border-gray-100">
                            <Loader2 className="h-4 w-4 animate-spin text-gray-400" />
                          </div>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant={listing.active ? "default" : "outline"}
                              className={`h-8 rounded-lg font-black text-[9px] uppercase tracking-widest px-3 transition-all ${listing.active
                                  ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20"
                                  : "border-gray-200 text-gray-400 hover:border-emerald-200 hover:text-emerald-600 hover:bg-emerald-50"
                                }`}
                              onClick={() => !listing.active && handleToggleActive(listing._id, false)}
                              disabled={listing.active}
                            >
                              <Check className={`h-3 w-3 mr-1 ${listing.active ? "text-white" : "text-emerald-500"}`} />
                              Active
                            </Button>

                            <Button
                              size="sm"
                              variant={!listing.active ? "destructive" : "outline"}
                              className={`h-8 rounded-lg font-black text-[9px] uppercase tracking-widest px-3 transition-all ${!listing.active
                                  ? "bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20"
                                  : "border-gray-200 text-gray-400 hover:border-red-200 hover:text-red-600 hover:bg-red-50"
                                }`}
                              onClick={() => listing.active && handleToggleActive(listing._id, true)}
                              disabled={!listing.active}
                            >
                              <Power className={`h-3 w-3 mr-1 ${!listing.active ? "text-white" : "text-red-500"}`} />
                              delete
                            </Button>
                          </>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="text-right px-8">
                      <div className="flex justify-end gap-1">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" size="icon" className="h-10 w-10 text-gray-400 hover:text-gray-900 rounded-xl hover:bg-gray-100 transition-colors">
                              <MoreVertical className="h-5 w-5" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-56 rounded-2xl shadow-2xl p-2 border-gray-100">
                            <DropdownMenuLabel className="text-[9px] uppercase font-black tracking-[0.2em] text-muted-foreground p-3">Actions</DropdownMenuLabel>
                            <DropdownMenuSeparator className="mb-2" />
                            <DropdownMenuItem onClick={() => { setSelectedListing(listing); setViewOpen(true); }} className="rounded-xl font-bold text-[11px] gap-3 py-3 uppercase tracking-widest">
                              <Eye className="h-4 w-4 text-blue-500" /> View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => { setEditingListing({ ...listing }); setEditOpen(true); }} className="rounded-xl font-bold text-[11px] gap-3 py-3 uppercase tracking-widest">
                              <Edit className="h-4 w-4 text-amber-500" /> Edit
                            </DropdownMenuItem>
                            {listing.active ? (
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(listing._id, true)}
                                disabled={togglingId === listing._id}
                                className="rounded-xl font-bold text-[11px] gap-3 py-3 uppercase tracking-widest text-red-600 focus:text-red-600"
                              >
                                <Power className="h-4 w-4" /> Deactivate Listing
                              </DropdownMenuItem>
                            ) : (
                              <DropdownMenuItem
                                onClick={() => handleToggleActive(listing._id, false)}
                                disabled={togglingId === listing._id}
                                className="rounded-xl font-bold text-[11px] gap-3 py-3 uppercase tracking-widest text-emerald-600 focus:text-emerald-600"
                              >
                                <Check className="h-4 w-4" /> Activate Listing
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              onClick={() => handleDeleteRecord(listing._id)}
                              className="rounded-xl font-bold text-[11px] gap-3 py-3 text-red-600 focus:text-red-600"
                            >
                              <Trash2 className="h-4 w-4" /> Delete Permanently
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* Edit Dialog - Same as before */}
      <Dialog open={editOpen} onOpenChange={setEditOpen}>
        <DialogContent className="rounded-[40px] max-w-md p-0 overflow-hidden border-none shadow-2xl">
          <div className="bg-gray-900 px-8 py-10">
            <DialogTitle className="text-2xl font-black uppercase italic tracking-tighter text-white">Edit Listing</DialogTitle>
            <DialogDescription className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-400 mt-2">Modify listing details</DialogDescription>
          </div>
          {editingListing && (
            <div className="p-10 space-y-8 bg-white">
              <div className="space-y-3">
                <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Title</label>
                <Input
                  value={editingListing.title}
                  onChange={(e) => setEditingListing({ ...editingListing, title: e.target.value })}
                  className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white text-xs font-bold"
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Price ($)</label>
                  <Input
                    type="number"
                    value={editingListing.price}
                    onChange={(e) => setEditingListing({ ...editingListing, price: e.target.value })}
                    className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white text-sm font-black"
                  />
                </div>
                <div className="space-y-3">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Category</label>
                  <Select value={editingListing.category} onValueChange={(v) => setEditingListing({ ...editingListing, category: v })}>
                    <SelectTrigger className="h-14 rounded-2xl border-gray-100 bg-gray-50 focus:bg-white font-bold text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {['history', 'food', 'art', 'adventure', 'nature', 'shopping', 'nightlife'].map(cat => (
                        <SelectItem key={cat} value={cat} className="font-bold text-xs uppercase">{cat}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="flex items-center justify-between p-6 rounded-[30px] bg-gray-50 border border-gray-100">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Status</p>
                  <p className="text-[11px] font-black text-gray-900 mt-1 uppercase tracking-tight">{editingListing.active ? "Active" : "Inactive"}</p>
                </div>
                <div className="flex gap-2">
                  <Button
                    variant={editingListing.active ? "default" : "outline"}
                    size="sm"
                    className={`rounded-full px-6 font-black text-[9px] uppercase tracking-widest h-9 border-2 transition-all ${editingListing.active
                        ? "bg-emerald-500 hover:bg-emerald-600 text-white border-none shadow-lg shadow-emerald-500/20"
                        : "bg-white border-gray-100 text-gray-400 hover:border-emerald-200 hover:text-emerald-600"
                      }`}
                    onClick={() => setEditingListing({ ...editingListing, active: true })}
                    disabled={editingListing.active}
                  >
                    Active
                  </Button>
                  <Button
                    variant={!editingListing.active ? "destructive" : "outline"}
                    size="sm"
                    className={`rounded-full px-6 font-black text-[9px] uppercase tracking-widest h-9 border-2 transition-all ${!editingListing.active
                        ? "bg-red-500 hover:bg-red-600 text-white border-none shadow-lg shadow-red-500/20"
                        : "bg-white border-gray-100 text-gray-400 hover:border-red-200 hover:text-red-600"
                      }`}
                    onClick={() => setEditingListing({ ...editingListing, active: false })}
                    disabled={!editingListing.active}
                  >
                    Inactive
                  </Button>
                </div>
              </div>
            </div>
          )}
          <DialogFooter className="p-10 pt-0 bg-white grid grid-cols-2 gap-4">
            <Button variant="outline" className="h-16 rounded-[25px] font-black uppercase text-[11px] tracking-[0.2em] border-2" onClick={() => setEditOpen(false)}>Cancel</Button>
            <Button
              className="h-16 bg-gray-900 hover:bg-black text-white rounded-[25px] font-black uppercase text-[11px] tracking-[0.2em] shadow-2xl shadow-gray-900/30"
              onClick={handleUpdateRecord}
              disabled={isUpdating}
            >
              {isUpdating ? "Updating..." : <><Check className="h-4 w-4 mr-2" /> Save Changes</>}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Dialog - Keep as is */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="max-w-3xl gap-0 p-0 overflow-hidden border-none shadow-2xl rounded-[40px]">
          {selectedListing && (
            <div className="flex flex-col">
              <div className="bg-gray-900 h-64 relative">
                {selectedListing.images && selectedListing.images[0] ? (
                  <img src={selectedListing.images[0]} alt="" className="w-full h-full object-cover opacity-60" />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-gray-800 to-gray-900" />
                )}
                <div className="absolute inset-0 bg-gradient-to-t from-gray-900 via-gray-900/40 to-transparent" />
                <div className="absolute bottom-8 left-10 right-10">
                  <Badge className="bg-white/10 backdrop-blur-md text-white border-white/20 mb-4 px-4 py-1.5 uppercase tracking-[0.3em] text-[9px] font-black rounded-full">
                    {selectedListing.category}
                  </Badge>
                  <h3 className="text-4xl font-black text-white tracking-tighter leading-tight uppercase italic">{selectedListing.title}</h3>
                </div>
              </div>

              <div className="p-12 space-y-10 bg-white max-h-[60vh] overflow-y-auto">
                <div className="grid grid-cols-3 gap-8">
                  <div className="p-6 rounded-[35px] bg-gray-50 border border-gray-100 text-center">
                    <DollarSign className="h-6 w-6 text-emerald-500 mb-2 mx-auto" />
                    <p className="text-2xl font-black text-gray-900">${selectedListing.price}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Per Person</p>
                  </div>
                  <div className="p-6 rounded-[35px] bg-gray-50 border border-gray-100 text-center">
                    <Clock className="h-6 w-6 text-blue-500 mb-2 mx-auto" />
                    <p className="text-2xl font-black text-gray-900">{selectedListing.durationHours}H</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Duration</p>
                  </div>
                  <div className="p-6 rounded-[35px] bg-gray-50 border border-gray-100 text-center">
                    <Power className={`h-6 w-6 mb-2 mx-auto ${selectedListing.active ? "text-emerald-500" : "text-red-500"}`} />
                    <p className="text-[12px] font-black text-gray-900 uppercase">{selectedListing.active ? "Active" : "Inactive"}</p>
                    <p className="text-[9px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1">Status</p>
                  </div>
                </div>

                <div className="space-y-5">
                  <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Description</h4>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    {selectedListing.description}
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-10">
                  <div className="space-y-5">
                    <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Location</h4>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-[20px] bg-blue-50 border border-blue-100 flex items-center justify-center">
                        <MapPin className="h-6 w-6 text-blue-500" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 uppercase tracking-tight text-base">{selectedListing.location?.city || "N/A"}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">{selectedListing.location?.country || "N/A"}</p>
                      </div>
                    </div>
                  </div>
                  <div className="space-y-5">
                    <h4 className="text-[10px] uppercase font-black tracking-[0.3em] text-gray-400 border-b border-gray-100 pb-3">Guide</h4>
                    <div className="flex items-center gap-4">
                      <div className="h-12 w-12 rounded-[20px] bg-emerald-50 border border-emerald-100 flex items-center justify-center">
                        <User className="h-6 w-6 text-emerald-500" />
                      </div>
                      <div>
                        <p className="font-black text-gray-900 uppercase tracking-tight text-base">{selectedListing.guide?.name || "Unknown"}</p>
                        <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mt-1.5">{selectedListing.guide?.email || "No email"}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <DialogFooter className="p-12 pt-6 bg-white flex gap-4">
                <Button variant="outline" className="flex-1 rounded-[25px] h-16 font-black uppercase text-[11px] tracking-[0.2em] border-2" onClick={() => setViewOpen(false)}>Close</Button>
                <Button className="flex-1 bg-gray-900 hover:bg-black text-white rounded-[25px] h-16 font-black uppercase text-[11px] tracking-[0.2em]" onClick={() => window.open(`/tours/${selectedListing._id}`, '_blank')}>View Live <ExternalLink className="h-4 w-4 ml-3" /> </Button>
              </DialogFooter>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}



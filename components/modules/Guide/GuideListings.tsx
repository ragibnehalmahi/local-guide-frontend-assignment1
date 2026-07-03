// src/components/modules/guide/GuideListings.tsx 
"use client";

import { IListing } from "@/types/listing.interface";
import { Edit, Trash2, MapPin, Users, Eye, MoreVertical, Image as ImageIcon } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { deleteListing } from "@/services/listing/listing.service";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import ListingDetailsModal from "./ListingDetailsModal";

export default function GuideListings({ listings }: { listings: IListing[] }) {
  const router = useRouter();
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedListing, setSelectedListing] = useState<IListing | null>(null);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const handleViewDetails = (listing: IListing) => {
    setSelectedListing(listing);
    setShowViewModal(true);
  };

  const handleDelete = async (listingId: string) => {
    setDeletingId(listingId);
    try {
      const result = await deleteListing(listingId);
      if (result.success) {
        toast.success("Listing deleted successfully");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to delete listing");
      }
    } catch (error) {
      toast.error("An error occurred while deleting listing");
    } finally {
      setDeletingId(null);
      setShowDeleteDialog(false);
      setSelectedListing(null);
    }
  };

  const openDeleteDialog = (listing: IListing) => {
    setSelectedListing(listing);
    setShowDeleteDialog(true);
  };

  // Helper function to get first image URL
  const getFirstImageUrl = (images: string[] | undefined): string => {
    if (!images || images.length === 0) {
      return '/placeholder-image.jpg';
    }

    const firstImage = images[0];

    // Check if it's a base64 string
    if (firstImage.startsWith('data:image/')) {
      return firstImage; // Base64 image
    }

    // Check if it's a Cloudinary URL
    if (firstImage.includes('cloudinary.com') || firstImage.startsWith('http')) {
      return firstImage; // External URL
    }

    // Check if it's a local file path
    if (firstImage.startsWith('/')) {
      return firstImage; // Local path
    }

    return '/placeholder-image.jpg';
  };

  const getCategoryBadge = (category: string) => {
    const colors: Record<string, string> = {
      'FOOD': 'bg-orange-100 text-orange-700',
      'ADVENTURE': 'bg-green-100 text-green-700',
      'CULTURAL': 'bg-purple-100 text-purple-700',
      'HISTORICAL': 'bg-blue-100 text-blue-700',
      'NATURE': 'bg-emerald-100 text-emerald-700',
      'SHOPPING': 'bg-pink-100 text-pink-700',
      'NIGHTLIFE': 'bg-indigo-100 text-indigo-700',
      'PHOTOGRAPHY': 'bg-cyan-100 text-cyan-700',
    };

    return colors[category] || 'bg-gray-100 text-gray-700';
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {listings.map((item) => {
          const firstImageUrl = getFirstImageUrl(item.images);

          return (
            <div key={item._id || item.id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition-shadow group">
              <div className="h-48 bg-slate-200 relative overflow-hidden">
                <img
                  src={firstImageUrl}
                  alt={item.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  onError={(e) => {
                    // Fallback if image fails to load
                    (e.target as HTMLImageElement).src = '/placeholder-image.jpg';
                  }}
                />

                {/* Image overlay for base64 indicator */}
                {firstImageUrl.startsWith('data:image/') && (
                  <div className="absolute bottom-2 right-2">
                    <Badge className="bg-black/70 text-white text-xs">
                      Local
                    </Badge>
                  </div>
                )}

                <div className="absolute top-4 right-4 flex gap-2">
                  <Badge className={`${getCategoryBadge(item.category)} border-0`}>
                    {item.category}
                  </Badge>
                  <Badge className="bg-white/90 backdrop-blur text-slate-800 font-bold">
                    ${item.price}
                  </Badge>
                </div>

                {!item.active && (
                  <div className="absolute top-4 left-4">
                    <Badge variant="destructive" className="bg-red-500">
                      Inactive
                    </Badge>
                  </div>
                )}
              </div>

              <div className="p-5 space-y-4">
                <div>
                  <h3 className="font-bold text-slate-800 line-clamp-1">{item.title}</h3>
                  <div className="flex items-center justify-between text-xs text-slate-500 mt-1">
                    <span className="flex items-center gap-1">
                      <MapPin size={12} />
                      {item.location?.city || 'N/A'}, {item.location?.country || 'N/A'}
                    </span>
                    <span className="flex items-center gap-1">
                      <Users size={12} />
                      Max {item.maxGroupSize}
                    </span>
                  </div>
                  <p className="text-sm text-slate-600 mt-2 line-clamp-2">
                    {item.description}
                  </p>
                </div>

                <div className="flex gap-2 pt-4 border-t">
                  <Link
                    href={`/guide/dashboard/listings/edit/${item._id}`}
                    className="flex-1 flex items-center justify-center gap-2 py-2 text-sm font-medium bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors"
                  >
                    <Edit size={14} /> Edit
                  </Link>

                  <Button
                    variant="destructive"
                    size="icon"
                    onClick={() => openDeleteDialog(item)}
                    disabled={deletingId === item._id}
                    className="px-3 py-2"
                  >
                    {deletingId === item._id ? (
                      <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Trash2 size={16} />
                    )}
                  </Button>

                  {isMounted && (
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => handleViewDetails(item)}
                      className="px-3 py-2"
                    >
                      <Eye size={16} />
                    </Button>
                  )}

                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="outline" size="icon">
                        <MoreVertical size={16} />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem asChild>
                        <Link href={`/guide/dashboard/listings/edit/${item._id}`}>
                          <Edit className="mr-2 h-4 w-4" />
                          Edit
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem onClick={() => handleViewDetails(item)}>
                        <Eye className="mr-2 h-4 w-4" />
                        Quick View
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild>
                        {/* <Link href={`/tours/${item._id}`} target="_blank">
                          <Eye className="mr-2 h-4 w-4" />
                          View Public Page
                        </Link> */}
                      </DropdownMenuItem>
                      <DropdownMenuItem
                        onClick={() => openDeleteDialog(item)}
                        className="text-red-600"
                      >
                        <Trash2 className="mr-2 h-4 w-4" />
                        Delete
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action will deactivate your listing "{selectedListing?.title}".
              This listing will no longer be visible to tourists, but you can reactivate it later.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => selectedListing && handleDelete(selectedListing._id)}
              className="bg-red-600 hover:bg-red-700"
              disabled={deletingId === selectedListing?._id}
            >
              {deletingId === selectedListing?._id ? "Deleting..." : "Delete Listing"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* View Details Modal */}
      <ListingDetailsModal
        listing={selectedListing}
        isOpen={showViewModal}
        onClose={() => setShowViewModal(false)}
      />

      {listings.length === 0 && (
        <div className="text-center py-12 border-2 border-dashed rounded-lg">
          <div className="text-slate-400 mb-4">No listings found</div>
          <p className="text-sm text-slate-500 mb-6">
            Create your first tour listing to start attracting tourists
          </p>
          <Button asChild>
            <Link href="/guide/dashboard/listings/create">
              Create Your First Listing
            </Link>
          </Button>
        </div>
      )}
    </>
  );
}
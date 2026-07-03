// components/modules/Admin/ListingsManagement/AdminViewListingModal.tsx
"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  MapPin,
  User,
  DollarSign,
  Clock,
  Users,
  Calendar,
  Globe,
  Star,
  Edit,
  ExternalLink,
  Mail,
  Phone,
  Image as ImageIcon
} from "lucide-react";
import { format } from "date-fns";

interface AdminViewListingModalProps {
  listing: any;
  isOpen: boolean;
  onClose: () => void;
  onEdit: () => void;
}

export default function AdminViewListingModal({ 
  listing, 
  isOpen, 
  onClose, 
  onEdit 
}: AdminViewListingModalProps) {
  
  const getStatusColor = (status: string) => {
    const colors: any = {
      active: "bg-green-100 text-green-800",
      inactive: "bg-red-100 text-red-800",
      pending: "bg-yellow-100 text-yellow-800",
      rejected: "bg-gray-100 text-gray-800",
    };
    return colors[status] || "bg-gray-100 text-gray-800";
  };

  const getCategoryColor = (category: string) => {
    const colors: any = {
      history: "bg-purple-100 text-purple-800",
      food: "bg-red-100 text-red-800",
      art: "bg-blue-100 text-blue-800",
      adventure: "bg-green-100 text-green-800",
      nature: "bg-emerald-100 text-emerald-800",
      shopping: "bg-pink-100 text-pink-800",
      nightlife: "bg-indigo-100 text-indigo-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), 'MMM dd, yyyy');
    } catch {
      return "Invalid date";
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="text-2xl font-bold">{listing.title}</DialogTitle>
              <p className="text-sm text-gray-500 mt-1">
                ID: {listing._id}
              </p>
            </div>
            <div className="flex gap-2">
              <Badge className={getStatusColor(listing.status)}>
                {listing.status?.charAt(0).toUpperCase() + listing.status?.slice(1)}
              </Badge>
              {listing.isFeatured && (
                <Badge className="bg-yellow-100 text-yellow-800">
                  <Star className="h-3 w-3 mr-1" /> Featured
                </Badge>
              )}
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images */}
          {listing.images && listing.images.length > 0 && (
            <div className="grid grid-cols-3 gap-2">
              {listing.images.slice(0, 3).map((img: string, index: number) => (
                <div key={index} className="aspect-square rounded-md overflow-hidden bg-gray-100">
                  <img 
                    src={img} 
                    alt={`${listing.title} - ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = '/placeholder-tour.jpg';
                    }}
                  />
                </div>
              ))}
              {listing.images.length > 3 && (
                <div className="aspect-square rounded-md bg-gray-100 flex items-center justify-center">
                  <div className="text-center">
                    <ImageIcon className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                    <p className="text-sm text-gray-600">+{listing.images.length - 3} more</p>
                  </div>
                </div>
              )}
            </div>
          )}

          <Separator />

          {/* Description */}
          <div>
            <h3 className="font-semibold text-lg mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">{listing.description}</p>
          </div>

          <Separator />

          {/* Details Grid */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Price</span>
              </div>
              <p className="font-semibold">${listing.price?.toFixed(2)}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Duration</span>
              </div>
              <p className="font-semibold">{listing.durationHours || listing.duration || 0} hours</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Users className="h-4 w-4" />
                <span className="text-sm">Group Size</span>
              </div>
              <p className="font-semibold">Max {listing.maxGroupSize || 10}</p>
            </div>

            <div className="space-y-2">
              <div className="flex items-center gap-2 text-gray-500">
                <Calendar className="h-4 w-4" />
                <span className="text-sm">Created</span>
              </div>
              <p className="font-semibold">{formatDate(listing.createdAt)}</p>
            </div>
          </div>

          <Separator />

          {/* Category & Languages */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <h3 className="font-semibold mb-3">Category</h3>
              <Badge className={getCategoryColor(listing.category)}>
                {listing.category?.charAt(0).toUpperCase() + listing.category?.slice(1)}
              </Badge>
            </div>
            
            {listing.languages && listing.languages.length > 0 && (
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Globe className="h-4 w-4" />
                  Languages
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.languages.map((lang: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          <Separator />

          {/* Location */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <MapPin className="h-4 w-4" />
              Location
            </h3>
            <div className="space-y-2">
              <p className="font-medium">{listing.location?.address || "No address provided"}</p>
              <p className="text-gray-600">
                {listing.location?.city || "Unknown City"}, {listing.location?.country || "Unknown Country"}
              </p>
              {listing.meetingPoint && (
                <div className="mt-3">
                  <p className="text-sm font-medium text-gray-500">Meeting Point:</p>
                  <p className="text-gray-700">{listing.meetingPoint}</p>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Guide Information */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Guide Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm font-medium text-gray-500">Name</p>
                  <p className="font-semibold">{listing.guide?.name || "Unknown"}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500">Email</p>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-gray-400" />
                    <p className="font-medium">{listing.guide?.email || "No email"}</p>
                  </div>
                </div>
                {listing.guide?.phone && (
                  <div>
                    <p className="text-sm font-medium text-gray-500">Phone</p>
                    <div className="flex items-center gap-2">
                      <Phone className="h-4 w-4 text-gray-400" />
                      <p className="font-medium">{listing.guide.phone}</p>
                    </div>
                  </div>
                )}
              </div>
              <div className="mt-4">
                <p className="text-sm font-medium text-gray-500">Guide ID</p>
                <p className="font-mono text-sm">{listing.guide?._id || "No ID"}</p>
              </div>
            </div>
          </div>

          {/* Available Dates */}
          {listing.availableDates && listing.availableDates.length > 0 && (
            <>
              <Separator />
              <div>
                <h3 className="font-semibold mb-3 flex items-center gap-2">
                  <Calendar className="h-4 w-4" />
                  Available Dates ({listing.availableDates.length})
                </h3>
                <div className="flex flex-wrap gap-2">
                  {listing.availableDates.slice(0, 5).map((date: string, index: number) => (
                    <Badge key={index} variant="outline">
                      {formatDate(date)}
                    </Badge>
                  ))}
                  {listing.availableDates.length > 5 && (
                    <Badge variant="outline" className="bg-gray-100">
                      +{listing.availableDates.length - 5} more
                    </Badge>
                  )}
                </div>
              </div>
            </>
          )}

          <Separator />

          {/* Actions */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
            <Button
              variant="default"
              onClick={onEdit}
            >
              <Edit className="h-4 w-4 mr-2" />
              Edit Listing
            </Button>
            <Button
              variant="secondary"
              onClick={() => window.open(`/listings/${listing._id}`, '_blank')}
            >
              <ExternalLink className="h-4 w-4 mr-2" />
              View Public Page
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
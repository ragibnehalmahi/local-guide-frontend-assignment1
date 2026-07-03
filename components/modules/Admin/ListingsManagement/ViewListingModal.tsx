// components/modules/Admin/ListingsManagement/ViewListingModal.tsx
"use client";

import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle 
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  MapPin, 
  User, 
  DollarSign, 
  Clock, 
  Users, 
  Calendar,
  Globe,
  Star,
  Image as ImageIcon,
  Mail,
  Phone,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";
import { format } from "date-fns";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  status: "active" | "inactive" | "pending";
  location: {
    city: string;
    country: string;
    address?: string;
    coordinates?: {
      lat: number;
      lng: number;
    };
  };
  maxGroupSize: number;
  images: string[];
  isFeatured?: boolean;
  meetingPoint?: string;
  inclusions?: string[];
  requirements?: string[];
  guide: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
    rating?: number;
    totalReviews?: number;
  };
  createdAt: string;
  updatedAt: string;
  bookingsCount?: number;
  averageRating?: number;
}

interface ViewListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ViewListingModal({ 
  listing, 
  isOpen, 
  onClose 
}: ViewListingModalProps) {
  if (!listing) return null;

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "active":
        return <CheckCircle className="h-4 w-4 text-green-500" />;
      case "inactive":
        return <XCircle className="h-4 w-4 text-red-500" />;
      case "pending":
        return <AlertCircle className="h-4 w-4 text-yellow-500" />;
      default:
        return <AlertCircle className="h-4 w-4 text-gray-500" />;
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "inactive":
        return "bg-red-100 text-red-800";
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      history: "bg-purple-100 text-purple-800",
      food: "bg-red-100 text-red-800",
      art: "bg-blue-100 text-blue-800",
      adventure: "bg-green-100 text-green-800",
      nature: "bg-emerald-100 text-emerald-800",
      shopping: "bg-pink-100 text-pink-800",
      nightlife: "bg-indigo-100 text-indigo-800",
      photography: "bg-amber-100 text-amber-800",
      culture: "bg-rose-100 text-rose-800",
      other: "bg-gray-100 text-gray-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const formatDate = (dateString: string) => {
    return format(new Date(dateString), "PPpp");
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            {listing.title}
            {listing.isFeatured && (
              <Badge className="bg-yellow-100 text-yellow-800">
                <Star className="h-3 w-3 mr-1" />
                Featured
              </Badge>
            )}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Images Gallery */}
          {listing.images && listing.images.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-2">
              <div className="md:col-span-2">
                <div className="h-64 rounded-lg overflow-hidden">
                  <img
                    src={listing.images[0]}
                    alt={listing.title}
                    className="w-full h-full object-cover"
                  />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                {listing.images.slice(1, 5).map((image, index) => (
                  <div key={index} className="h-32 rounded-lg overflow-hidden">
                    <img
                      src={image}
                      alt={`${listing.title} ${index + 2}`}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
                {listing.images.length > 5 && (
                  <div className="h-32 rounded-lg bg-gray-100 flex items-center justify-center">
                    <span className="text-gray-500">
                      +{listing.images.length - 5} more
                    </span>
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="h-48 rounded-lg bg-gray-100 flex items-center justify-center">
              <ImageIcon className="h-12 w-12 text-gray-400" />
            </div>
          )}

          {/* Basic Info Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <DollarSign className="h-4 w-4" />
                <span className="text-sm">Price</span>
              </div>
              <div className="text-2xl font-bold text-green-600">
                ${listing.price}
              </div>
              <p className="text-xs text-gray-500">per person</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Duration</span>
              </div>
              <div className="text-2xl font-bold">
                {listing.duration}h
              </div>
              <p className="text-xs text-gray-500">tour duration</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                <Users className="h-4 w-4" />
                <span className="text-sm">Group Size</span>
              </div>
              <div className="text-2xl font-bold">
                {listing.maxGroupSize}
              </div>
              <p className="text-xs text-gray-500">max guests</p>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-2 text-gray-600 mb-1">
                {getStatusIcon(listing.status)}
                <span className="text-sm">Status</span>
              </div>
              <Badge className={getStatusColor(listing.status)}>
                {listing.status.toUpperCase()}
              </Badge>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-lg font-medium mb-2">Description</h3>
            <p className="text-gray-700 whitespace-pre-line">
              {listing.description}
            </p>
          </div>

          {/* Location Details */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <MapPin className="h-5 w-5" />
              Location Details
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex items-center gap-2">
                <Globe className="h-4 w-4 text-gray-500" />
                <span className="font-medium">
                  {listing.location.city}, {listing.location.country}
                </span>
              </div>
              {listing.location.address && (
                <div className="text-sm text-gray-600">
                  {listing.location.address}
                </div>
              )}
              {listing.meetingPoint && (
                <div>
                  <div className="text-sm font-medium text-gray-700">Meeting Point:</div>
                  <div className="text-sm text-gray-600">{listing.meetingPoint}</div>
                </div>
              )}
            </div>
          </div>

          {/* Category and Tags */}
          <div>
            <h3 className="text-lg font-medium mb-2">Category & Tags</h3>
            <div className="flex flex-wrap gap-2">
              <Badge className={getCategoryColor(listing.category)}>
                {listing.category.charAt(0).toUpperCase() + listing.category.slice(1)}
              </Badge>
              {listing.inclusions?.map((inclusion, index) => (
                <Badge key={index} variant="outline">
                  {inclusion}
                </Badge>
              ))}
            </div>
          </div>

          {/* Guide Information */}
          <div>
            <h3 className="text-lg font-medium mb-2 flex items-center gap-2">
              <User className="h-5 w-5" />
              Guide Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg">
              <div className="flex items-center gap-4">
                <div className="h-16 w-16 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden">
                  {listing.guide.profilePicture ? (
                    <img
                      src={listing.guide.profilePicture}
                      alt={listing.guide.name}
                      className="h-full w-full object-cover"
                    />
                  ) : (
                    <User className="h-8 w-8 text-gray-600" />
                  )}
                </div>
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h4 className="text-lg font-bold">{listing.guide.name}</h4>
                    {listing.guide.rating && (
                      <Badge className="bg-blue-100 text-blue-800">
                        <Star className="h-3 w-3 mr-1" />
                        {listing.guide.rating.toFixed(1)}
                      </Badge>
                    )}
                  </div>
                  <div className="space-y-1 text-sm text-gray-600">
                    <div className="flex items-center gap-2">
                      <Mail className="h-4 w-4" />
                      <span>{listing.guide.email}</span>
                    </div>
                    {listing.guide.phone && (
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4" />
                        <span>{listing.guide.phone}</span>
                      </div>
                    )}
                    {listing.guide.totalReviews && (
                      <div className="text-sm">
                        {listing.guide.totalReviews} reviews
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Requirements */}
          {listing.requirements && listing.requirements.length > 0 && (
            <div>
              <h3 className="text-lg font-medium mb-2">Requirements</h3>
              <ul className="list-disc pl-5 space-y-1 text-gray-700">
                {listing.requirements.map((req, index) => (
                  <li key={index}>{req}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Stats and Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Dates</h4>
              <div className="space-y-1 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>{formatDate(listing.createdAt)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span>{formatDate(listing.updatedAt)}</span>
                </div>
              </div>
            </div>

            <div className="bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-2">Statistics</h4>
              <div className="space-y-1 text-sm">
                {listing.bookingsCount !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Total Bookings:</span>
                    <span className="font-medium">{listing.bookingsCount}</span>
                  </div>
                )}
                {listing.averageRating !== undefined && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Average Rating:</span>
                    <div className="flex items-center gap-1">
                      <Star className="h-3 w-3 text-yellow-500" />
                      <span className="font-medium">
                        {listing.averageRating.toFixed(1)}/5
                      </span>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Close Button */}
          <div className="pt-4 border-t">
            <Button onClick={onClose} className="w-full">
              Close
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
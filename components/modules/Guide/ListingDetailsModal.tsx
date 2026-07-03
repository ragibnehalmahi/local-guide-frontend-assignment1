"use client";

import { IListing } from "@/types/listing.interface";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Badge } from "@/components/ui/badge";
import { MapPin, Clock, Users, Star, Calendar as CalendarIcon, Languages } from "lucide-react";
import Image from "next/image";

interface ListingDetailsModalProps {
  listing: IListing | null;
  isOpen: boolean;
  onClose: () => void;
}

export default function ListingDetailsModal({ listing, isOpen, onClose }: ListingDetailsModalProps) {
  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-center gap-2 mb-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
              {listing.category}
            </Badge>
            {listing.active ? (
              <Badge className="bg-green-100 text-green-700 border-green-200">Active</Badge>
            ) : (
              <Badge variant="destructive">Inactive</Badge>
            )}
          </div>
          <DialogTitle className="text-2xl font-bold text-slate-900">{listing.title}</DialogTitle>
          <div className="flex items-center text-slate-500 text-sm mt-1">
            <MapPin className="w-4 h-4 mr-1" />
            {listing.location.address}, {listing.location.city}, {listing.location.country}
          </div>
        </DialogHeader>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mt-4">
          {/* Images */}
          <div className="space-y-4">
            <div className="relative aspect-video rounded-xl overflow-hidden bg-slate-100 border">
              {listing.images && listing.images.length > 0 ? (
                <img
                  src={listing.images[0]}
                  alt={listing.title}
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="flex items-center justify-center h-full text-slate-400">
                  No image available
                </div>
              )}
            </div>
            {listing.images && listing.images.length > 1 && (
              <div className="grid grid-cols-4 gap-2">
                {listing.images.slice(1, 5).map((img, index) => (
                  <div key={index} className="relative aspect-square rounded-md overflow-hidden bg-slate-100 border">
                    <img src={img} alt={`${listing.title} ${index + 2}`} className="w-full h-full object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Price</p>
                <p className="text-xl font-bold text-slate-900">${listing.price}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Duration</p>
                <p className="font-semibold text-slate-900 flex items-center gap-1">
                  <Clock className="w-4 h-4 text-slate-400" />
                  {listing.durationHours} hours
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Max Group Size</p>
                <p className="font-semibold text-slate-900 flex items-center gap-1">
                  <Users className="w-4 h-4 text-slate-400" />
                  {listing.maxGroupSize} people
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-lg border border-slate-100">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wider mb-1">Languages</p>
                <div className="flex flex-wrap gap-1 mt-1">
                  {listing.languages && listing.languages.map((lang, idx) => (
                    <Badge key={idx} variant="secondary" className="text-[10px] py-0 px-1.5 h-auto">
                      {lang}
                    </Badge>
                  ))}
                </div>
              </div>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Description</h4>
              <p className="text-sm text-slate-600 leading-relaxed whitespace-pre-line">
                {listing.description}
              </p>
            </div>

            <div>
              <h4 className="text-sm font-semibold text-slate-900 mb-2">Meeting Point</h4>
              <div className="flex items-start gap-2 text-sm text-slate-600 bg-blue-50/50 p-3 rounded-lg border border-blue-100/50">
                <MapPin className="w-4 h-4 text-blue-500 mt-0.5 shrink-0" />
                <span>{listing.meetingPoint}</span>
              </div>
            </div>

            {listing.availableDates && listing.availableDates.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-900 mb-2">Available Dates</h4>
                <div className="flex flex-wrap gap-2">
                  {listing.availableDates.map((date, idx) => (
                    <Badge key={idx} variant="outline" className="text-xs font-normal">
                      {new Date(date).toLocaleDateString()}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

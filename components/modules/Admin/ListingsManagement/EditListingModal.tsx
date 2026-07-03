// components/modules/Admin/ListingsManagement/EditListingModal.tsx
"use client";

import { useState, useEffect } from "react";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";
import { updateListing, updateListingStatus } from "@/services/admin/admin.service";
import { ListingStatus } from "@/types/listing.interface";

interface Listing {
  _id: string;
  title: string;
  description: string;
  price: number;
  duration: number;
  category: string;
  status: "PENDING" | "APPROVED" | "REJECTED" | "BLOCKED";
  location: {
    city: string;
    country: string;
    address?: string;
  };
  maxGroupSize: number;
  images: string[];
  isFeatured?: boolean;
  guide: {
    _id: string;
    name: string;
    email: string;
  };
}

interface EditListingModalProps {
  listing: Listing | null;
  isOpen: boolean;
  onClose: () => void;
  onUpdate: () => void;
}

export default function EditListingModal({ 
  listing, 
  isOpen, 
  onClose, 
  onUpdate 
}: EditListingModalProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Listing>>({});
  const [status, setStatus] = useState<string>("");

  // Initialize form data when listing changes
  useEffect(() => {
    if (listing) {
      setFormData({
        title: listing.title,
        description: listing.description,
        price: listing.price,
        duration: listing.duration,
        category: listing.category,
        location: listing.location,
        maxGroupSize: listing.maxGroupSize,
        status: listing.status,
        isFeatured: listing.isFeatured || false,
      });
      setStatus(listing.status);
    }
  }, [listing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === "price" || name === "duration" || name === "maxGroupSize" 
        ? Number(value) 
        : value
    }));
  };

  const handleNestedChange = (field: string, subfield: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: {
        ...(prev[field as keyof Listing] as any),
        [subfield]: value
      }
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!listing) return;

    try {
      setLoading(true);
      
      // Update listing details
      const response = await updateListing(listing._id, formData);
      
      if (response.success) {
        toast.success("Listing updated successfully");
        onUpdate();
        onClose();
      } else {
        toast.error(response.message || "Failed to update listing");
      }
    } catch (error: any) {
      console.error("Error updating listing:", error);
      toast.error(error.message || "Failed to update listing");
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (newStatus: string) => {
    if (!listing) return;

    try {
      setLoading(true);
      const response = await updateListingStatus(listing._id, newStatus as ListingStatus);
      
      if (response.success) {
        toast.success(`Listing status updated to ${newStatus}`);
        setStatus(newStatus);
        onUpdate();
      } else {
        toast.error(response.message || "Failed to update status");
      }
    } catch (error: any) {
      toast.error(error.message || "Failed to update status");
    } finally {
      setLoading(false);
    }
  };

  if (!listing) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-3xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Listing: {listing.title}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Status Quick Update */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <div className="flex items-center justify-between">
              <div>
                <h4 className="font-medium">Listing Status</h4>
                <p className="text-sm text-gray-500">Quickly update listing status</p>
              </div>
              <div className="flex gap-2">
                {["PENDING", "APPROVED", "REJECTED", "BLOCKED"].map((stat) => (
                  <Button
                    key={stat}
                    type="button"
                    variant={status.toUpperCase() === stat ? "default" : "outline"}
                    size="sm"
                    onClick={() => handleStatusChange(stat)}
                    disabled={loading}
                  >
                    {stat.charAt(0).toUpperCase() + stat.slice(1).toLowerCase()}
                  </Button>
                ))}
              </div>
            </div>
          </div>

          {/* Basic Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title || ""}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  name="price"
                  type="number"
                  value={formData.price || ""}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  min="0"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="duration">Duration (hours) *</Label>
                <Input
                  id="duration"
                  name="duration"
                  type="number"
                  value={formData.duration || ""}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  min="1"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxGroupSize">Max Group Size *</Label>
                <Input
                  id="maxGroupSize"
                  name="maxGroupSize"
                  type="number"
                  value={formData.maxGroupSize || ""}
                  onChange={handleInputChange}
                  required
                  disabled={loading}
                  min="1"
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="category">Category *</Label>
              <Select
                value={formData.category || ""}
                onValueChange={(value) => setFormData({...formData, category: value})}
                disabled={loading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="history">History</SelectItem>
                  <SelectItem value="food">Food</SelectItem>
                  <SelectItem value="art">Art</SelectItem>
                  <SelectItem value="adventure">Adventure</SelectItem>
                  <SelectItem value="nature">Nature</SelectItem>
                  <SelectItem value="shopping">Shopping</SelectItem>
                  <SelectItem value="nightlife">Nightlife</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description *</Label>
              <Textarea
                id="description"
                name="description"
                value={formData.description || ""}
                onChange={handleInputChange}
                required
                disabled={loading}
                rows={4}
                placeholder="Describe the tour experience..."
              />
            </div>
          </div>

          {/* Location Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Location Details</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="city">City *</Label>
                <Input
                  id="city"
                  value={formData.location?.city || ""}
                  onChange={(e) => handleNestedChange("location", "city", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="country">Country *</Label>
                <Input
                  id="country"
                  value={formData.location?.country || ""}
                  onChange={(e) => handleNestedChange("location", "country", e.target.value)}
                  required
                  disabled={loading}
                />
              </div>

              <div className="space-y-2 md:col-span-2">
                <Label htmlFor="address">Address</Label>
                <Input
                  id="address"
                  value={formData.location?.address || ""}
                  onChange={(e) => handleNestedChange("location", "address", e.target.value)}
                  disabled={loading}
                  placeholder="Full address (optional)"
                />
              </div>
            </div>
          </div>

          {/* Featured Status */}
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div>
              <h4 className="font-medium">Featured Listing</h4>
              <p className="text-sm text-gray-500">
                Featured listings appear prominently on the homepage
              </p>
            </div>
            <Switch
              checked={formData.isFeatured || false}
              onCheckedChange={(checked) => 
                setFormData({...formData, isFeatured: checked})
              }
              disabled={loading}
            />
          </div>

          {/* Guide Information (Read-only) */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Guide Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <Label className="text-sm text-gray-500">Guide Name</Label>
                <p className="font-medium">{listing.guide.name}</p>
              </div>
              <div>
                <Label className="text-sm text-gray-500">Email</Label>
                <p className="font-medium">{listing.guide.email}</p>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Guide information cannot be modified. Contact the guide directly for changes.
            </p>
          </div>

          {/* Dialog Footer */}
          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
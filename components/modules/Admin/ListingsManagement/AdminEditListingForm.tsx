// components/modules/Admin/ListingsManagement/AdminEditListingForm.tsx
"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateListing } from "@/services/admin/admin.service";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";

interface AdminEditListingFormProps {
  listing: any;
  onSuccess: () => void;
  onCancel: () => void;
}

export default function AdminEditListingForm({ listing, onSuccess, onCancel }: AdminEditListingFormProps) {
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    title: listing.title || "",
    description: listing.description || "",
    price: listing.price?.toString() || "0",
    durationHours: listing.durationHours?.toString() || listing.duration?.toString() || "1",
    maxGroupSize: listing.maxGroupSize?.toString() || "10",
    category: listing.category || "history",
    status: listing.status || "pending",
    isFeatured: listing.isFeatured || false,
    adminNotes: listing.adminNotes || ""
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const payload = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        durationHours: parseInt(formData.durationHours),
        maxGroupSize: parseInt(formData.maxGroupSize),
        category: formData.category,
        status: formData.status,
        isFeatured: formData.isFeatured,
        adminNotes: formData.adminNotes
      };

      const result = await updateListing(listing._id, payload);
      
      if (result.success) {
        toast.success("Listing updated successfully!");
        onSuccess();
      } else {
        toast.error(result.message || "Update failed");
      }
    } catch (error: any) {
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Card>
      <CardContent className="pt-6">
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Listing Information</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="title">Title *</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({...formData, title: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => setFormData({...formData, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="history">History</SelectItem>
                    <SelectItem value="food">Food</SelectItem>
                    <SelectItem value="art">Art</SelectItem>
                    <SelectItem value="adventure">Adventure</SelectItem>
                    <SelectItem value="nature">Nature</SelectItem>
                    <SelectItem value="shopping">Shopping</SelectItem>
                    <SelectItem value="nightlife">Nightlife</SelectItem>
                    <SelectItem value="culture">Culture</SelectItem>
                    <SelectItem value="architecture">Architecture</SelectItem>
                    <SelectItem value="sports">Sports</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData({...formData, description: e.target.value})}
                rows={4}
              />
            </div>
          </div>

          <Separator />

          {/* Pricing & Details */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Pricing & Details</h3>
            
            <div className="grid gap-4 md:grid-cols-3">
              <div className="space-y-2">
                <Label htmlFor="price">Price ($) *</Label>
                <Input
                  id="price"
                  type="number"
                  min="0"
                  step="0.01"
                  value={formData.price}
                  onChange={(e) => setFormData({...formData, price: e.target.value})}
                  required
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="durationHours">Duration (hours)</Label>
                <Input
                  id="durationHours"
                  type="number"
                  min="1"
                  max="24"
                  value={formData.durationHours}
                  onChange={(e) => setFormData({...formData, durationHours: e.target.value})}
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="maxGroupSize">Max Group Size</Label>
                <Input
                  id="maxGroupSize"
                  type="number"
                  min="1"
                  max="100"
                  value={formData.maxGroupSize}
                  onChange={(e) => setFormData({...formData, maxGroupSize: e.target.value})}
                />
              </div>
            </div>
          </div>

          <Separator />

          {/* Admin Controls */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Admin Controls</h3>
            
            <div className="grid gap-4 md:grid-cols-2">
              <div className="space-y-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={formData.status}
                  onValueChange={(value) => setFormData({...formData, status: value})}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="active">
                      <Badge className="bg-green-100 text-green-800">Active</Badge>
                    </SelectItem>
                    <SelectItem value="inactive">
                      <Badge className="bg-red-100 text-red-800">Inactive</Badge>
                    </SelectItem>
                    <SelectItem value="pending">
                      <Badge className="bg-yellow-100 text-yellow-800">Pending</Badge>
                    </SelectItem>
                    <SelectItem value="rejected">
                      <Badge className="bg-gray-100 text-gray-800">Rejected</Badge>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 border rounded-md">
                <div>
                  <Label htmlFor="isFeatured" className="font-medium">Featured Listing</Label>
                  <p className="text-sm text-muted-foreground">Show in featured section</p>
                </div>
                <Switch
                  checked={formData.isFeatured}
                  onCheckedChange={(checked) => setFormData({...formData, isFeatured: checked})}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="adminNotes">Admin Notes</Label>
              <Textarea
                id="adminNotes"
                value={formData.adminNotes}
                onChange={(e) => setFormData({...formData, adminNotes: e.target.value})}
                placeholder="Add internal notes about this listing..."
                rows={3}
              />
              <p className="text-sm text-muted-foreground">
                These notes are only visible to admins, not the guide
              </p>
            </div>
          </div>

          <Separator />

          {/* Buttons */}
          <div className="flex justify-end gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onCancel}
              disabled={loading}
              className="min-w-[100px]"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={loading}
              className="min-w-[120px]"
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Listing"
              )}
            </Button>
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
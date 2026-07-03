// src/components/modules/guide/EditListingForm.tsx
 
"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { updateListing } from  "@/services/listing/listing.service";
import { IListing, ListingCategory } from "@/types/listing.interface";
import { Loader2, MapPin, Calendar, X, Plus, AlertCircle, ArrowLeft } from "lucide-react";
import CloudinaryUploader from "@/components/ui/CloudinaryUploader";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import { toast } from "sonner";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import Link from "next/link";

interface EditListingFormProps {
  listing: IListing;
}

const EditListingForm = ({ listing }: EditListingFormProps) => {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [hasChanges, setHasChanges] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  
  // Validate listing data
  if (!listing || !listing._id) {
    return (
      <div className="max-w-4xl mx-auto text-center py-10">
        <Alert variant="destructive" className="mb-6">
          <AlertCircle className="h-4 w-4" />
          <AlertDescription>
            Invalid listing data. Unable to load the listing.
          </AlertDescription>
        </Alert>
        <Link
          href="/guide/dashboard/listing"
          className="inline-flex items-center text-sm font-medium text-primary hover:underline"
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Listings
        </Link>
      </div>
    );
  }

  // Form state
  const [formData, setFormData] = useState({
    title: listing.title || "",
    description: listing.description || "",
    price: listing.price?.toString() || "0",
    durationHours: listing.durationHours?.toString() || "1",
    maxGroupSize: listing.maxGroupSize?.toString() || "10",
    meetingPoint: listing.meetingPoint || "",
    category: listing.category || ListingCategory.HISTORY,
    address: listing.location?.address || "",
    city: listing.location?.city || "",
    country: listing.location?.country || ""
  });

  const [languages, setLanguages] = useState<string[]>(listing.languages || ["English"]);
  const [newLanguage, setNewLanguage] = useState('');
  
  const [availableDates, setAvailableDates] = useState<string[]>(
    listing.availableDates?.map(date => {
      try {
        return new Date(date).toISOString().split('T')[0];
      } catch {
        // Return today's date as fallback
        return new Date().toISOString().split('T')[0];
      }
    }) || []
  );
  const [newDate, setNewDate] = useState('');

  const [images, setImages] = useState<string[]>(listing.images || []);

  const handleImagesUpload = (urls: string[]) => {
    setImages(urls);
    console.log('📸 Images updated:', urls);
  };

  // Track changes
  useEffect(() => {
    const originalData = {
      title: listing.title || "",
      description: listing.description || "",
      price: listing.price?.toString() || "0",
      durationHours: listing.durationHours?.toString() || "1",
      maxGroupSize: listing.maxGroupSize?.toString() || "10",
      meetingPoint: listing.meetingPoint || "",
      category: listing.category || ListingCategory.HISTORY,
      address: listing.location?.address || "",
      city: listing.location?.city || "",
      country: listing.location?.country || "",
      languages: listing.languages || ["English"],
      images: listing.images || [],
      availableDates: listing.availableDates?.map(date => {
        try {
          return new Date(date).toISOString().split('T')[0];
        } catch {
          return new Date().toISOString().split('T')[0];
        }
      }) || []
    };

    const currentData = {
      title: formData.title,
      description: formData.description,
      price: formData.price,
      durationHours: formData.durationHours,
      maxGroupSize: formData.maxGroupSize,
      meetingPoint: formData.meetingPoint,
      category: formData.category,
      address: formData.address,
      city: formData.city,
      country: formData.country,
      languages,
      images,
      availableDates
    };

    setHasChanges(JSON.stringify(originalData) !== JSON.stringify(currentData));
  }, [formData, languages, images, availableDates, listing]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement  | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage('');
    } else if (newLanguage.trim() && languages.includes(newLanguage.trim())) {
      toast.error("Language already added");
      setNewLanguage('');
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  const addDate = () => {
    if (newDate && !availableDates.includes(newDate)) {
      setAvailableDates([...availableDates, newDate]);
      setNewDate('');
    } else if (newDate && availableDates.includes(newDate)) {
      toast.error("Date already added");
      setNewDate('');
    }
  };

  const removeDate = (date: string) => {
    setAvailableDates(availableDates.filter(d => d !== date));
  };


  const validateForm = (): boolean => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.price || parseFloat(formData.price) <= 0) errors.push("Valid price is required");
    if (!formData.durationHours || parseInt(formData.durationHours) < 1) errors.push("Valid duration is required");
    if (!formData.maxGroupSize || parseInt(formData.maxGroupSize) < 1) errors.push("Valid group size is required");
    if (!formData.meetingPoint.trim()) errors.push("Meeting point is required");
    if (!formData.category) errors.push("Category is required");
    if (!formData.address.trim()) errors.push("Address is required");
    if (!formData.city.trim()) errors.push("City is required");
    if (!formData.country.trim()) errors.push("Country is required");
    if (availableDates.length === 0) errors.push("At least one available date is required");
    if (languages.length === 0) errors.push("At least one language is required");

    if (errors.length > 0) {
      toast.error(errors[0]);
      return false;
    }

    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    if (!hasChanges) {
      toast.info("No changes detected");
      return;
    }

    setIsSubmitting(true);

    try {
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        durationHours: parseInt(formData.durationHours),
        maxGroupSize: parseInt(formData.maxGroupSize),
        meetingPoint: formData.meetingPoint,
        languages,
        category: formData.category as ListingCategory,
        images,
        location: {
          address: formData.address,
          city: formData.city,
          country: formData.country
        },
        availableDates
      };

      console.log("📤 Updating listing:", listingData);

      const result = await updateListing(listing._id, listingData);
      
      if (result.success) {
        toast.success("Listing updated successfully!");
        router.push("/guide/dashboard/listings");
        router.refresh();
      } else {
        toast.error(result.message || "Failed to update listing");
      }
    } catch (error: any) {
      console.error("Error updating listing:", error);
      toast.error(error.message || "An error occurred while updating listing");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCancel = () => {
    if (hasChanges) {
      if (confirm("You have unsaved changes. Are you sure you want to discard them?")) {
        router.back();
      }
    } else {
      router.back();
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <Link
            href="/guide/dashboard/listings"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-foreground mb-2"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Listings
          </Link>
          <h1 className="text-3xl font-bold tracking-tight">Edit Tour Listing</h1>
          <p className="text-muted-foreground mt-2">
            Update your tour listing details
          </p>
        </div>
        <Badge variant={listing.active ? "default" : "secondary"}>
          {listing.active ? "Active" : "Inactive"}
        </Badge>
      </div>

      <Card>
        <CardContent className="pt-6">
          {!hasChanges && (
            <Alert className="mb-6 bg-muted">
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                No changes made yet. Edit the form below to update your listing.
              </AlertDescription>
            </Alert>
          )}

          <form onSubmit={handleSubmit} className="space-y-8">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Basic Information</h3>
              
              <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                  <Label htmlFor="title">Tour Title *</Label>
                  <Input
                    id="title"
                    name="title"
                    value={formData.title}
                    onChange={handleInputChange}
                    placeholder="e.g., Hidden Gems of Old Town"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={formData.category}
                    onValueChange={(value) => handleSelectChange('category', value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      {Object.values(ListingCategory).map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat.charAt(0).toUpperCase() + cat.slice(1)}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="description">Description *</Label>
                <Textarea
                  id="description"
                  name="description"
                  value={formData.description}
                  onChange={handleInputChange}
                  rows={6}
                  placeholder="Describe your tour in detail..."
                  required
                />
              </div>
            </div>
            
            <Separator />
            
            {/* Pricing & Duration */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Pricing & Duration</h3>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="price">Price per person ($) *</Label>
                  <Input
                    id="price"
                    name="price"
                    type="number"
                    min="1"
                    step="0.01"
                    value={formData.price}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="durationHours">Duration (hours) *</Label>
                  <Input
                    id="durationHours"
                    name="durationHours"
                    type="number"
                    min="1"
                    max="24"
                    value={formData.durationHours}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="maxGroupSize">Max Group Size *</Label>
                  <Input
                    id="maxGroupSize"
                    name="maxGroupSize"
                    type="number"
                    min="1"
                    max="50"
                    value={formData.maxGroupSize}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>
            
            <Separator />
            
            {/* Location */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Location</h3>
              </div>
              
              <div className="grid gap-4 md:grid-cols-3">
                <div className="space-y-2">
                  <Label htmlFor="address">Address *</Label>
                  <Input
                    id="address"
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="Street address"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="city">City *</Label>
                  <Input
                    id="city"
                    name="city"
                    value={formData.city}
                    onChange={handleInputChange}
                    placeholder="City name"
                    required
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="country">Country *</Label>
                  <Input
                    id="country"
                    name="country"
                    value={formData.country}
                    onChange={handleInputChange}
                    placeholder="Country"
                    required
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="meetingPoint">Meeting Point *</Label>
                <Input
                  id="meetingPoint"
                  name="meetingPoint"
                  value={formData.meetingPoint}
                  onChange={handleInputChange}
                  placeholder="Exact meeting location"
                  required
                />
                <p className="text-sm text-muted-foreground">
                  Be specific about where tourists should meet you
                </p>
              </div>
            </div>
            
            <Separator />
            
            {/* Languages */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Languages *</h3>
              
              <div className="flex gap-2">
                <Input
                  value={newLanguage}
                  onChange={(e) => setNewLanguage(e.target.value)}
                  placeholder="Add a language (e.g., Spanish)"
                  onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLanguage())}
                />
                <Button 
                  type="button" 
                  onClick={addLanguage}
                  disabled={!newLanguage.trim()}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
              
              {languages.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {languages.map((lang) => (
                    <Badge key={lang} variant="secondary" className="px-3 py-1">
                      {lang}
                      <button
                        type="button"
                        onClick={() => removeLanguage(lang)}
                        className="ml-2 hover:text-destructive"
                      >
                        <X className="h-3 w-3" />
                      </button>
                    </Badge>
                  ))}
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    At least one language is required
                  </AlertDescription>
                </Alert>
              )}
              
              <p className="text-sm text-muted-foreground">
                List all languages you can conduct the tour in
              </p>
            </div>
            
            <Separator />
            
            {/* Available Dates */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Calendar className="h-5 w-5" />
                <h3 className="text-lg font-semibold">Available Dates *</h3>
              </div>
              
              <div className="flex gap-2">
                <Input
                  type="date"
                  value={newDate}
                  onChange={(e) => setNewDate(e.target.value)}
                  min={today}
                  className="flex-1"
                />
                <Button 
                  type="button" 
                  onClick={addDate}
                  disabled={!newDate}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Date
                </Button>
              </div>
              
              {availableDates.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium">Selected Dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date) => (
                      <Badge key={date} variant="outline" className="px-3 py-1">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                        <button
                          type="button"
                          onClick={() => removeDate(date)}
                          className="ml-2 hover:text-destructive"
                        >
                          <X className="h-3 w-3" />
                        </button>
                      </Badge>
                    ))}
                  </div>
                </div>
              ) : (
                <Alert variant="destructive">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    No dates selected yet. Add at least one available date.
                  </AlertDescription>
                </Alert>
              )}
            </div>
            
            <Separator />
            
            {/* Images */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Tour Images</h3>
              
              <div className="space-y-2">
                <Label>Upload Tour Images *</Label>
                <CloudinaryUploader
                  onUploadComplete={handleImagesUpload}
                  maxImages={10}
                  existingImages={images}
                />
                
                {images.length === 0 && (
                  <Alert variant="destructive" className="mt-4">
                    <AlertCircle className="h-4 w-4" />
                    <AlertDescription>
                      At least one image is required
                    </AlertDescription>
                  </Alert>
                )}
              </div>
              
              <p className="text-sm text-muted-foreground">
                Add images to make your listing more attractive. You can add up to 10 images.
              </p>
            </div>
            
            <Separator />
            
            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <Button
                type="button"
                variant="outline"
                onClick={handleCancel}
                disabled={isSubmitting}
                className="sm:w-1/4"
              >
                Cancel
              </Button>
              
              <div className="flex gap-4 sm:w-3/4 justify-end">
                <Button
                  type="button"
                  variant="secondary"
                  onClick={() => {
                    if (confirm("Reset all changes?")) {
                      // Reset to original data
                      setFormData({
                        title: listing.title || "",
                        description: listing.description || "",
                        price: listing.price?.toString() || "0",
                        durationHours: listing.durationHours?.toString() || "1",
                        maxGroupSize: listing.maxGroupSize?.toString() || "10",
                        meetingPoint: listing.meetingPoint || "",
                        category: listing.category || ListingCategory.HISTORY,
                        address: listing.location?.address || "",
                        city: listing.location?.city || "",
                        country: listing.location?.country || ""
                      });
                      setLanguages(listing.languages || ["English"]);
                      setImages(listing.images || []);
                      setAvailableDates(
                        listing.availableDates?.map(date => 
                          new Date(date).toISOString().split('T')[0]
                        ) || []
                      );
                      toast.info("Form reset to original values");
                    }
                  }}
                  disabled={isSubmitting}
                >
                  Reset
                </Button>
                
                <Button
                  type="submit"
                  disabled={isSubmitting || !hasChanges}
                  className="min-w-[150px]"
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Updating...
                    </>
                  ) : (
                    "Update Listing"
                  )}
                </Button>
              </div>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default EditListingForm;
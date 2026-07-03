// // components/modules/guide/CreateListingForm.tsx

"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Loader2, MapPin, Calendar, X, Plus, AlertCircle, Users, Clock, DollarSign } from "lucide-react";
import { createListing } from "@/services/listing/listing.service";
import { ListingCategory } from "@/types/listing.interface";
import CloudinaryUploader from "@/components/ui/CloudinaryUploader";

export default function CreateListingForm() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [newLanguage, setNewLanguage] = useState("");
  const [newDate, setNewDate] = useState("");

  // Form state - Backend schema অনুযায়ী
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "50",
    durationHours: "3",
    maxGroupSize: "10",
    meetingPoint: "",
    category: ListingCategory.FOOD,
    address: "",
    city: "",
    country: "",
  });

  const [languages, setLanguages] = useState<string[]>(["English"]);
  const [availableDates, setAvailableDates] = useState<string[]>([]);

  // ✅ Image URLs state (Cloudinary থেকে আসা URLs)
  const [imageUrls, setImageUrls] = useState<string[]>([]);

  // Handle input change
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Handle select change
  const handleSelectChange = (name: string, value: string) => {
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // Language functions
  const addLanguage = () => {
    if (newLanguage.trim() && !languages.includes(newLanguage.trim())) {
      setLanguages([...languages, newLanguage.trim()]);
      setNewLanguage("");
    }
  };

  const removeLanguage = (lang: string) => {
    setLanguages(languages.filter(l => l !== lang));
  };

  // Date functions
  const addDate = () => {
    if (newDate && !availableDates.includes(newDate)) {
      setAvailableDates([...availableDates, newDate]);
      setNewDate("");
    }
  };

  const removeDate = (date: string) => {
    setAvailableDates(availableDates.filter(d => d !== date));
  };

  // ✅ Images functions - শুধু URLs নিন
  const handleImagesUpload = (urls: string[]) => {
    setImageUrls(urls);
    console.log('📸 Images uploaded URLs:', urls);
  };

  // Form validation
  const validateForm = () => {
    const errors: string[] = [];

    if (!formData.title.trim()) errors.push("Title is required");
    if (!formData.description.trim()) errors.push("Description is required");
    if (!formData.price || parseFloat(formData.price) <= 0) errors.push("Valid price is required");
    if (!formData.durationHours || parseInt(formData.durationHours) < 1) errors.push("Valid duration is required");
    if (!formData.maxGroupSize || parseInt(formData.maxGroupSize) < 1) errors.push("Valid group size is required");
    if (!formData.meetingPoint.trim()) errors.push("Meeting point is required");
    if (!formData.address.trim()) errors.push("Address is required");
    if (!formData.city.trim()) errors.push("City is required");
    if (!formData.country.trim()) errors.push("Country is required");
    if (availableDates.length === 0) errors.push("At least one available date is required");
    if (languages.length === 0) errors.push("At least one language is required");
    if (imageUrls.length === 0) errors.push("At least one image is required");

    return errors;
  };

  // Handle form submission
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors = validateForm();
    if (errors.length > 0) {
      toast.error(errors[0]);
      return;
    }

    setIsSubmitting(true);

    try {
      // ✅ Backend যে ফরম্যাট expects করে
      const listingData = {
        title: formData.title,
        description: formData.description,
        price: parseFloat(formData.price),
        durationHours: parseInt(formData.durationHours),
        maxGroupSize: parseInt(formData.maxGroupSize),
        meetingPoint: formData.meetingPoint,
        category: formData.category,
        // ✅ Location fields আলাদা করে পাঠান
        address: formData.address,
        city: formData.city,
        country: formData.country,
        languages: languages,
        images: imageUrls,  // ✅ Cloudinary URLs
        availableDates: availableDates
      };

      console.log('📤 Sending listing data:', {
        ...listingData,
        images: `${listingData.images.length} images`
      });

      const result = await createListing(listingData);

      if (result.success) {
        toast.success("Tour listing created successfully!");
        router.push("/guide/dashboard/listings");
      } else {
        toast.error(result.message || "Failed to create listing");
      }
    } catch (error: any) {
      console.error("Error creating listing:", error);
      toast.error(error.message || "An error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const today = new Date().toISOString().split("T")[0];

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Create New Tour</h1>
        <p className="text-muted-foreground mt-2">
          Fill in the details to create your tour listing
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Tour Title *</Label>
                <Input
                  id="title"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Historic City Walking Tour"
                  required
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="category">Category *</Label>
                <Select
                  value={formData.category}
                  onValueChange={(value) => handleSelectChange("category", value)}
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
                placeholder="Describe your tour experience..."
                rows={4}
                required
              />
            </div>
          </CardContent>
        </Card>

        {/* Pricing & Duration */}
        <Card>
          <CardHeader>
            <CardTitle>Pricing & Duration</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="price">
                  <span className="flex items-center gap-1">
                    <DollarSign className="h-4 w-4" />
                    Price per person ($) *
                  </span>
                </Label>
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
                <Label htmlFor="durationHours">
                  <span className="flex items-center gap-1">
                    <Clock className="h-4 w-4" />
                    Duration (hours) *
                  </span>
                </Label>
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
                <Label htmlFor="maxGroupSize">
                  <span className="flex items-center gap-1">
                    <Users className="h-4 w-4" />
                    Max Group Size *
                  </span>
                </Label>
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
          </CardContent>
        </Card>

        {/* Location */}
        <Card>
          <CardHeader>
            <CardTitle>Location Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
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
                  placeholder="City"
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
            </div>
          </CardContent>
        </Card>

        {/* Languages */}
        <Card>
          <CardHeader>
            <CardTitle>Languages</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Languages You Can Guide In *</Label>
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
                <div className="flex flex-wrap gap-2 mt-2">
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
            </div>
          </CardContent>
        </Card>

        {/* Available Dates */}
        <Card>
          <CardHeader>
            <CardTitle>Available Dates</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Select Available Dates *</Label>
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
                <div className="space-y-2 mt-3">
                  <p className="text-sm font-medium">Selected Dates:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableDates.map((date) => (
                      <Badge key={date} variant="outline" className="px-3 py-1">
                        {new Date(date).toLocaleDateString('en-US', {
                          weekday: 'short',
                          month: 'short',
                          day: 'numeric',
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
          </CardContent>
        </Card>

        {/* Tour Images */}
        <Card>
          <CardHeader>
            <CardTitle>Tour Images</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label>Upload Tour Images *</Label>
              <CloudinaryUploader
                onUploadComplete={handleImagesUpload}
                maxImages={5}
              />

              {imageUrls.length === 0 && (
                <Alert variant="destructive" className="mt-4">
                  <AlertCircle className="h-4 w-4" />
                  <AlertDescription>
                    At least one image is required
                  </AlertDescription>
                </Alert>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Submit Buttons */}
        <div className="flex flex-col sm:flex-row gap-4 pt-6 border-t">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
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
                if (confirm("Reset all fields?")) {
                  setFormData({
                    title: "",
                    description: "",
                    price: "50",
                    durationHours: "3",
                    maxGroupSize: "10",
                    meetingPoint: "",
                    category: ListingCategory.FOOD,
                    address: "",
                    city: "",
                    country: "",
                  });
                  setLanguages(["English"]);
                  setAvailableDates([]);
                  setImageUrls([]);
                }
              }}
              disabled={isSubmitting}
            >
              Reset Form
            </Button>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="min-w-[150px]"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Listing"
              )}
            </Button>
          </div>
        </div>
      </form>
    </div>
  );
}
// components/modules/MyProfile/MyProfile.tsx
"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Camera, Save, User, Mail, Phone, MapPin, Globe, Star, Briefcase } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { updateMyProfile } from "@/services/auth/auth.service";
import { toast } from "sonner";

interface UserInfo {
  _id: string;
  name: string;
  email: string;
  role: "tourist" | "guide" | "admin";
  profilePicture?: string;
  bio?: string;
  languages?: string[];
  phone?: string;
  location?: {
    addressLine1?: string;
    city?: string;
    country?: string;
  };
  expertise?: string[];
  dailyRate?: number;
  travelPreferences?: string[];
}

interface MyProfileProps {
  userInfo: UserInfo;
}

interface FormData {
  name: string;
  bio: string;
  phone: string;
  addressLine1: string;
  city: string;
  country: string;
  languages: string;
  expertise: string;
  dailyRate: string;
  travelPreferences: string;
}

const getRoleColor = (role: string) => {
  switch (role) {
    case "guide":
      return "bg-blue-100 text-blue-800";
    case "tourist":
      return "bg-green-100 text-green-800";
    case "admin":
      return "bg-purple-100 text-purple-800";
    default:
      return "bg-gray-100 text-gray-800";
  }
};

const getRoleText = (role: string) => {
  switch (role) {
    case "guide":
      return "Local Guide";
    case "tourist":
      return "Tourist";
    case "admin":
      return "Admin";
    default:
      return role;
  }
};

const getInitials = (name: string) => {
  return name
    .split(" ")
    .map((word) => word[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
};

export default function MyProfile({ userInfo }: MyProfileProps) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [profilePic, setProfilePic] = useState<File | null>(null);
  const [profilePicPreview, setProfilePicPreview] = useState<string | null>(
    userInfo.profilePicture || null
  );

  const [form, setForm] = useState<FormData>({
    name: userInfo.name || "",
    bio: userInfo.bio || "",
    phone: userInfo.phone || "",
    addressLine1: userInfo.location?.addressLine1 || "",
    city: userInfo.location?.city || "",
    country: userInfo.location?.country || "",
    languages: userInfo.languages?.join(", ") || "",
    expertise: userInfo.expertise?.join(", ") || "",
    dailyRate: userInfo.dailyRate?.toString() || "0",
    travelPreferences: userInfo.travelPreferences?.join(", ") || "",
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleProfilePicChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfilePic(file);
      const reader = new FileReader();
      reader.onloadend = () => setProfilePicPreview(reader.result as string);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const formData = new FormData();

      // Basic fields
      formData.append("name", form.name);
      formData.append("bio", form.bio);
      formData.append("phone", form.phone);

      // Location fields
      if (form.addressLine1) formData.append("location[addressLine1]", form.addressLine1);
      if (form.city) formData.append("location[city]", form.city);
      if (form.country) formData.append("location[country]", form.country);

      // Languages (no enum restriction)
      if (form.languages.trim()) {
        formData.append("languages", form.languages);
      }

      // Guide-specific fields
      if (userInfo.role === "guide") {
        // ✅ Filter expertise to valid enum values only
        if (form.expertise.trim()) {
          const validExpertise = [
            "History", "Food", "Art", "Adventure",
            "Nightlife", "Shopping", "Photography", "Nature"
          ];
          const expertiseArray = form.expertise
            .split(",")
            .map(exp => exp.trim())
            .filter(exp => validExpertise.includes(exp));

          if (expertiseArray.length > 0) {
            formData.append("expertise", expertiseArray.join(","));
          }
        }

        // Daily rate
        const dailyRateNum = parseFloat(form.dailyRate);
        if (!isNaN(dailyRateNum)) {
          formData.append("dailyRate", dailyRateNum.toString());
        }
      }

      // Tourist-specific fields (no enum restriction)
      if (userInfo.role === "tourist") {
        if (form.travelPreferences.trim()) {
          formData.append("travelPreferences", form.travelPreferences);
        }
      }

      // Profile picture
      if (profilePic) {
        formData.append("profilePicture", profilePic);
      }

      const result = await updateMyProfile(formData);

      if (result.success) {
        toast.success("Profile updated successfully");
        if (typeof window !== "undefined") {
          const storedUser = JSON.parse(localStorage.getItem("user") || "{}");
          localStorage.setItem("user", JSON.stringify({ ...storedUser, ...result.data }));
        }
        router.refresh();
      } else {
        throw new Error(result.message || "Failed to update profile");
      }
    } catch (error: any) {
      console.error("Update Error:", error);
      toast.error(error.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-4 md:p-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-bold">My Profile</h1>
          <p className="text-gray-500 mt-1">Manage your personal information</p>
        </div>
        <Badge className={`mt-2 md:mt-0 ${getRoleColor(userInfo.role)} px-4 py-1`}>
          {getRoleText(userInfo.role)}
        </Badge>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Profile Picture Section */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-4">Profile Picture</h2>
          <div className="flex flex-col md:flex-row items-center gap-6">
            <div className="relative">
              <div className="h-32 w-32 rounded-full bg-gray-200 flex items-center justify-center overflow-hidden border-4 border-white shadow-lg">
                {profilePicPreview ? (
                  <img
                    src={profilePicPreview}
                    alt={userInfo.name}
                    className="h-full w-full object-cover"
                  />
                ) : (
                  <div className="text-3xl font-bold text-gray-600">
                    {getInitials(userInfo.name)}
                  </div>
                )}
              </div>
              <label className="absolute bottom-0 right-0 bg-blue-600 text-white p-2 rounded-full cursor-pointer hover:bg-blue-700">
                <Camera className="h-5 w-5" />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={handleProfilePicChange}
                />
              </label>
            </div>
            <div className="flex-1">
              <div className="space-y-2">
                <h3 className="text-2xl font-bold">{userInfo.name}</h3>
                <div className="flex items-center gap-2 text-gray-600">
                  <Mail className="h-4 w-4" />
                  <span>{userInfo.email}</span>
                </div>
                {userInfo.phone && (
                  <div className="flex items-center gap-2 text-gray-600">
                    <Phone className="h-4 w-4" />
                    <span>{userInfo.phone}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Personal Information */}
        <div className="bg-white border rounded-lg p-6">
          <h2 className="text-xl font-bold mb-6">Personal Information</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <User className="h-5 w-5" />
                Basic Information
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="name">Full Name *</Label>
                  <Input
                    id="name"
                    name="name"
                    value={form.name}
                    onChange={handleInputChange}
                    required
                    disabled={loading}
                  />
                </div>
                <div>
                  <Label htmlFor="phone">Phone Number</Label>
                  <Input
                    id="phone"
                    name="phone"
                    value={form.phone}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="+880 1XXX XXX XXX"
                  />
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <h3 className="font-medium flex items-center gap-2">
                <Globe className="h-5 w-5" />
                Languages & Bio
              </h3>
              <div className="space-y-3">
                <div>
                  <Label htmlFor="languages">Languages (comma separated)</Label>
                  <Input
                    id="languages"
                    name="languages"
                    value={form.languages}
                    onChange={handleInputChange}
                    disabled={loading}
                    placeholder="English, Bengali, Spanish"
                  />
                </div>
                <div>
                  <Label htmlFor="bio">Bio</Label>
                  <Textarea
                    id="bio"
                    name="bio"
                    value={form.bio}
                    onChange={handleInputChange}
                    disabled={loading}
                    rows={3}
                    placeholder="Tell about yourself..."
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Location Fields - New */}
          <div className="mt-6 pt-4 border-t">
            <h3 className="font-medium flex items-center gap-2 mb-4">
              <MapPin className="h-5 w-5" />
              Location
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <Label htmlFor="addressLine1">Address</Label>
                <Input
                  id="addressLine1"
                  name="addressLine1"
                  value={form.addressLine1}
                  onChange={handleInputChange}
                  placeholder="Street, area"
                />
              </div>
              <div>
                <Label htmlFor="city">City</Label>
                <Input
                  id="city"
                  name="city"
                  value={form.city}
                  onChange={handleInputChange}
                  placeholder="Dhaka"
                />
              </div>
              <div>
                <Label htmlFor="country">Country</Label>
                <Input
                  id="country"
                  name="country"
                  value={form.country}
                  onChange={handleInputChange}
                  placeholder="Bangladesh"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Role Specific Information */}
        {userInfo.role === "guide" && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Briefcase className="h-6 w-6" />
              Guide Information
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="expertise">Areas of Expertise (comma separated)</Label>
                <Input
                  id="expertise"
                  name="expertise"
                  value={form.expertise}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="History, Food, Photography, Adventure"
                />
              </div>
              <div>
                <Label htmlFor="dailyRate">Daily Rate ($)</Label>
                <Input
                  id="dailyRate"
                  name="dailyRate"
                  type="number"
                  value={form.dailyRate}
                  onChange={handleInputChange}
                  disabled={loading}
                  placeholder="50"
                />
              </div>
            </div>
          </div>
        )}

        {userInfo.role === "tourist" && (
          <div className="bg-white border rounded-lg p-6">
            <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
              <Star className="h-6 w-6" />
              Travel Preferences
            </h2>
            <div>
              <Label htmlFor="travelPreferences">Interests (comma separated)</Label>
              <Input
                id="travelPreferences"
                name="travelPreferences"
                value={form.travelPreferences}
                onChange={handleInputChange}
                disabled={loading}
                placeholder="Adventure, Culture, Food, History"
              />
            </div>
          </div>
        )}

        {/* Submit Button */}
        <div className="flex justify-end">
          <Button type="submit" disabled={loading} className="min-w-[150px]">
            {loading ? (
              <>
                <div className="h-4 w-4 animate-spin rounded-full border-2 border-white border-t-transparent mr-2" />
                Saving...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Save Changes
              </>
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}




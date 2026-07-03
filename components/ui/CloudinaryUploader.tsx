// components/ui/CloudinaryUploader.tsx
"use client";

import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Label } from '@/components/ui/label';
import { toast } from 'sonner';
import { Upload, X, Image as ImageIcon } from 'lucide-react';

interface CloudinaryUploaderProps {
  onUploadComplete: (urls: string[]) => void;
  maxImages?: number;
  existingImages?: string[];
}

export default function CloudinaryUploader({ 
  onUploadComplete, 
  maxImages = 5,  // ✅ ৫ টাই যথেষ্ট
  existingImages = [] 
}: CloudinaryUploaderProps) {
  const [images, setImages] = useState<string[]>(existingImages);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Cloudinary configuration
  const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqv9mh613";
  const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "local_guide_preset";

  // ✅ ঠিক করা upload function - শুধু Cloudinary URL return করে
  const uploadToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', CLOUDINARY_UPLOAD_PRESET);
    formData.append('cloud_name', CLOUDINARY_CLOUD_NAME);

    console.log('📤 Uploading to Cloudinary...', {
      cloudName: CLOUDINARY_CLOUD_NAME,
      fileName: file.name,
      fileSize: (file.size / 1024).toFixed(2) + 'KB'
    });

    const response = await fetch(
      `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error?.message || 'Upload failed');
    }

    const data = await response.json();
    console.log('✅ Cloudinary upload successful:', data.secure_url);
    return data.secure_url; // ✅ শুধু Cloudinary URL return
  };

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) return;

    // Check max limit
    if (images.length + files.length > maxImages) {
      toast.error(`Maximum ${maxImages} images allowed`);
      return;
    }

    setUploading(true);
    setProgress(0);

    const uploadedUrls: string[] = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Validate file type
      if (!file.type.startsWith('image/')) {
        toast.error(`${file.name}: Only image files allowed`);
        continue;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        toast.error(`${file.name}: Max size is 5MB`);
        continue;
      }

      try {
        toast.info(`Uploading ${file.name}...`);
        const url = await uploadToCloudinary(file);
        uploadedUrls.push(url);
        setProgress(((i + 1) / files.length) * 100);
        toast.success(`${file.name} uploaded successfully`);
      } catch (error: any) {
        toast.error(`Failed to upload ${file.name}: ${error.message}`);
      }
    }

    // Update state
    if (uploadedUrls.length > 0) {
      const newImages = [...images, ...uploadedUrls];
      setImages(newImages);
      onUploadComplete(newImages); // ✅ শুধু URLs পাঠান
      toast.success(`${uploadedUrls.length} image(s) uploaded successfully!`);
    }

    setUploading(false);
    setProgress(0);
    
    // Reset file input
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const removeImage = (index: number) => {
    const newImages = images.filter((_, i) => i !== index);
    setImages(newImages);
    onUploadComplete(newImages); // ✅ আপডেট করা URLs পাঠান
    toast.info('Image removed');
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    handleFileSelect(e.dataTransfer.files);
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Input */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple
        onChange={(e) => handleFileSelect(e.target.files)}
        className="hidden"
      />

      {/* Upload Area */}
      <Card 
        className="border-2 border-dashed hover:border-primary transition-colors cursor-pointer"
        onClick={() => fileInputRef.current?.click()}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        <CardContent className="pt-6 pb-6 text-center">
          <div className="flex flex-col items-center justify-center gap-3">
            <div className="h-12 w-12 rounded-full bg-primary/10 flex items-center justify-center">
              <Upload className="h-6 w-6 text-primary" />
            </div>
            
            <div>
              <p className="font-medium">Click or drag to upload</p>
              <p className="text-sm text-muted-foreground mt-1">
                Upload tour images (JPEG, PNG, JPG, WebP). Max 5MB per image.
              </p>
              <p className="text-xs text-muted-foreground mt-2">
                {images.length} / {maxImages} images uploaded
              </p>
            </div>
            
            <Button 
              type="button" 
              variant="outline" 
              size="sm"
              onClick={(e) => {
                e.stopPropagation();
                fileInputRef.current?.click();
              }}
            >
              Select Images
            </Button>
          </div>

          {/* Progress Bar */}
          {uploading && (
            <div className="mt-4 space-y-2">
              <Progress value={progress} className="h-2" />
              <p className="text-sm text-muted-foreground">
                Uploading... {progress}%
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Preview Grid */}
      {images.length > 0 && (
        <div className="space-y-3">
          <Label>Uploaded Images ({images.length}):</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
            {images.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg overflow-hidden border bg-gray-100">
                  <img
                    src={url}
                    alt={`Tour image ${index + 1}`}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                  />
                  
                  <Button
                    type="button"
                    size="sm"
                    variant="destructive"
                    className="absolute top-1 right-1 h-6 w-6 p-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="h-3 w-3" />
                  </Button>
                  
                  <div className="absolute bottom-1 left-1 bg-black/70 text-white text-xs px-2 py-0.5 rounded">
                    {index + 1}
                  </div>
                </div>
              </div>
            ))}
            
            {images.length < maxImages && (
              <div 
                className="aspect-square rounded-lg border-2 border-dashed border-gray-300 flex flex-col items-center justify-center gap-2 hover:border-primary hover:bg-primary/5 transition-all cursor-pointer"
                onClick={() => fileInputRef.current?.click()}
              >
                <ImageIcon className="h-8 w-8 text-gray-400" />
                <p className="text-sm font-medium">Add More</p>
                <p className="text-xs text-gray-500">
                  {maxImages - images.length} remaining
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

// // components/ui/CloudinaryUploader.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Label } from "@/components/ui/label";
// import { Image, X, Upload, Loader2 } from "lucide-react";
// import { toast } from "sonner";

// interface CloudinaryUploaderProps {
//   onUploadComplete: (urls: string[]) => void;
//   maxImages?: number;
//   existingImages?: string[];
// }

// const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqv9mh613";
// const CLOUDINARY_UPLOAD_PRESET = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || "local_guide_preset";

// export default function CloudinaryUploader({
//   onUploadComplete,
//   maxImages = 10,
//   existingImages = []
// }: CloudinaryUploaderProps) {
//   const [images, setImages] = useState<string[]>(existingImages);
//   const [uploading, setUploading] = useState(false);

//   const uploadToCloudinary = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);
//     formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);
//     formData.append("folder", "local-guide/listings");

//     console.log("📤 Uploading to Cloudinary...", {
//       cloudName: CLOUDINARY_CLOUD_NAME,
//       fileName: file.name,
//       fileSize: (file.size / 1024).toFixed(2) + "KB"
//     });

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       if (!response.ok) {
//         const errorText = await response.text();
//         console.error("Cloudinary error response:", errorText);
//         throw new Error(`Upload failed: ${response.status} ${response.statusText}`);
//       }

//       const data = await response.json();
//       console.log("✅ Cloudinary upload success:", data.secure_url);
//       return data.secure_url;
//     } catch (error) {
//       console.error("❌ Cloudinary upload error:", error);
//       throw error;
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     if (images.length + files.length > maxImages) {
//       toast.error(`You can only upload up to ${maxImages} images`);
//       return;
//     }

//     setUploading(true);
//     const newImageUrls: string[] = [];

//     try {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
        
//         // Validate file type
//         if (!file.type.startsWith("image/")) {
//           toast.error(`${file.name} is not an image file`);
//           continue;
//         }

//         // Validate file size (max 5MB)
//         if (file.size > 5 * 1024 * 1024) {
//           toast.error(`${file.name} is too large (max 5MB)`);
//           continue;
//         }

//         toast.info(`Uploading ${file.name}...`);
        
//         try {
//           const url = await uploadToCloudinary(file);
//           newImageUrls.push(url);
//           toast.success(`${file.name} uploaded successfully`);
//         } catch (error) {
//           toast.error(`Failed to upload ${file.name}`);
//           console.error("Upload error:", error);
//         }
//       }

//       if (newImageUrls.length > 0) {
//         const updatedImages = [...images, ...newImageUrls];
//         setImages(updatedImages);
//         onUploadComplete(updatedImages);
//       }
//     } finally {
//       setUploading(false);
//     }

//     // Clear input
//     e.target.value = "";
//   };

//   const removeImage = (indexToRemove: number) => {
//     const updatedImages = images.filter((_, index) => index !== indexToRemove);
//     setImages(updatedImages);
//     onUploadComplete(updatedImages);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-4">
//         <Input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleFileChange}
//           disabled={uploading || images.length >= maxImages}
//           className="flex-1"
//         />
//         {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
//       </div>

//       {images.length > 0 && (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
//           {images.map((url, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={url}
//                 alt={`Upload ${index + 1}`}
//                 className="w-full h-32 object-cover rounded-lg border"
//                 onError={(e) => {
//                   (e.target as HTMLImageElement).src = "/placeholder-image.jpg";
//                 }}
//               />
//               <button
//                 onClick={() => removeImage(index)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//                 title="Remove image"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       )}

//       {images.length === 0 && (
//         <div className="border-2 border-dashed rounded-lg p-8 text-center">
//           <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//           <p className="text-sm text-gray-500">No images uploaded yet</p>
//           <p className="text-xs text-gray-400 mt-1">
//             Click above to upload (Max {maxImages} images)
//           </p>
//         </div>
//       )}
//     </div>
//   );
// }
// components/ui/CloudinaryUploader.tsx
// "use client";

// import { useState } from "react";
// import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input";
// import { Image, X, Upload, Loader2 } from "lucide-react";
// import { toast } from "sonner";

// interface CloudinaryUploaderProps {
//   onUploadComplete: (urls: string[]) => void;
//   maxImages?: number;
//   existingImages?: string[];
// }

// const CLOUDINARY_CLOUD_NAME = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME || "dqv9mh613";

// export default function CloudinaryUploader({
//   onUploadComplete,
//   maxImages = 10,
//   existingImages = []
// }: CloudinaryUploaderProps) {
//   const [images, setImages] = useState<string[]>(existingImages);
//   const [uploading, setUploading] = useState(false);

//   // ✅ সহজ সমাধান: সরাসরি upload করছি, preset ছাড়া
//   const uploadToCloudinary = async (file: File): Promise<string> => {
//     const formData = new FormData();
//     formData.append("file", file);
//     formData.append("upload_preset", "unsigned_preset"); // আপনার preset name
//     formData.append("cloud_name", CLOUDINARY_CLOUD_NAME);

//     console.log("📤 Uploading to Cloudinary...", {
//       cloudName: CLOUDINARY_CLOUD_NAME,
//       fileName: file.name,
//       fileSize: (file.size / 1024).toFixed(2) + "KB"
//     });

//     try {
//       const response = await fetch(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         {
//           method: "POST",
//           body: formData,
//         }
//       );

//       const data = await response.json();
      
//       if (!response.ok) {
//         console.error("Cloudinary error:", data);
//         throw new Error(data.error?.message || "Upload failed");
//       }

//       console.log("✅ Cloudinary upload success:", data.secure_url);
//       return data.secure_url;
//     } catch (error) {
//       console.error("❌ Cloudinary upload error:", error);
//       throw error;
//     }
//   };

//   const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
//     const files = e.target.files;
//     if (!files || files.length === 0) return;

//     if (images.length + files.length > maxImages) {
//       toast.error(`You can only upload up to ${maxImages} images`);
//       return;
//     }

//     setUploading(true);
//     const newImageUrls: string[] = [];

//     try {
//       for (let i = 0; i < files.length; i++) {
//         const file = files[i];
        
//         toast.info(`Uploading ${file.name}...`);
        
//         try {
//           const url = await uploadToCloudinary(file);
//           newImageUrls.push(url);
//           toast.success(`${file.name} uploaded successfully`);
//         } catch (error: any) {
//           toast.error(`Failed to upload ${file.name}: ${error.message}`);
//           console.error("Upload error:", error);
//         }
//       }

//       if (newImageUrls.length > 0) {
//         const updatedImages = [...images, ...newImageUrls];
//         setImages(updatedImages);
//         onUploadComplete(updatedImages);
//       }
//     } finally {
//       setUploading(false);
//     }

//     e.target.value = "";
//   };

//   const removeImage = (indexToRemove: number) => {
//     const updatedImages = images.filter((_, index) => index !== indexToRemove);
//     setImages(updatedImages);
//     onUploadComplete(updatedImages);
//   };

//   return (
//     <div className="space-y-4">
//       <div className="flex items-center gap-4">
//         <Input
//           type="file"
//           accept="image/*"
//           multiple
//           onChange={handleFileChange}
//           disabled={uploading || images.length >= maxImages}
//           className="flex-1"
//         />
//         {uploading && <Loader2 className="h-5 w-5 animate-spin text-primary" />}
//       </div>

//       {images.length > 0 ? (
//         <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
//           {images.map((url, index) => (
//             <div key={index} className="relative group">
//               <img
//                 src={url}
//                 alt={`Upload ${index + 1}`}
//                 className="w-full h-32 object-cover rounded-lg border"
//               />
//               <button
//                 onClick={() => removeImage(index)}
//                 className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition"
//               >
//                 <X className="h-4 w-4" />
//               </button>
//             </div>
//           ))}
//         </div>
//       ) : (
//         <div className="border-2 border-dashed rounded-lg p-8 text-center">
//           <Image className="h-8 w-8 mx-auto text-gray-400 mb-2" />
//           <p className="text-sm text-gray-500">No images uploaded yet</p>
//         </div>
//       )}
//     </div>
//   );
// }
// services/listing/listing.service.ts  

"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface IListingFormData {
  title: string;
  description: string;
  price: number;
  durationHours: number;
  maxGroupSize: number;
  meetingPoint: string;
  languages: string[];
  category: string;
  images: string[];
  location: {
    address: string;
    city: string;
    country: string;
  };
  availableDates?: string[];
}
// 📁 services/listing/listing.service.ts
export async function createListing(data: any) {
  try {
    console.log('Frontend data before transform:', data);

    // Transform data for backend
    const transformedData = {
      title: data.title,
      description: data.description,
      price: data.price,
      durationHours: data.durationHours,
      maxGroupSize: data.maxGroupSize,
      meetingPoint: data.meetingPoint,
      category: data.category,
      // 🔹 Create location object
      location: {
        address: data.address,
        city: data.city,
        country: data.country
      },
      languages: data.languages,
      images: data.images || [],
      availableDates: data.availableDates
    };

    console.log('Transformed data for backend:', transformedData);

    const response = await serverFetch.post("/listing/create", {
      body: JSON.stringify(transformedData),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    console.log('Backend response:', result);

    if (result.success) {
      revalidateTag('my-listings', { expire: 0 });
      revalidateTag('all-listings', { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error creating listing:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create listing",
    };
  }
}

export async function getMyListings(queryString?: string) {
  try {
    const response = await serverFetch.get(
      `/listing/guide/my-listings${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`,
      {
        next: {
          tags: ["my-listings"],
          revalidate: 120,
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching my listings:", error);
    return {
      success: false,
      data: [],
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch my listings",
    };
  }
}

export const getListings = async (queryString: string) => {
  try {
    const response = await serverFetch.get(`/listing?${queryString}`, {
      next: {
        tags: ["listings"],
        revalidate: 300,
      },
    });
    return await response.json();
  } catch (error: any) {
    return { success: false, data: [], message: "Failed to fetch listings" };
  }
};
export async function searchListings(filters: {
  city?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  language?: string;
  search?: string;
  page?: number;
  limit?: number;
}) {
  try {
    const queryParams = new URLSearchParams();

    if (filters.city) queryParams.append('city', filters.city);
    if (filters.category) queryParams.append('category', filters.category);
    if (filters.minPrice) queryParams.append('minPrice', filters.minPrice.toString());
    if (filters.maxPrice) queryParams.append('maxPrice', filters.maxPrice.toString());
    if (filters.language) queryParams.append('language', filters.language);
    if (filters.search) queryParams.append('search', filters.search);
    if (filters.page) queryParams.append('page', filters.page.toString());
    if (filters.limit) queryParams.append('limit', filters.limit.toString());

    const response = await serverFetch.get(
      `/listing?${queryParams.toString()}`,
      {
        next: {
          tags: ["all-listings"],
          revalidate: 60,
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error searching listings:", error);
    return {
      success: false,
      data: [],
      meta: {},
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to search listings",
    };
  }
}





export async function getListingById(listingId: string) {
  try {
    const response = await serverFetch.get(
      `/listing/${listingId}`,
      {
        next: {
          tags: [`listing-${listingId}`],
          revalidate: 180,
        },
      }
    );

    // Check response status and content-type
    const contentType = response.headers.get("content-type");

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    if (!contentType || !contentType.includes("application/json")) {
      // If response is not JSON, it's likely an HTML error page
      const text = await response.text();
      console.error("Non-JSON response received:", text.substring(0, 200));
      throw new Error("Server returned non-JSON response");
    }

    const result = await response.json();

    if (result.success) {
      return {
        success: true,
        data: result.data,
      };
    }

    return {
      success: false,
      data: null,
      message: result.message || "Failed to fetch listing",
    };
  } catch (error: any) {
    console.error("Error fetching listing:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch listing",
    };
  }
}
// services/listing/listing.service.ts

export async function updateListing(listingId: string, data: Partial<IListingFormData>) {
  try {
    console.log(`📡 Updating listing ${listingId}:`, data);


    const response = await serverFetch.patch(
      `/listing/${listingId}`,  // Changed from "/listing/${listingId}"
      {

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify(data),
      }
    );


    if (!response.ok) {
      const errorText = await response.text();
      console.error('❌ Server response:', errorText.substring(0, 200));


      if (errorText.startsWith('<!DOCTYPE')) {
        throw new Error(`Server error ${response.status}: Please check backend`);
      }

      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const result = await response.json();
    console.log('✅ Update successful:', result);

    if (result.success) {
      // Revalidate tags
      revalidateTag('my-listings', { expire: 0 });
      revalidateTag('all-listings', { expire: 0 });
      revalidateTag(`listing-${listingId}`, { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("❌ Error updating listing:", error);
    return {
      success: false,
      message: process.env.NODE_ENV === "development"
        ? error.message
        : "Failed to update listing",
    };
  }
}

// services/admin/admin.service.ts - FIXED VERSION
export async function deleteListing(listingId: string) {
  try {

    const response = await serverFetch.delete(
      `/listing/${listingId}`,
      {
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || "Failed to delete listing"
      };
    }

    revalidateTag('my-listings', { expire: 0 });
    revalidateTag('all-listings', { expire: 0 });
    revalidateTag(`listing-${listingId}`, { expire: 0 });
    revalidateTag('dashboard-meta', { expire: 0 });

    return result;

  } catch (error: any) {
    console.error("Delete error:", error);
    return {
      success: false,
      message: error.message || "Failed to delete listing"
    };
  }
}
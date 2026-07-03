//services/admin/admin.service.ts 
// import { updateBookingStatus } from '@/services/admin/admin.service';
"use server"



import { serverFetch } from "@/lib/server-fetch";
import { UserRole } from "@/types/auth.interface";
import { ListingStatus } from "@/types/listing.interface";
import { ReviewStatus } from "@/types/review.interface";
import { revalidateTag } from "next/cache";

// Update User Role
export async function updateUserRole(userId: string, role: UserRole) {
  try {
    const response = await serverFetch.patch(
      `/admin/users/${userId}/role`,
      {
        body: JSON.stringify({ role }),
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag("admin-users", { expire: 0 });
      revalidateTag("admin-dashboard", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error updating user role:", error);
    return {
      success: false,
      message: "Failed to update user role",
    };
  }
}


// Delete User
export async function deleteUser(userId: string) {
  try {
    const response = await serverFetch.delete(`/admin/users/${userId}`);

    const result = await response.json();

    if (result.success) {
      revalidateTag("admin-users", { expire: 0 });
      revalidateTag("admin-dashboard", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error deleting user:", error);
    return {
      success: false,
      message: "Failed to delete user",
    };
  }
}

// Toggle Listing Active State
// services/admin/admin.service.ts

// ✅ FIXED: Toggle listing active status
export async function toggleListingActive(listingId: string, active: boolean) {
  try {
    const response = await serverFetch.patch(
      `/listing/${listingId}`,  // ✅ Correct singular endpoint
      {
        body: JSON.stringify({ active }),
      }
    );

    const result = await response.json();
    if (result.success) {
      revalidateTag('admin-listings', { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Error toggling listing active state:", error);
    return { success: false, message: "Failed to update listing status" };
  }
}

// Admin Cancel Booking
export async function adminCancelBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/admin/bookings/${bookingId}/cancel`
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('admin-bookings', { expire: 0 });
      revalidateTag('admin-dashboard', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      message: "Failed to cancel booking",
    };
  }
}

// Admin Refund Booking
export async function adminRefundBooking(bookingId: string) {
  try {
    const response = await serverFetch.post(
      `/admin/bookings/${bookingId}/refund`
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('admin-bookings', { expire: 0 });
      revalidateTag('admin-dashboard', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error refunding booking:", error);
    return {
      success: false,
      message: "Failed to process refund",
    };
  }
}


// Get All Reviews
export async function getAllReviews(queryString?: string) {
  try {
    // Standardizing to singular prefix /review/all
    const url = `/review/all${queryString ? `?${queryString}` : ""}`;
    const response = await serverFetch.get(url, {
      next: {
        tags: ["admin-reviews"],
        revalidate: 120,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch reviews: ${response.status}`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching all reviews:", error);
    return {
      success: false,
      data: [],
      message: "Failed to fetch reviews",
    };
  }
}

// Update Review Status
export async function updateReviewStatus(reviewId: string, status: ReviewStatus) {
  try {
    const response = await serverFetch.patch(
      `/review/${reviewId}/status`,
      {
        body: JSON.stringify({ status }),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('admin-reviews', { expire: 0 });
      revalidateTag('admin-dashboard', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error updating review status:", error);
    return {
      success: false,
      message: "Failed to update review status",
    };
  }
}

// Delete Review
export async function deleteReview(reviewId: string) {
  try {
    const response = await serverFetch.delete(
      `/review/${reviewId}`
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('admin-reviews', { expire: 0 });
      revalidateTag('admin-dashboard', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error deleting review:", error);
    return {
      success: false,
      message: "Failed to delete review",
    };
  }
}

// Get All Users (Admin)
export async function getAllUsers(queryString?: string) {
  try {
    const url = `/admin/users${queryString ? `?${queryString}` : ""}`;
    const response = await serverFetch.get(url, {
      next: {
        tags: ["admin-users"],
        revalidate: 120,
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error:", errorText.substring(0, 200));
      return {
        success: false,
        data: [],
        message: `Server error: ${response.status}`,
      };
    }

    return await response.json();
  } catch (error: any) {
    console.error("Error fetching all users:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch users",
    };
  }
}


// Removed toggleFeaturedListing as it's not supported by the backend model

// Update User Status
export async function updateUserStatus(userId: string, status: string) {
  try {
    const response = await serverFetch.patch(
      `/admin/users/${userId}/status`,
      {
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag("admin-users", { expire: 0 });
      revalidateTag("admin-dashboard", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error updating user status:", error);
    return {
      success: false,
      message: "Failed to update user status",
    };
  }
}




export async function getAllListings(queryString?: string) {
  const url = `/admin/listings${queryString ? `?${queryString}` : ""}`;
  const response = await serverFetch.get(url);
  const result = await response.json();
  return result;
}


/**
 * Delete a listing (Admin)
 */
export async function deleteListing(listingId: string) {
  try {
    const response = await serverFetch.delete(`/listing/${listingId}`);
    const result = await response.json();
    if (result.success) {
      revalidateTag('admin-listings', { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Error deleting listing:", error);
    return { success: false, message: error.message || "Failed to delete listing" };
  }
}

/**
 * Update Listing Status (Moderation)
 */
export async function updateListingStatus(listingId: string, status: ListingStatus) {
  try {
    const response = await serverFetch.patch(
      `/listing/${listingId}/status`,
      {
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();
    if (result.success) {
      revalidateTag('admin-listings', { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Error updating listing status:", error);
    return { success: false, message: "Failed to update listing status" };
  }
}

/**
 * Get all bookings (Admin)
 */
export const getAllBookingsForAdmin = async (filters?: any) => {
  try {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value) params.append(key, String(value));
      });
    }
    const response = await serverFetch.get(`/admin/bookings?${params.toString()}`, {
      next: {
        tags: ["admin-bookings"],
        revalidate: 0,
      },
    });
    return await response.json();
  } catch (error: any) {
    console.error("Get bookings error:", error);
    return { success: false, data: [], message: error.message || "Failed to fetch bookings" };
  }
};

/**
 * Update booking status (Admin only)
 */
export const updateBookingStatus = async (bookingId: string, status: string) => {
  try {
    const response = await serverFetch.patch(
      `/admin/bookings/${bookingId}/status`,
      {
        body: JSON.stringify({ status }),
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('admin-bookings', { expire: 0 });
      revalidateTag('admin-dashboard', { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Update booking status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update booking status",
    };
  }
};

/**
 * Update payment status (Admin only)
 */
export const updatePaymentStatus = async (bookingId: string, paymentStatus: string) => {
  try {
    const response = await serverFetch.patch(
      `/admin/bookings/${bookingId}/payment-status`,
      {
        body: JSON.stringify({ paymentStatus }),
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('admin-bookings', { expire: 0 });
      revalidateTag('admin-dashboard', { expire: 0 });
    }
    return result;
  } catch (error: any) {
    console.error("Update payment status error:", error);
    return {
      success: false,
      message: error.message || "Failed to update payment status",
    };
  }
};


/**
 * Get booking statistics (Admin only)
 */
export const getBookingStatsForAdmin = async () => {
  try {
    const response = await serverFetch.get("/admin/bookings/stats", {
      next: {
        tags: ["admin-bookings-stats"],
        revalidate: 60,
      },
    });
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Get booking stats error:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to fetch booking stats",
    };
  }
};

// Update listing function
export const updateListing = async (listingId: string, data: any) => {
  try {
    const response = await serverFetch.patch(
      `/listing/${listingId}`,
      {
        body: JSON.stringify(data),
      }
    );

    const result = await response.json();
    if (result.success) {
      revalidateTag('admin-listings', { expire: 0 });
    }
    return result;
  } catch (error) {
    console.error('Error updating listing:', error);
    return { success: false, message: "Failed to update listing" };
  }
};

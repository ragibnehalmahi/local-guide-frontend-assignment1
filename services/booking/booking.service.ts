//local-guide-frontend/my-app/services/booking/booking.service.ts 

"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export interface IBookingFormData {
  listingId: string;
  date: string;
  guestCount: number;
}

export async function createBooking(data: IBookingFormData) {
  try {
    const response = await serverFetch.post("/booking", {
      body: JSON.stringify(data),
      headers: {
        "Content-Type": "application/json",
      },
    });

    const result = await response.json();
    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag('listing-bookings', { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error creating booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to create booking",
    };
  }
}







export async function getMyBookings(queryString?: string) {
  try {
    const url = `/booking/my-bookings${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`;


    const response = await serverFetch.get(url, {
      next: {
        tags: ["my-bookings"],
        revalidate: 120,
      },
    });

    if (!response.ok) {
      const errorContent = await response.text();
      console.error(`Backend Error (${response.status}):`, errorContent);
      throw new Error(`Server returned ${response.status}. Check API path.`);
    }

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching bookings:", error);
    return {
      success: false,
      data: [],
      message: error.message || "Failed to fetch bookings",
    };
  }
}
export async function getBookingsForGuide(queryString?: string) {
  try {
    const response = await serverFetch.get(
      `/booking/guide-bookings${queryString ? `?${queryString}` : "?sortBy=createdAt&sortOrder=desc"}`,
      {
        next: {
          tags: ["guide-bookings"],
          revalidate: 120,
        },
      }
    );

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching guide bookings:", error);
    return {
      success: false,
      data: [],
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to fetch guide bookings",
    };
  }
}






export async function getBookingById(bookingId: string) {
  if (!bookingId) {
    return { success: false, message: "Booking ID is required" };
  }

  try {
    const response = await serverFetch.get(`/booking/${bookingId}`, {
      next: {
        tags: [`booking-${bookingId}`, "my-bookings"],
        revalidate: 180,
      },
    });

    // ১. চেক করুন রেসপন্সটি JSON কি না
    const contentType = response.headers.get("content-type");
    if (!response.ok || !contentType?.includes("application/json")) {
      console.error("Backend returned non-JSON or error status:", response.status);
      return { success: false, message: "Server error or Invalid Path" };
    }

    const result = await response.json();
    return result;

  } catch (error: any) {
    return {
      success: false,
      message: error.message || "Failed to fetch booking",
    };
  }
}
export async function confirmBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/confirm`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error confirming booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to confirm booking",
    };
  }
}

export async function declineBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/decline`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error declining booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to decline booking",
    };
  }
}

export async function cancelBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/cancel`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error cancelling booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to cancel booking",
    };
  }
}

export async function completeBooking(bookingId: string) {
  try {
    const response = await serverFetch.patch(
      `/booking/${bookingId}/complete`,
      {
        body: JSON.stringify({}),
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag('my-bookings', { expire: 0 });
      revalidateTag('guide-bookings', { expire: 0 });
      revalidateTag(`booking-${bookingId}`, { expire: 0 });
      revalidateTag('dashboard-meta', { expire: 0 });
      revalidateTag('guide-reviews', { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Error completing booking:", error);
    return {
      success: false,
      message:
        process.env.NODE_ENV === "development"
          ? error.message
          : "Failed to complete booking",
    };
  }
}








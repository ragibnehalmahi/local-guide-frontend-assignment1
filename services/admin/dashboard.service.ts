// src/services/admin/dashboard.service.ts
"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";

export async function getAdminDashboardMetaData() {
  try {
    const response = await serverFetch.get("/meta", {
      next: {
        tags: ["admin-dashboard"],
        revalidate: 30,
      },
    });
   
    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error("Error fetching admin dashboard data:", error);
    return {
      success: false,
      data: {
        totalUsers: 0,
        totalGuides: 0,
        totalTourists: 0,
        totalListings: 0,
        totalBookings: 0,
        totalRevenue: 0,
        pendingReviews: 0,
        recentSignups: []
      },
      message: "Failed to fetch dashboard data",
    };
  }
}
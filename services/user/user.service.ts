// services/user/user.service.ts
'use server';

import { UserRole } from './../../types/auth.interface';
import jwt, { JwtPayload } from "jsonwebtoken";
import { cookies } from 'next/headers';
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";
import { UserInfo } from "@/types/user.interface";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api/v1';

// ==================== GET MY PROFILE ====================
export async function getMyProfile() {
  try {
    const response = await serverFetch.get("/users/me", {
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to fetch profile',
      };
    }

    return {
      success: true,
      data: result.data,
    };

  } catch (error: any) {
    console.error("getMyProfile error:", error);
    return {
      success: false,
      message: error.message || 'Failed to fetch profile',
    };
  }
}

// ==================== GET USER INFO (for layout/auth) ====================
export const getUserInfo = async (): Promise<UserInfo | any> => {
  try {
    const response = await serverFetch.get("/users/me", {
      next: { tags: ["user-info"], revalidate: 180 },
    });

    if (!response.ok) {
      throw new Error("Failed to fetch user from backend");
    }

    const result = await response.json();

    if (result.success && result.data) {
      return {
        name: result.data.admin?.name || result.data.tourist?.name || result.data.guide?.name || result.data.name || "Unknown User",
        ...result.data
      };
    }

    throw new Error("User data not found");
  } catch (error: any) {
    console.error("getUserInfo Error:", error.message);
    return {
      id: "",
      name: "Unknown User",
      email: "",
      role: "tourist",
    };
  }
};

// ==================== UPDATE MY PROFILE (with FormData) ====================
export async function updateMyProfile(formData: FormData) {
  try {
    // ✅ serverFetch.patch automatically adds Authorization header
    // ✅ Do NOT set Content-Type – browser handles it for FormData
    const response = await serverFetch.patch("/users/me", {
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Update profile error response:", errorText);
      return {
        success: false,
        message: `Server error: ${response.status}`,
      };
    }

    const result = await response.json();

    if (result.success) {
      revalidateTag("user-info", { expire: 0 });
      revalidateTag("user-profile", { expire: 0 });
      revalidateTag("my-profile", { expire: 0 });
    }

    return result;

  } catch (error: any) {
    console.error("Error updating profile:", error);
    return {
      success: false,
      message: error.message || "Failed to update profile",
    };
  }
}

// ==================== GET ALL USERS (ADMIN) ====================
export async function getAllUsers(params?: {
  page?: number;
  limit?: number;
  search?: string;
  role?: string;
  status?: string;
}) {
  try {
    const queryParams = new URLSearchParams();
    if (params) {
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
    }

    const queryString = queryParams.toString();
    const endpoint = queryString ? `/users?${queryString}` : "/users";

    const response = await serverFetch.get(endpoint, {
      cache: 'no-store',
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to fetch users',
      };
    }

    return {
      success: true,
      data: result.data,
      meta: result.meta,
    };

  } catch (error: any) {
    console.error("getAllUsers error:", error);
    return {
      success: false,
      message: error.message || 'Failed to fetch users',
    };
  }
}

// ==================== UPDATE USER STATUS (ADMIN) ====================
export async function updateUserStatus(userId: string, status: string) {
  try {
    const response = await serverFetch.patch(`/users/${userId}/status`, {
      body: JSON.stringify({ status }),
    });

    const result = await response.json();

    if (!response.ok || !result.success) {
      return {
        success: false,
        message: result.message || 'Failed to update user status',
      };
    }

    if (result.success) {
      revalidateTag("admin-users", { expire: 0 });
      revalidateTag("admin-dashboard", { expire: 0 });
    }

    return {
      success: true,
      data: result.data,
    };

  } catch (error: any) {
    console.error("updateUserStatus error:", error);
    return {
      success: false,
      message: error.message || 'Failed to update user status',
    };
  }
}
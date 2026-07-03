// services/auth/auth.service.ts
'use server';

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import jwt, { JwtPayload } from 'jsonwebtoken';
import { z } from 'zod';
import { getDefaultDashboardRoute, isValidRedirectForRole } from '@/lib/auth-utils';
import { UserRole } from '@/types/auth.interface';
import { serverFetch } from '@/lib/server-fetch';
import { verifyAccessToken } from '@/lib/jwtHanlders';
import { parse } from 'cookie';
import { revalidateTag } from 'next/cache';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://local-guide-backend-1-7iay.onrender.com/api/v1';
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Validation schemas
const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

// ==================== COOKIE HELPERS ====================
export async function setCookie(key: string, value: string, options?: any) {
  const cookieStore = await cookies();
  cookieStore.set(key, value, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
    ...options,
  });
}

export async function getCookie(key: string) {
  const cookieStore = await cookies();
  return cookieStore.get(key)?.value;
}

export async function deleteCookie(key: string) {
  const cookieStore = await cookies();
  cookieStore.delete(key);
}

// ==================== LOGIN ====================
export async function loginUser(formData: FormData) {
  try {
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const redirectTo = formData.get('redirect') as string || '/';

    // Validate input
    const validation = loginSchema.safeParse({ email, password });
    if (!validation.success) {
      return {
        success: false,
        message: validation.error,
        errors: validation.error,
      };
    }

    // 🔥 Use serverFetch instead of direct fetch
    const response = await serverFetch.post('/auth/login', {
      body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok || !data.success) {
      return {
        success: false,
        message: data.message || 'Login failed',
      };
    }

    // Set cookies
    await setCookie('accessToken', data.data.accessToken);
    await setCookie('refreshToken', data.data.refreshToken);
    await setCookie('user', JSON.stringify(data.data.user), {
      httpOnly: false,
    });

    // Store token in localStorage for client-side AuthContext
    if (typeof window !== 'undefined') {
      localStorage.setItem('accessToken', data.data.accessToken);
    }

    // Get user role from token
    const decoded = jwt.verify(data.data.accessToken, JWT_SECRET) as JwtPayload;
    const userRole = decoded.role as UserRole;

    // Validate redirect path
    let finalRedirect: string;
    if (isValidRedirectForRole(redirectTo, userRole as any)) {
      finalRedirect = redirectTo;
    } else {
      finalRedirect = getDefaultDashboardRoute(userRole as any);
    }

    const url = new URL(finalRedirect, process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000');
    url.searchParams.set('login', 'success');
    redirect(url.toString());

  } catch (error: any) {
    console.error('Login error:', error);
    return {
      success: false,
      message: error.message || 'Login failed',
    };
  }
}

// ==================== LOGOUT ====================
export async function logoutUser() {
  try {
    const refreshToken = await getCookie('refreshToken');

    // 1. Notify backend logout
    if (refreshToken) {
      try {
        await serverFetch.post('/auth/logout', {
          body: JSON.stringify({ refreshToken }),
        });
      } catch (backendError) {
        console.error('Backend logout call failed:', backendError);
      }
    }

    // 2. Delete all auth cookies
    await deleteCookie('accessToken');
    await deleteCookie('refreshToken');
    await deleteCookie('user');
    await deleteCookie('userRole');

    // 3. Clear localStorage token
    if (typeof window !== 'undefined') {
      localStorage.removeItem('accessToken');
    }

    // 4. Clear server cache tags
    revalidateTag('user-info', { expire: 0 });
    revalidateTag('me', { expire: 0 });
    revalidateTag('user', { expire: 0 });

  } catch (error) {
    console.error('Logout error:', error);
  }
}

// ==================== GET CURRENT USER ====================
export async function getCurrentUser() {
  try {
    const userCookie = await getCookie('user');
    if (!userCookie) return null;
    return JSON.parse(userCookie);
  } catch (error) {
    return null;
  }
}

// ==================== VERIFY TOKEN ====================
export async function verifyToken() {
  try {
    const token = await getCookie('accessToken');
    if (!token) return null;
    const decoded = jwt.verify(token, JWT_SECRET) as JwtPayload;
    return decoded;
  } catch (error) {
    return null;
  }
}

// ==================== REGISTER ====================
export async function registerUser(prevState: any, formData: FormData) {
  try {
    const name = formData.get('name') as string;
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    const role = formData.get('role') as string;

    if (!name || !email || !password || !role) {
      return { success: false, message: 'All fields are required' };
    }

    const payload = { name, email, password, role };

    // 🔥 Use serverFetch instead of direct fetch
    const response = await serverFetch.post('/users/register', {
      body: JSON.stringify(payload),
    });

    const result = await response.json();

    if (!response.ok) {
      return {
        success: false,
        message: result.message || 'Registration failed',
      };
    }

    return {
      success: true,
      message: 'Registration successful! Please login.',
      data: result.data,
    };

  } catch (error: any) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: error.message || 'Something went wrong. Please try again.',
    };
  }
}

// ==================== UPDATE MY PROFILE ====================
// export async function updateMyProfile(formData: FormData) {
//   try {
//     const token = await getCookie('accessToken');

//     if (!token) {
//       console.error('No access token found in cookies');
//       return {
//         success: false,
//         message: 'You are not logged in. Please login again.',
//       };
//     }

//     const apiUrl = process.env.NEXT_PUBLIC_API_URL;
//     if (!apiUrl) {
//       console.error('NEXT_PUBLIC_API_URL is not defined');
//       return {
//         success: false,
//         message: 'Server configuration error: API URL missing',
//       };
//     }

//     // 🔥 Use serverFetch with FormData (no Content-Type header – fetch handles it automatically)
//     const response = await serverFetch.patch('/users/me', {
//       body: formData,
//     });

//     if (!response.ok) {
//       const errorText = await response.text();
//       console.error('Backend error response (status', response.status, '):', errorText);
//       return {
//         success: false,
//         message: `Server error (${response.status}): ${errorText.substring(0, 200)}`,
//       };
//     }

//     const result = await response.json();

//     if (result.success) {
//       revalidateTag('user-profile', { expire: 0 });
//       revalidateTag('my-profile', { expire: 0 });
//       revalidateTag('user-info', { expire: 0 });
//     }
//     return result;

//   } catch (error: any) {
//     console.error('Profile update fetch failed:', error);

//     if (error.name === 'AbortError') {
//       return { success: false, message: 'Request timed out. Please try again.' };
//     }
//     if (error.cause?.code === 'ECONNREFUSED') {
//       return { success: false, message: 'Backend server is not running. Please start the backend server.' };
//     }
//     return {
//       success: false,
//       message: error.message || 'Network error. Please check your connection.',
//     };
//   }
// }
// services/auth/auth.service.ts
export async function updateMyProfile(formData: FormData) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get("accessToken")?.value;

    if (!token) {
      console.error("No access token found in cookies");
      return {
        success: false,
        message: "You are not logged in. Please login again.",
      };
    }

    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (!apiUrl) {
      console.error("NEXT_PUBLIC_API_URL is not defined");
      return {
        success: false,
        message: "Server configuration error: API URL missing",
      };
    }

    const url = `${apiUrl}/users/me`;

    // ✅ সরাসরি fetch ব্যবহার করুন – FormData এর জন্য Content-Type সেট করবেন না
    const response = await fetch(url, {
      method: "PATCH",
      headers: {
        Authorization: `Bearer ${token}`,
        // ❌ Content-Type সেট করবেন না – ব্রাউজার নিজে বাউন্ডারি সহ সেট করবে
      },
      body: formData,
      signal: AbortSignal.timeout(15000),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error("Backend error response (status", response.status, "):", errorText);
      return {
        success: false,
        message: `Server error (${response.status}): ${errorText.substring(0, 200)}`,
      };
    }

    const result = await response.json();

    if (result.success) {
      revalidateTag("user-profile", { expire: 0 });
      revalidateTag("my-profile", { expire: 0 });
      revalidateTag("user-info", { expire: 0 });
    }
    return result;

  } catch (error: any) {
    console.error("Profile update fetch failed:", error);

    if (error.name === "AbortError") {
      return { success: false, message: "Request timed out. Please try again." };
    }
    if (error.cause?.code === "ECONNREFUSED") {
      return { success: false, message: "Backend server is not running. Please start the backend server." };
    }
    return {
      success: false,
      message: error.message || "Network error. Please check your connection.",
    };
  }
}
// ==================== PROTECTED ACTION ====================
export async function protectedAction(action: string, formData: FormData) {
  try {
    const user = await getCurrentUser();
    if (!user) {
      return {
        success: false,
        message: 'Authentication required',
      };
    }
    return {
      success: true,
      message: 'Action completed',
    };
  } catch (error: any) {
    return {
      success: false,
      message: error.message || 'Action failed',
    };
  }
}

// ==================== REFRESH TOKEN ====================
export async function getNewAccessToken() {
  try {
    const accessToken = await getCookie('accessToken');
    const refreshToken = await getCookie('refreshToken');

    // Case 1: Both tokens missing → logged out
    if (!accessToken && !refreshToken) {
      return { tokenRefreshed: false };
    }

    // Case 2: Access token exists and is valid
    if (accessToken) {
      const verifiedToken = await verifyAccessToken(accessToken);
      if (verifiedToken.success) {
        return { tokenRefreshed: false };
      }
    }

    // Case 3: Refresh token missing → logged out
    if (!refreshToken) {
      return { tokenRefreshed: false };
    }

    // Case 4: Access token expired → refresh using refreshToken
    let accessTokenObject: any = null;
    let refreshTokenObject: any = null;

    // 🔥 Use serverFetch
    const response = await serverFetch.post('/auth/refresh-token', {
      headers: {
        Cookie: `refreshToken=${refreshToken}`,
      },
    });

    const result = await response.json();

    const setCookieHeaders = response.headers.getSetCookie();

    if (setCookieHeaders && setCookieHeaders.length > 0) {
      setCookieHeaders.forEach((cookie: string) => {
        const parsedCookie = parse(cookie);
        if (parsedCookie['accessToken']) accessTokenObject = parsedCookie;
        if (parsedCookie['refreshToken']) refreshTokenObject = parsedCookie;
      });
    } else {
      throw new Error('No Set-Cookie header found');
    }

    if (!accessTokenObject || !refreshTokenObject) {
      throw new Error('Tokens not found in cookies');
    }

    await deleteCookie('accessToken');
    await setCookie('accessToken', accessTokenObject.accessToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(accessTokenObject['Max-Age']) || 60 * 60,
      path: accessTokenObject.Path || '/',
      sameSite: accessTokenObject['SameSite'] || 'none',
    });

    await deleteCookie('refreshToken');
    await setCookie('refreshToken', refreshTokenObject.refreshToken, {
      secure: true,
      httpOnly: true,
      maxAge: parseInt(refreshTokenObject['Max-Age']) || 60 * 60 * 24 * 90,
      path: refreshTokenObject.Path || '/',
      sameSite: refreshTokenObject['SameSite'] || 'none',
    });

    if (!result.success) {
      throw new Error(result.message || 'Token refresh failed');
    }

    return {
      tokenRefreshed: true,
      success: true,
      message: 'Token refreshed successfully',
    };

  } catch (error: any) {
    return {
      tokenRefreshed: false,
      success: false,
      message: error?.message || 'Something went wrong',
    };
  }
}
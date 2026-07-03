//local-guide-frontend/my-app/types/auth.interface.ts   

export type UserRole = 'admin' | 'guide' | 'tourist';

export interface User {
  _id: string;
  name: string;
  email: string;
  role: UserRole;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  languages: string[];
  status: 'ACTIVE' | 'INACTIVE' | 'BLOCKED' | 'DELETED';
  isVerified: boolean;

  // Guide specific
  expertise?: string[];
  dailyRate?: number;
  rating?: number;
  totalReviews?: number;
  yearsOfExperience?: number;

  // Tourist specific
  travelPreferences?: string[];
  wishlist?: string[];

  createdAt: string;
  updatedAt: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
  role: 'tourist' | 'guide';
  bio?: string;
  languages?: string[];

  // Guide specific
  expertise?: string[];
  dailyRate?: number;
  yearsOfExperience?: number;

  // Tourist specific
  travelPreferences?: string[];
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    user: User;
    accessToken: string;
    refreshToken: string;
  };
}
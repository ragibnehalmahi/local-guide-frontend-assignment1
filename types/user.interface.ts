
//local-guide-frontend/my-app/types/user.interface.ts   
export interface UserInfo {
  id: string;
  name: string;
  email: string;
  role: UserRole;
}
export enum UserRole {
  admin = "admin",
  tourist = "tourist",
  guide = "guide"
}

export enum UserStatus {
  ACTIVE = "ACTIVE",
  INACTIVE = "INACTIVE",
  BLOCKED = "BLOCKED",
  DELETED = "DELETED"
}

export interface IUserLocation {
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state?: string;
  postalCode?: string;
  country?: string;
  coordinates?: {
    lat: number;
    lng: number;
  };
}

export interface IUser {
  id: string;
  name: string;
  email: string;
  phone?: string;
  profilePicture?: string;
  bio?: string;
  languages: string[];
  role: UserRole;
  status: UserStatus;

  // Guide-specific
  expertise?: string[];
  dailyRate?: number;
  rating?: number;
  totalReviews?: number;
  yearsOfExperience?: number;
  availableDates?: Date[];

  // Tourist-specific
  travelPreferences?: string[];
  wishlist?: string[];

  location?: IUserLocation;
  createdAt: string;
  updatedAt: string;
}

export interface ILoginResponse {
  success: boolean;
  message: string;
  data: {
    user: IUser;
    accessToken: string;
    refreshToken: string;
  };
}

export interface IAuthState {
  user: IUser | null;
  token: string | null;
  isAuthenticated: boolean;
  role: UserRole | null;
}
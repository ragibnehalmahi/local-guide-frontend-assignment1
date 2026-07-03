//app/types/listing.interface.ts    

import { IUser } from "./user.interface";

export enum ListingCategory {
  FOOD = "food",
  HISTORY = "history",
  ART = "art",
  ADVENTURE = "adventure",
  NIGHTLIFE = "nightlife",
  SHOPPING = "shopping",
  PHOTOGRAPHY = "photography",
  NATURE = "nature"
}

export interface IListingLocation {
  location: string;
  address: string;
  city: string;
  country: string;
}


export interface IListing {
  _id: string;
  id?: string;
  title: string;
  description: string;
  price: number;
  category: ListingCategory;
  status: ListingStatus;
  active: boolean;
  languages?: string[];
  location: {
    address: string;
    city: string;
    country: string;
  };
  guide: {
    id: string;
    name: string;
    email: string;
    profilePicture?: string;
    rating?: number;
    totalReviews?: number;
  };
  images: string[];
  durationHours: number;
  maxGroupSize: number;
  meetingPoint: string;

  availableDates: string[];
  createdAt: string;
  updatedAt: string;
}
export interface IListingFormData {
  title: string;
  description: string;
  price: number;
  durationHours: number;
  maxGroupSize: number;
  meetingPoint: string;
  category: ListingCategory;
  location: {
    address: string;
    city: string;
    country: string;
  };
  languages: string[];
  images: string[];
  availableDates: string[];
}
export interface ICreateListingPayload {
  title: string;
  description: string;
  price: number;
  durationHours: number;
  maxGroupSize: number;
  meetingPoint: string;
  languages: string[];
  category: ListingCategory;
  images: string[];
  location: IListingLocation;
  availableDates?: Date[];
}
export enum ListingStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  BLOCKED = 'BLOCKED'
}
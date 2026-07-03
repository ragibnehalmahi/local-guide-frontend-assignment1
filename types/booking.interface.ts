// app/types/booking.interface.ts 

import { IListing } from "./listing.interface";
import { IUser } from "./user.interface";

export enum BookingStatus {
  PENDING = "PENDING",
  CONFIRMED = "CONFIRMED",
  DECLINED = "DECLINED",
  CANCELLED = "CANCELLED",
  COMPLETED = "COMPLETED"
}

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED"
}


export interface IBooking {
  _id: string;
  tourist: {
    _id: string;
    name: string;
    email: string;
    phone?: string;
    profilePicture?: string;
  };
  guide: {
    _id: string;
    name: string;
    email: string;
    profilePicture?: string;
    languages?: string[];
    rating?: number;
  };
  listing: {
    _id: string;
    title: string;
    price: number;
  };
  tourTitle: string;
  date: string;
  guestCount: number;
  totalPrice: number;
  status: BookingStatus;
  paymentStatus: PaymentStatus;
  reviewed: boolean;
  createdAt: string;
  updatedAt: string;
  meetingPoint?: string;
  totalAmount?: number;
}

export interface ICreateBookingPayload {
  listingId: string;
  date: Date;
  guestCount: number;
}
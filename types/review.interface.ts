//app/types/review.interface.ts  

export enum ReviewStatus {
  PENDING = 'PENDING',
  APPROVED = 'APPROVED',
  REJECTED = 'REJECTED',
  FLAGGED = 'FLAGGED'
}

export interface IReview {
  _id: string;
  id: string;
  tourist: {
    _id: string;
    name: string;
    avatar?: string;
  };
  guide: {
    _id: string;
    name: string;
    avatar?: string;
  };
  booking: {
    _id: string;
    listingTitle: string;
    bookingDate: string;
  };
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

export interface ICompletedBooking {
  _id: string;
  listing: {
    title: string;
    images: string[];
  };
  guide: {
    name: string;
    avatar?: string;
  };
  bookingDate: string;
  totalPrice: number;
  status: string;
}

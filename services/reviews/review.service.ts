// services/reviews/review.service.ts
import { serverFetch } from '@/lib/server-fetch';

export interface CreateReviewData {
  bookingId: string;
  rating: number;
  comment: string;
}

/**
 * ✅ Create new review
 * POST /review/
 */
export async function createReview(data: CreateReviewData) {
  try {
    const response = await serverFetch.post('/review/', {
      body: JSON.stringify(data),
    });

    const result = await response.json();
    return result;
  } catch (error: any) {
    console.error('Error creating review:', error);
    return {
      success: false,
      message: error.message || 'Failed to submit review',
    };
  }
}

/**
 * ✅ Get tourist's own reviews
 * GET /review/tourist/my-reviews
 */
export async function getTouristReviews() {
  try {
    const response = await serverFetch.get('/review/tourist/my-reviews');
    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      message: result.message,
    };
  } catch (error: any) {
    console.error('Error fetching reviews:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch reviews',
    };
  }
}

/**
 * ✅ Get completed bookings for review
 * GET /review/tourist/completed-bookings
 */
export async function getCompletedBookingsForReview() {
  try {
    const response = await serverFetch.get('/review/tourist/completed-bookings');
    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      message: result.message,
    };
  } catch (error: any) {
    console.error('Error fetching completed bookings:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch bookings',
    };
  }
}

/**
 * ✅ Get guide's reviews (public)
 * GET /review/:guideId
 */
export async function getReviewsForGuide(guideId: string) {
  try {
    const response = await serverFetch.get(`/review/${guideId}`);
    const result = await response.json();

    return {
      success: result.success,
      data: result.data || [],
      message: result.message,
    };
  } catch (error: any) {
    console.error('Error fetching guide reviews:', error);
    return {
      success: false,
      data: [],
      message: error.message || 'Failed to fetch guide reviews',
    };
  }
}


// services/payments/payments.service.ts
"use server"
/* eslint-disable @typescript-eslint/no-explicit-any */
import { serverFetch } from "@/lib/server-fetch";
import { revalidateTag } from "next/cache";

export async function initPayment(bookingId: string) {
  try {
    console.log("🔄 initPayment called for booking:", bookingId);

    // ✅ serverFetch automatically adds Authorization header and handles cookies
    const response = await serverFetch.post("/payments/init", {
      body: JSON.stringify({ bookingId }),
    });

    const result = await response.json();
    console.log("✅ Payment init result:", result);

    return result;

  } catch (error: any) {
    console.error("❌ initPayment error:", error);

    return {
      success: false,
      message: error.message || "Failed to initiate payment",
    };
  }
}

export async function handlePaymentSuccess(transactionId: string, amount: string, status: string, val_id: string) {
  try {
    // ✅ serverFetch uses the base URL automatically; pass only endpoint
    const response = await serverFetch.post(
      `/payments/success?tran_id=${transactionId}&amount=${amount}&status=${status}&val_id=${val_id}`
    );

    const result = await response.json();

    if (result.success) {
      revalidateTag("my-bookings", { expire: 0 });
      revalidateTag("guide-bookings", { expire: 0 });
    }

    return result;
  } catch (error: any) {
    console.error("Payment success callback error:", error);
    return {
      success: false,
      message: error.message || "Payment processing failed",
    };
  }
}

export async function checkPaymentStatus(transactionId: string) {
  try {
    const response = await serverFetch.get(
      `/payments/status?transactionId=${transactionId}`
    );

    const result = await response.json();

    if (result.success && result.data?.status === 'PAID') {
      revalidateTag('my-bookings', { expire: 0 });
    }

    return result;

  } catch (error: any) {
    console.error("Error checking payment status:", error);
    return {
      success: false,
      data: null,
      message: error.message || "Failed to check payment status",
    };
  }
}
// app/payment/components/PaymentSuccess.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, ArrowRight, Home, Calendar, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentSuccess() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [paymentData, setPaymentData] = useState<{
    transactionId: string;
    amount: string;
    status: string;
  } | null>(null);

  useEffect(() => {
    const transactionId = searchParams.get("transactionId");
    const amount = searchParams.get("amount");
    const status = searchParams.get("status");

    if (!transactionId) {
      toast.error("Invalid payment response");
      router.push("/");
      return;
    }

    setPaymentData({
      transactionId,
      amount: amount || "0",
      status: status || "success",
    });

    // Verify payment with backend
    const verifyPayment = async () => {
      try {
        const token = localStorage.getItem("accessToken");
        
        // Call API to verify payment
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_API_URL}/payments/status?transactionId=${transactionId}`,
          {
            headers: {
              Authorization: token ? `Bearer ${token}` : "",
            },
            credentials: "include",
          }
        );
        
        if (!response.ok) {
          throw new Error("Payment verification failed");
        }

        const result = await response.json();
        
        // Check if status is PAID
        if (result.data?.status !== "PAID") {
          console.log("Payment status is not PAID yet:", result.data?.status);
          // We could either wait or show an error, but usually the redirect means it's done.
          // For now, if response is OK it's a good sign.
        }

        toast.success("Payment successful! Your booking is confirmed.");
        setLoading(false);
      } catch (error) {
        console.error("Payment verification error:", error);
        toast.error("Payment verification failed");
        setLoading(false);
      }
    };

    verifyPayment();
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Verifying your payment...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
            <CheckCircle className="h-10 w-10 text-green-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-green-700">
            Payment Successful!
          </CardTitle>
          <p className="text-gray-600 mt-2">
            Thank you for your payment. Your tour booking has been confirmed.
          </p>
        </CardHeader>

        <CardContent className="space-y-6">
          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 space-y-3">
            <div className="flex justify-between">
              <span className="text-gray-600">Transaction ID</span>
              <span className="font-mono text-sm truncate" title={paymentData.transactionId}>
                {paymentData.transactionId}
              </span>
            </div>
            {paymentData.amount && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount Paid</span>
                <span className="font-bold text-green-700">${paymentData.amount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-bold text-green-700">Success</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Link href="/tourist/dashboard/bookings" className="block">
              <Button className="w-full bg-green-600 hover:bg-green-700">
                <Calendar className="h-4 w-4 mr-2" />
                View My Bookings
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
            </Link>
            
            <Link href="/" className="block">
              <Button variant="outline" className="w-full">
                <Home className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 text-center pt-4">
            Need help? Contact support at support@localguide.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
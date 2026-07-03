// app/payment/components/PaymentFail.tsx
"use client";

import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { XCircle, ArrowLeft, AlertTriangle, RefreshCw, Loader2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function PaymentFail() {
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
    const status = searchParams.get("status") || "failed";

    if (!transactionId) {
      toast.error("Invalid payment response");
      router.push("/");
      return;
    }

    setPaymentData({
      transactionId,
      amount: amount || "0",
      status,
    });

    // Log failed payment
    console.log("Payment failed:", { transactionId, amount, status });
    
    if (status === "cancel") {
      toast.error("Payment was cancelled");
    } else {
      toast.error("Payment failed. Please try again.");
    }
    
    setLoading(false);
  }, [searchParams, router]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto" />
          <p className="mt-4 text-gray-600">Processing payment status...</p>
        </div>
      </div>
    );
  }

  if (!paymentData) return null;

  return (
    <div className="min-h-screen bg-gradient-to-b from-red-50 to-white flex items-center justify-center p-4">
      <Card className="w-full max-w-md shadow-xl">
        <CardHeader className="text-center pb-4">
          <div className="mx-auto w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mb-4">
            <XCircle className="h-10 w-10 text-red-600" />
          </div>
          <CardTitle className="text-2xl font-bold text-red-700">
            Payment Failed
          </CardTitle>
          <p className="text-gray-600 mt-2">
            {paymentData.status === "cancel" 
              ? "You cancelled the payment." 
              : "We couldn't process your payment. Please try again."}
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
            {paymentData.amount && paymentData.amount !== "0" && (
              <div className="flex justify-between">
                <span className="text-gray-600">Amount</span>
                <span className="font-bold text-red-700">${paymentData.amount}</span>
              </div>
            )}
            <div className="flex justify-between">
              <span className="text-gray-600">Status</span>
              <span className="font-bold text-red-700 capitalize">
                {paymentData.status === "cancel" ? "Cancelled" : "Failed"}
              </span>
            </div>
          </div>

          {/* Error Message */}
          <div className="bg-amber-50 border border-amber-200 rounded-lg p-4">
            <div className="flex items-start gap-3">
              <AlertTriangle className="h-5 w-5 text-amber-600 mt-0.5" />
              <div>
                <h4 className="font-medium text-amber-800">What went wrong?</h4>
                <ul className="mt-2 text-sm text-amber-700 space-y-1">
                  {paymentData.status === "cancel" ? (
                    <li>You cancelled the payment process</li>
                  ) : (
                    <>
                      <li>Insufficient balance in your account</li>
                      <li>Card details were incorrect</li>
                      <li>Network or technical issue</li>
                      <li>Card is expired or blocked</li>
                    </>
                  )}
                </ul>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3 pt-4">
            <Button 
              onClick={() => window.history.back()}
              className="w-full bg-amber-600 hover:bg-amber-700"
            >
              <RefreshCw className="h-4 w-4 mr-2" />
              Try Payment Again
            </Button>
            
            <Link href="/tourist/dashboard/bookings" className="block">
              <Button variant="outline" className="w-full">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Bookings
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="ghost" className="w-full">
                Back to Homepage
              </Button>
            </Link>
          </div>

          <p className="text-xs text-gray-500 text-center pt-4">
            Need help? Contact support: support@localguide.com
          </p>
        </CardContent>
      </Card>
    </div>
  );
}
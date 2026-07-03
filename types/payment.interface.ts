//app/types/payment.interface.ts  

export enum PaymentStatus {
  PENDING = "PENDING",
  PAID = "PAID",
  FAILED = "FAILED"
}

export interface IPaymentInitResponse {
  redirectUrl: string;
  transactionId: string;
}

export interface IPaymentStatusResponse {
  status: PaymentStatus;
  amount: number;
  transactionId: string;
  bookingId: string;
  createdAt: string;
  updatedAt: string;
}
/** Payment provider abstraction — implement Razorpay (or other) when credentials are configured. */

export type PaymentMethod = "pay_on_delivery" | "upi_manual" | "online_gateway";

export type CreateGatewayPaymentInput = {
  orderId: string;
  amountPaise: number;
  currency: "INR";
  customerPhone: string;
};

export type CreateGatewayPaymentResult =
  | { ok: true; providerReference: string; clientPayload: Record<string, string> }
  | { ok: false; error: string };

export interface PaymentProvider {
  createPayment(input: CreateGatewayPaymentInput): Promise<CreateGatewayPaymentResult>;
  verifyWebhookSignature(headers: Headers, body: string): boolean;
}

export function getPaymentProvider(): PaymentProvider | null {
  if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
    return null;
  }
  return null; // Razorpay adapter to be added in FR-017 increment
}

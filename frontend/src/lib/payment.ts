import api from "./axios";

export type CreatePaymentPayload = {
  client_name: string;
  layout_id: number;
  frame_id?: number | null;
};

export type CreatePaymentResponse = {
  snap_token: string;
  order_id: string;
  client_key: string;
  amount: number;
};

export type PaymentStatusResponse = {
  order_id: string;
  status: string;
  paid_at: string | null;
  amount: number;
  transaction_id: string | null;
};

export async function createPayment(payload: CreatePaymentPayload) {
  const res = await api.post<CreatePaymentResponse>("/payments/create", payload);
  return res.data;
}

export async function getPaymentStatus(orderId: string) {
  const res = await api.get<PaymentStatusResponse>(`/payments/${orderId}/status`);
  return res.data;
}

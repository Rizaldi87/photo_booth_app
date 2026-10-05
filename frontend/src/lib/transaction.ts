import api from './axios';

export type Transaction = {
  id: number;
  client_name: string | null;
  layout_id: number;
  frame_id: number | null;
  midtrans_order_id: string;
  midtrans_status: string;
  amount: number;
  payment_method: string | null;
  payment_type: string | null;
  snap_token: string | null;
  transaction_id: string | null;
  fraud_status: string | null;
  qr_code_url: string | null;
  paid_at: string | null;
  created_at: string;
  updated_at: string;
  layout?: { id: number; name: string };
  frame?: { id: number; name: string };
};

export type PaginatedTransactions = {
  data: Transaction[];
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
};

export async function getTransactions(page = 1) {
  const res = await api.get<PaginatedTransactions>(`/transactions?page=${page}`);
  return res.data;
}

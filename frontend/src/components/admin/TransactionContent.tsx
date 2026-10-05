import { useEffect, useState } from "react";
import { getTransactions, type Transaction } from "../../lib/transaction";
import { FiRefreshCw } from "react-icons/fi";
import { FaChevronLeft, FaChevronRight } from "react-icons/fa";

const statusColors: Record<string, string> = {
  pending: "bg-yellow-900/40 text-yellow-400 border border-yellow-700/60",
  settlement: "bg-green-900/40 text-green-400 border border-green-700/60",
  capture: "bg-green-900/40 text-green-400 border border-green-700/60",
  challenge: "bg-orange-900/40 text-orange-400 border border-orange-700/60",
  expire: "bg-gray-900/40 text-gray-400 border border-gray-700/60",
  cancel: "bg-red-900/40 text-red-400 border border-red-700/60",
  deny: "bg-red-900/40 text-red-400 border border-red-700/60",
  failure: "bg-red-900/40 text-red-400 border border-red-700/60",
};

const formatCurrency = (amount: number) => `Rp. ${amount.toLocaleString("id-ID")}`;
const formatDate = (date: string) => new Date(date).toLocaleString("id-ID");

export default function TransactionContent() {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [page, setPage] = useState(1);
  const [lastPage, setLastPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const fetchTransactions = async (currentPage = page) => {
    setLoading(true);
    try {
      const res = await getTransactions(currentPage);
      setTransactions(res.data);
      setPage(res.current_page);
      setLastPage(res.last_page);
    } catch (error) {
      console.error("Failed to fetch transactions:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTransactions(1);
    setPage(1);
  }, []);

  const handlePrev = () => {
    if (page > 1) {
      fetchTransactions(page - 1);
    }
  };

  const handleNext = () => {
    if (page < lastPage) {
      fetchTransactions(page + 1);
    }
  };

  return (
    <div className="w-full h-full bg-black text-white p-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-mono text-[#C9A84C]">Transactions</h1>
        <button
          onClick={() => fetchTransactions(page)}
          disabled={loading}
          className="flex items-center gap-2 px-4 py-2 border border-[#262626] text-[#555250] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors disabled:opacity-50 cursor-pointer"
        >
          <FiRefreshCw className={loading ? "animate-spin" : ""} />
          Refresh
        </button>
      </div>

      <div className="bg-[#111111] border border-[#262626] rounded-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-[#262626] bg-[#161616]">
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">ID</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Client</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Order ID</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Layout</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Frame</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Amount</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Payment Type</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Status</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Fraud</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Transaction ID</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Paid At</th>
                <th className="text-left p-4 font-mono text-sm text-[#555250] uppercase">Created At</th>
              </tr>
            </thead>
            <tbody>
              {loading && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-[#555250]">
                    Loading transactions...
                  </td>
                </tr>
              )}
              {!loading && transactions.length === 0 && (
                <tr>
                  <td colSpan={12} className="p-8 text-center text-[#555250]">
                    No transactions found
                  </td>
                </tr>
              )}
              {!loading &&
                transactions.map((tx) => (
                  <tr key={tx.id} className="border-b border-[#262626] hover:bg-[#161616] transition-colors">
                    <td className="p-4 text-sm text-[#676666] font-mono">#{tx.id}</td>
                    <td className="p-4 text-sm text-white">{tx.client_name || "-"}</td>
                    <td className="p-4 text-sm text-[#676666] font-mono text-xs">{tx.midtrans_order_id}</td>
                    <td className="p-4 text-sm text-white">{tx.layout?.name || "-"}</td>
                    <td className="p-4 text-sm text-white">{tx.frame?.name || "-"}</td>
                    <td className="p-4 text-sm text-[#C9A84C]">{formatCurrency(tx.amount)}</td>
                    <td className="p-4 text-sm text-[#676666]">{tx.payment_type || tx.payment_method || "-"}</td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded-sm text-xs font-mono ${statusColors[tx.midtrans_status] || "bg-gray-900/40 text-gray-400 border border-gray-700/60"}`}>
                        {tx.midtrans_status}
                      </span>
                    </td>
                    <td className="p-4 text-sm text-[#676666]">{tx.fraud_status || "-"}</td>
                    <td className="p-4 text-sm text-[#676666] font-mono text-xs">{tx.transaction_id || "-"}</td>
                    <td className="p-4 text-sm text-[#676666] text-xs">{tx.paid_at ? formatDate(tx.paid_at) : "-"}</td>
                    <td className="p-4 text-sm text-[#676666] text-xs">{formatDate(tx.created_at)}</td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>

        <div className="flex justify-between items-center p-4 border-t border-[#262626] bg-[#161616]">
          <div className="text-sm text-[#555250] font-mono">
            Page {page} of {lastPage}
          </div>
          <div className="flex gap-2">
            <button
              onClick={handlePrev}
              disabled={page <= 1 || loading}
              className="flex items-center gap-2 px-4 py-2 border border-[#262626] text-[#555250] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors disabled:opacity-50 cursor-pointer"
            >
              <FaChevronLeft className="text-xs" />
              Prev
            </button>
            <button
              onClick={handleNext}
              disabled={page >= lastPage || loading}
              className="flex items-center gap-2 px-4 py-2 border border-[#262626] text-[#555250] hover:text-[#C9A84C] hover:border-[#C9A84C] transition-colors disabled:opacity-50 cursor-pointer"
            >
              Next
              <FaChevronRight className="text-xs" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import { IoMdArrowBack } from "react-icons/io";
import type { Frame } from "../../../types/FrameType";
import type { Layout } from "../../../types/LayouOutType";
import { createPayment } from "../../../lib/payment";
import toast from "react-hot-toast";

type PayStepProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  selectedLayout: Layout | null;
  selectedFrame: Frame | null;
};

declare global {
  interface Window {
    snap: any;
  }
}

export default function PayStep({ currentStep, setCurrentStep, selectedLayout, selectedFrame }: PayStepProps) {
  const previewScale = selectedLayout?.row && selectedLayout.row > 2 ? 0.85 : 1;
  const [loading, setLoading] = useState(false);
  const [snapLoaded, setSnapLoaded] = useState(false);
  const [clientName, setClientName] = useState("");

  useEffect(() => {
    const clientKey = import.meta.env.VITE_MIDTRANS_CLIENT_KEY;
    const env = import.meta.env.VITE_MIDTRANS_ENV || "sandbox";
    if (!clientKey) return;

    // Hapus script lama jika ada (opsional)
    const existing = document.querySelector("#midtrans-snap-script");
    if (existing) {
      setSnapLoaded(true);
      return;
    }

    const script = document.createElement("script");
    script.id = "midtrans-snap-script";
    script.src = env === "production" ? "https://app.midtrans.com/snap/snap.js" : "https://app.sandbox.midtrans.com/snap/snap.js";
    script.setAttribute("data-client-key", clientKey);
    script.async = true;
    script.onload = () => setSnapLoaded(true);
    script.onerror = () => toast.error("Gagal memuat Snap.js");
    document.body.appendChild(script);

    return () => {
      // Jangan remove script saat unmount (bisa dipakai step lain) — aman dibiarkan
    };
  }, []);

  const handlePay = async () => {
    if (!selectedLayout) {
      toast.error("Pilih layout terlebih dahulu");
      return;
    }
    if (!snapLoaded || !window.snap) {
      toast.error("Snap.js belum siap, coba lagi sebentar");
      return;
    }

    setLoading(true);
    try {
      const res = await createPayment({
        client_name: clientName,
        layout_id: selectedLayout.id,
        frame_id: selectedFrame?.id ?? null,
      });

      window.snap.pay(res.snap_token, {
        onSuccess: function (result: any) {
          toast.success("Pembayaran berhasil!");
          // Lanjut ke step Capture (index 4)
          setCurrentStep(currentStep + 1);
          console.log("payment success", result);
        },
        onPending: function (result: any) {
          toast("Menunggu pembayaran...", { icon: "⏳" });
          // Tetap bisa lanjut? tergantung kebijakan; biasanya tunggu settlement
          // Untuk booth ini, kita bisa arahkan ke capture setelah user konfirmasi? tapi lebih aman tunggu settled
          console.log("payment pending", result);
        },
        onError: function (result: any) {
          toast.error("Pembayaran gagal");
          console.log("payment error", result);
        },
        onClose: function () {
          toast("Pembayaran dibatalkan", { icon: "ℹ️" });
          // User menutup popup tanpa menyelesaikan
        },
      });
    } catch (err: any) {
      toast.error(err?.response?.data?.message || "Gagal membuat transaksi");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-[#C9A84C]">STEP {currentStep} of 4</div>
      <h1 className="mt-6 text-5xl text-white font-mono">Confirm & Pay</h1>
      <div className="flex flex-col items-center md:items-start md:flex-row justify-center gap-5 mt-6">
        <div className="w-72 bg-[#161616] border border-[#262626] p-8 rounded-sm">
          <h2 className="text-[#555250] font-mono mb-2">Order Summary</h2>
          <div className="flex justify-center max-h-60 overflow-hidden">
            <div style={{ transform: `scale(${previewScale})`, transformOrigin: "top center" }}>
              <div className="p-2" style={{ backgroundColor: selectedFrame?.backgroundColor || "#ffffff", border: `${selectedFrame?.borderWidth || 0}px solid ${selectedFrame?.borderColor || "#000000"}` }}>
                <div className="w-32 flex flex-col gap-2">
                  <div className="text-center font-bold" style={{ fontSize: `${selectedFrame?.fontSize || 14}px` }}>
                    {selectedFrame?.titleText}
                  </div>
                  <div className={`grid gap-1 ${selectedLayout?.column === 2 ? "grid-cols-2" : "grid-cols-1"}`}>
                    {Array.from({ length: selectedLayout?.photo_count || 4 }).map((_, index) => (
                      <div key={index} className="h-16 w-full border border-dashed border-gray-400 bg-gray-100" />
                    ))}
                  </div>
                  <div className="text-center" style={{ fontSize: `${(selectedFrame?.fontSize || 14) - 2}px` }}>
                    {selectedFrame?.bottomText}
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="py-6 border-b border-t border-[#262626] flex flex-col gap-4 mt-8 font-mono">
            <div className="w-full flex justify-between items-center">
              <p className="text-[#555250] text-[12px]">Layout:</p>
              <p className="text-white text-[12px]">{selectedLayout?.name}</p>
            </div>
            <div className="w-full flex justify-between items-center">
              <p className="text-[#555250] text-[12px]">Frame:</p>
              <p className="text-white text-[12px]">{selectedFrame?.name}</p>
            </div>
            <div className="w-full flex justify-between items-center">
              <p className="text-[#555250] text-[12px]">Photos Count:</p>
              <p className="text-white text-[12px]">{selectedLayout?.photo_count} shots</p>
            </div>
          </div>
          <div className="w-full flex justify-between items-center mt-4 font-mono">
            <p className="text-[#555250] text-[12px]">Total Price:</p>
            <p className="text-[#C9A84C] text-2xl">Rp. {selectedLayout ? selectedLayout.price.toLocaleString("id-ID") : "0"}</p>
          </div>
        </div>
        <div className="w-80 h-fit bg-[#161616] border border-[#262626] p-6 rounded-sm">
          <div className="flex flex-col gap-3 mb-4">
            <label htmlFor="clientName" className="text-[#555250] text-xs font-mono">Nama Pemesan</label>
            <input
              id="clientName"
              type="text"
              value={clientName}
              onChange={(e) => setClientName(e.target.value)}
              placeholder="Masukkan nama Anda"
              className="bg-[#111111] border border-[#262626] text-white px-3 py-2 rounded-sm text-sm focus:outline-none focus:border-[#C9A84C] placeholder-[#555250]"
              required
            />
          </div>
          <h2 className="text-[#555250] font-mono mb-2 text-center">Payment Method</h2>
          <button onClick={handlePay} disabled={loading || !snapLoaded || !selectedLayout || !clientName.trim()} className="bg-[#C9A84C] rounded-xs px-4 py-3 w-full cursor-pointer mt-4 disabled:opacity-50 disabled:cursor-not-allowed">
            {loading ? "Processing..." : "Pay via Midtrans"}
          </button>
          <div className="flex items-center justify-center gap-6 mt-4 text-xs text-[#555250] pb-8 border-b border-[#262626]">
            <p>GoPay</p>
            <p>QRIS</p>
            <p>Transfer</p>
            <p>Card</p>
          </div>
          <p className="text-center mt-4 text-[#555250] text-xs">Setelah pembayaran berhasil, Anda akan melanjut ke tahap pengambilan foto.</p>
        </div>
      </div>
      <button onClick={() => setCurrentStep(currentStep - 1)} className="text-[#555250] flex items-center gap-2 mt-6 cursor-pointer">
        <IoMdArrowBack /> Back
      </button>
    </div>
  );
}

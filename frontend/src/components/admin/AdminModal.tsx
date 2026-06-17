import type { ReactNode } from "react";
import { AiOutlineCloseCircle } from "react-icons/ai";

type Props = {
  title: string;
  children: ReactNode;
  setModalActive: React.Dispatch<React.SetStateAction<boolean>>;
};

export default function AdminModal({ title, children, setModalActive }: Props) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm">
      <div className="w-fit max-w-3xl rounded-lg border border-[#C9A84C]/30 bg-[#18140E]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-[#C9A84C]/20">
          <h2 className="text-[#C9A84C]">{title}</h2>

          <button onClick={() => setModalActive(false)}>
            <AiOutlineCloseCircle className="text-white cursor-pointer hover:text-red-400" />
          </button>
        </div>

        <div className="p-5">{children}</div>
      </div>
    </div>
  );
}

import { useEffect, useState } from "react";
import type { Layout } from "../../../types/LayouOutType";
import { IoMdArrowBack } from "react-icons/io";
import toast from "react-hot-toast";
import axios from "axios";
import LoadingBar from "../../LoadingBar";
import LayoutPreview from "../../LayoutPreview";

type LayoutStepProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;
  setSelectedLayout: (layout: Layout | null) => void;
};

export default function LayoutStep({ currentStep, setCurrentStep, setSelectedLayout }: LayoutStepProps) {
  const [layouts, setLayouts] = useState<Layout[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchLayout = async () => {
    try {
      const res = await axios.get("api/layouts/active");
      console.log(res.data);
      setLayouts(res.data.data);
    } catch (error) {
      toast.error(`Failed to load Layouts, ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadLayouts = async () => {
      fetchLayout();
    };
    loadLayouts();
  }, []);
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-[#C9A84C]">STEP {currentStep} of 4</div>
      <div className="mt-12 text-5xl text-white font-mono">Choose a layout</div>
      <div className="mt-10 text-[#555250] font-mono">This determines how many photos you will take and how they are arranged on your print</div>
      <div className="flex flex-col"></div>
      <div className="relative flex items-center justify-center gap-5 mt-10 flex-wrap">
        {isLoading ? (
          <LoadingBar />
        ) : (
          layouts.map((layout) => (
            <button
              onClick={() => {
                setSelectedLayout(layout);
                setCurrentStep(currentStep + 1);
              }}
              key={layout.id}
              className="
            w-52 h-80
            border border-[#262626]
            bg-[#161616]
            hover:border-[#C9A84C]
            hover:-translate-y-2 transition-transform duration-200
            rounded-sm
            cursor-pointer
            flex flex-col items-center justify-center gap-2 
            "
            >
              <LayoutPreview row={layout.row} column={layout.column} />
              <div className="text-xl text-white font-mono mt-4 text-center">{layout.name}</div>
              <div className="text-sm text-[#555250] mt-2 text-center px-3">{layout.description}</div>
              <div className="text-lg text-[#C9A84C] mt-4 text-center font-mono">Rp. {layout.price.toLocaleString("id-ID")}</div>
            </button>
          ))
        )}
      </div>

      {/* back button */}
      <button onClick={() => setCurrentStep(0)} className={`text-[#555250] flex items-center gap-2 ${isLoading ? "hidden" : ""} mt-10 cursor-pointer`}>
        <IoMdArrowBack /> Back
      </button>
    </div>
  );
}

import { IoMdArrowBack } from "react-icons/io";
import type { Layout } from "../../../types/LayouOutType";
import type { Frame } from "../../../types/FrameType";
import { useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import LoadingBar from "../../LoadingBar";
import FramePreview from "../../FramePreview";

type FrameStepProps = {
  currentStep: number;
  setCurrentStep: (step: number) => void;

  selectedLayout: Layout | null;
  setSelectedFrame: (frame: Frame | null) => void;
};

export default function FrameStep({ currentStep, setCurrentStep, selectedLayout, setSelectedFrame }: FrameStepProps) {
  const [frames, setFrames] = useState<Frame[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchFrame = async () => {
    try {
      const res = await axios.get("api/frames");

      setFrames(res.data);
    } catch (error) {
      toast.error(`Failed to load frames, ${error}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const loadFrames = async () => {
      fetchFrame();
    };
    loadFrames();
  }, []);

  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <div className="text-[#C9A84C]">STEP {currentStep} of 4</div>
      <div className="mt-12">
        <h1 className="text-5xl text-white font-mono">Choose a frame</h1>
        <p className="mt-4 text-[#555250] font-mono">
          Decorates the border of your
          <span className="text-[#C9A84C]"> {selectedLayout?.name}</span> print.
        </p>
      </div>
      <div className="relative mt-10 flex items-center justify-center gap-5">
        {isLoading ? (
          <LoadingBar />
        ) : (
          frames.map((frame) => (
            <button
              onClick={() => {
                setCurrentStep(currentStep + 1);
                setSelectedFrame(frame);
              }}
              key={frame.id}
              className="w-64 
            bg-[#161616] border border-[#262626] 
            hover:border-[#C9A84C] hover:-translate-y-1 
            transition-transform duration-200 rounded-sm items-center justify-center mt-5 gap-3 py-2
            flex flex-col
            "
            >
              <div className="flex justify-center">
                <FramePreview frame={frame} />
              </div>
              <div className="text-xl text-white font-mono">{frame.name}</div>
            </button>
          ))
        )}
      </div>
      <button onClick={() => setCurrentStep(currentStep - 1)} className={`text-[#555250] flex items-center gap-2 ${isLoading ? "hidden" : ""} mt-10 cursor-pointer`}>
        <IoMdArrowBack /> Back
      </button>
    </div>
  );
}

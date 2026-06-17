import { useState } from "react";
import StartPage from "../../components/client/steps/StartPage";
import LayoutStep from "../../components/client/steps/LayoutStep";
import type { Layout } from "../../types/LayouOutType";
import FrameStep from "../../components/client/steps/FrameStep";
import type { Frame } from "../../types/FrameType";
import PayStep from "../../components/client/steps/PayStep";
import CaptureStep from "../../components/client/steps/CaptureStep";

const stepPages = [
  {
    title: "Start",
    page: StartPage,
  },
  {
    title: "Layout",
    page: LayoutStep,
  },
  {
    title: "Frame",
    page: FrameStep,
  },
  {
    title: "Pay",
    page: PayStep,
  },
  {
    title: "Capture",
    page: CaptureStep,
  },
];

export default function BoothPage() {
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [selectedLayout, setSelectedLayout] = useState<Layout | null>(null);
  const [selectedFrame, setSelectedFrame] = useState<Frame | null>(null);

  const CurrentPage = stepPages[currentStep].page;

  return (
    <div className="relative w-full h-screen flex items-center justify-center">
      <div className="absolute top-0 left-0 w-full h-1">
        <div
          className="h-full bg-[#C9A84C] transition-all duration-300"
          style={{
            width: `${(currentStep / 4) * 100}%`,
          }}
        />
      </div>
      {/* dynamc page content */}
      <CurrentPage currentStep={currentStep} setCurrentStep={setCurrentStep} selectedLayout={selectedLayout} setSelectedLayout={setSelectedLayout} selectedFrame={selectedFrame} setSelectedFrame={setSelectedFrame} />
    </div>
  );
}

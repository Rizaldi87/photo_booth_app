import { BiCamera } from "react-icons/bi";
import type { PageProps } from "../../../types/PageProps";

const stepTitles: string[] = ["Pick layout", "Pick frame", "Pay", "Take Photos", "Print"];

export default function StartPage({ setCurrentStep }: PageProps) {
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center gap-10 bg-black ">
      <div
        className="relative  
        before:content-['']
        before:absolute
        before:right-[110%]
        before:bottom-[50%]
        before:w-[50%]
        before:h-px
        before:bg-[#C9A84C]

        after:content-['']
        after:absolute
        after:left-[110%]
        after:bottom-[50%]

        after:w-[50%]
        after:h-px

        after:bg-[#C9A84C] text-[#555250] font-mono "
      >
        PHOTO STUDIO
      </div>
      <div className="mt-2 text-[#C9A84C] text-center">
        <h1 className="text-7xl">MyPhotoBooth</h1>
        <h3 className="italic mt-4 text-[#555250]">Choose. Frame. Capture. Keep.</h3>
      </div>
      <div className="mt-3 flex items-center justify-center gap-15">
        {stepTitles.map((title, index) => (
          <div
            key={index}
            className={`relative flex flex-col items-center
             ${
               index !== stepTitles.length - 1
                 ? `
            after:content-['']
            after:absolute
            after:left-[110%]
            after:bottom-[50%]
            after:w-8
            after:h-px
            after:bg-[#C9A84C]
            `
                 : ""
             }

            w-24
            `}
          >
            <p className="text-[#C9A84C] text-center">0{index + 1}</p>
            <p className="text-[#62605e] text-center">{title}</p>
          </div>
        ))}
      </div>

      <button
        onClick={() => setCurrentStep(1)}
        className="mt-10 rounded-full border border-[#C9A84C] hover:bg-[#C9A84C]/20 
      transition-colors duration-300 text-[#C9A84C] flex flex-col items-center gap-2 p-7"
      >
        <BiCamera className="text-5xl " />
        <p>Tap to Begin</p>
      </button>
    </div>
  );
}

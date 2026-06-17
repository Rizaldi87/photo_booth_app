import type { Dispatch, SetStateAction } from "react";

export type PageProps = {
  currentStep: number;
  setCurrentStep: Dispatch<SetStateAction<number>>;
};

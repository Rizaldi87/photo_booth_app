import polaroidOverlay from "../assets/overlays/polaroid-overlay.png";

export type FrameType = {
  id: number;
  name: string;
  overlay?: string;
  frameWidth?: number;
  frameHeight?: number;

  cameraBox?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
};

export const frameTypes: Record<string, FrameType> = {
  classic: {
    id: 1,
    name: "Classic",
    overlay: polaroidOverlay,
    frameWidth: 2077,
    frameHeight: 2288,
    cameraBox: {
      x: 130,
      y: 140,
      width: 1815,
      height: 1650,
    },
  },

  polaroid: {
    id: 2,
    name: "Polaroid",
    overlay: polaroidOverlay,
    frameWidth: 2077,
    frameHeight: 2288,
    cameraBox: {
      x: 170,
      y: 170,
      width: 1730,
      height: 1600,
    },
  },

  birthday: {
    id: 3,
    name: "Birthday Party",
    overlay: polaroidOverlay,
    frameWidth: 2077,
    frameHeight: 2288,
    cameraBox: {
      x: 170,
      y: 170,
      width: 1730,
      height: 1600,
    },
  },

  wedding: {
    id: 4,
    name: "Wedding",
    overlay: polaroidOverlay,
    frameWidth: 2077,
    frameHeight: 2288,
    cameraBox: {
      x: 170,
      y: 170,
      width: 1730,
      height: 1600,
    },
  },
};

export type Frame = {
  id: number;
  name: string;
  backgroundColor: string;
  borderColor: string;
  borderWidth: number;
  titleText: string;
  bottomText: string;
  fontSize: number;
};

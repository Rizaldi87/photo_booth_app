export type LayOutType = {
  id: number;
  name: string;

  slots: PhotoSlot[];
};

export type PhotoSlot = {
  x: number;
  y: number;
  width: number;
  height: number;
};

export const layoutTypes: Record<string, LayOutType> = {
  classic: {
    id: 1,
    name: "Classic",
    slots: [
      {
        x: 0,
        y: 0,
        width: 1,
        height: 1,
      },
    ],
  },

  twoStrip: {
    id: 2,
    name: "1x2 Vertical",
    slots: [
      {
        x: 0,
        y: 0,
        width: 1,
        height: 0.5,
      },
      {
        x: 0,
        y: 0.5,
        width: 1,
        height: 0.5,
      },
    ],
  },

  fourStrip: {
    id: 3,
    name: "2x2",
    slots: [
      {
        x: 0,
        y: 0,
        width: 0.5,
        height: 0.5,
      },
      {
        x: 0.5,
        y: 0,
        width: 0.5,
        height: 0.5,
      },
      {
        x: 0,
        y: 0.5,
        width: 0.5,
        height: 0.5,
      },
      {
        x: 0.5,
        y: 0.5,
        width: 0.5,
        height: 0.5,
      },
    ],
  },
};

export type Layout = {
  id: number;
  name: string;
  description: string;
  price: number;
  column: number;
  row: number;
  photo_count: number;
  isActive?: boolean;
};

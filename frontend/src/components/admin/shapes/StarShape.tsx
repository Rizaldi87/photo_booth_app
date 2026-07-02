import type { ShapeRendererProps } from "../../../types/FrameType";

const points = "50,5 61,38 97,38 68,60 79,95 50,73 21,95 32,60 3,38 39,38";
export default function StarShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <polygon points={points} fill={color} />
    </svg>
  );
}

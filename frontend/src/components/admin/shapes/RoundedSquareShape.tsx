import type { ShapeRendererProps } from "../../../types/FrameType";

export default function RoundedSquareShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <rect x="5" y="5" width="90" height="90" rx="15" ry="15" fill={color} />
    </svg>
  );
}

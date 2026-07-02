import type { ShapeRendererProps } from "../../../types/FrameType";

export default function SquareShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <rect x="5" y="5" width="90" height="90" fill={color} />
    </svg>
  );
}

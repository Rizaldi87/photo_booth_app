import type { ShapeRendererProps } from "../../../types/FrameType";

export default function CircleShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <circle cx="50" cy="50" r="45" fill={color} />
    </svg>
  );
}

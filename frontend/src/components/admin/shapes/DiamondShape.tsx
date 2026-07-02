import type { ShapeRendererProps } from "../../../types/FrameType";

export default function DiamondShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <polygon points="50,5 95,50 50,95 5,50" fill={color} />
    </svg>
  );
}

import type { ShapeRendererProps } from "../../../types/FrameType";

export default function TriangleShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <polygon points="50,5 95,90 5,90" fill={color} />
    </svg>
  );
}

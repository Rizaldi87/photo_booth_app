import type { ShapeRendererProps } from "../../../types/FrameType";

export default function HexagonShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <polygon points="50,5 90,25 90,75 50,95 10,75 10,25" fill={color} />
    </svg>
  );
}

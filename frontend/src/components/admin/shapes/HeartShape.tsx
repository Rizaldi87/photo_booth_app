import type { ShapeRendererProps } from "../../../types/FrameType";

export default function HeartShape({ width, height, color }: ShapeRendererProps) {
  return (
    <svg width={width} height={height} viewBox="0 0 100 100">
      <path d="M50 30 C50 20, 35 10, 20 15 C5 20, 0 40, 15 55 L50 88 L85 55 C100 40, 95 20, 80 15 C65 10, 50 20, 50 30Z" fill={color} />
    </svg>
  );
}

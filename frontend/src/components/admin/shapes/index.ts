import type { ShapeRendererProps } from "../../../types/FrameType";
import CircleShape from "./CircleShape";
import SquareShape from "./SquareShape";
import RoundedSquareShape from "./RoundedSquareShape";
import DiamondShape from "./DiamondShape";
import TriangleShape from "./TriangleShape";
import HexagonShape from "./HexagonShape";
import StarShape from "./StarShape";
import HeartShape from "./HeartShape";

export const shapeComponents: Record<string, React.ComponentType<ShapeRendererProps>> = {
  circle: CircleShape,
  square: SquareShape,
  "rounded-square": RoundedSquareShape,
  diamond: DiamondShape,
  triangle: TriangleShape,
  hexagon: HexagonShape,
  star: StarShape,
  heart: HeartShape,
};

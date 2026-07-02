import type { Frame, Shape } from "../types/FrameType";
import { shapeComponents } from "./admin/shapes";

type Props = {
  frame: Partial<Frame>;
  frameRef?: React.RefObject<HTMLDivElement | null>;
  selectedShapeId?: string | null;
  onShapeClick?: (id: string) => void;
  onShapeMouseDown?: (e: React.MouseEvent, id: string) => void;
  onResizeMouseDown?: (e: React.MouseEvent, id: string, handle: string) => void;
  onRemoveShape?: (id: string) => void;
};

export default function FrameCanvas({ frame, frameRef, selectedShapeId, onShapeClick, onShapeMouseDown, onResizeMouseDown, onRemoveShape }: Props) {
  return (
    <div
      ref={frameRef}
      style={{
        backgroundColor: frame.backgroundColor,
        borderWidth: frame.borderWidth,
        borderColor: frame.borderColor,
      }}
      className="relative p-2 border-solid"
    >
      <div className="w-37.5 flex flex-col gap-2">
        <div style={{ fontSize: frame.fontSize }} className="text-center text-black font-bold">
          {frame.titleText}
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="aspect-3/4 border border-dashed border-gray-400" />
          <div className="aspect-3/4 border border-dashed border-gray-400" />
          <div className="aspect-3/4 border border-dashed border-gray-400" />
          <div className="aspect-3/4 border border-dashed border-gray-400" />
        </div>

        <div style={{ fontSize: frame.fontSize }} className="text-center text-black">
          {frame.bottomText}
        </div>
      </div>

      {frame.shapes?.map((shape: Shape) => {
        const Comp = shapeComponents[shape.type];
        if (!Comp) return null;
        const isSelected = selectedShapeId === shape.id;
        return (
          <div
            key={shape.id}
            style={{
              position: "absolute",
              left: `${shape.x}%`,
              top: `${shape.y}%`,
              width: `${shape.width}%`,
              height: `${shape.height}%`,
              transform: `rotate(${shape.rotation}deg)`,
              cursor: onShapeMouseDown ? "move" : "default",
              outline: isSelected ? "2px dashed #C9A84C" : undefined,
              zIndex: isSelected ? 10 : 0,
            }}
            onClick={(e) => {
              e.stopPropagation();
              onShapeClick?.(shape.id);
            }}
            onMouseDown={(e) => onShapeMouseDown?.(e, shape.id)}
          >
            <Comp width="100%" height="100%" color={shape.color} />
            {isSelected && onRemoveShape && (
              <>
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    onRemoveShape(shape.id);
                  }}
                  style={{
                    position: "absolute",
                    top: -20,
                    right: -20,
                    width: 18,
                    height: 18,
                    borderRadius: "50%",
                    backgroundColor: "#ef4444",
                    color: "white",
                    border: "none",
                    fontSize: 10,
                    cursor: "pointer",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    zIndex: 20,
                  }}
                >
                  X
                </button>
                {["nw", "ne", "sw", "se"].map((h) => (
                  <div
                    key={h}
                    onMouseDown={(e) => onResizeMouseDown?.(e, shape.id, h)}
                    style={{
                      position: "absolute",
                      width: 10,
                      height: 10,
                      backgroundColor: "#C9A84C",
                      border: "1px solid white",
                      cursor: h === "se" || h === "nw" ? "nwse-resize" : "nesw-resize",
                      zIndex: 20,
                      ...(h.includes("n") ? { top: -5 } : { bottom: -5 }),
                      ...(h.includes("w") ? { left: -5 } : { right: -5 }),
                    }}
                  />
                ))}
              </>
            )}
          </div>
        );
      })}
    </div>
  );
}

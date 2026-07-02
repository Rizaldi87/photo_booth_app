import { useEffect, useRef, useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import type { Shape, Frame } from "../../types/FrameType";
import { shapeComponents } from "./shapes";
import FrameCanvas from "../FrameCanvas";

type frameEditorData = Partial<Frame>;

type Props = {
  initialData?: frameEditorData;

  onSubmit: (data: frameEditorData) => void;
};

export default function FrameEditor({ initialData, onSubmit }: Props) {
  const { register, handleSubmit, reset, control } = useForm<frameEditorData>({
    defaultValues: {
      name: "Frame Name",
      backgroundColor: "#ffffff",
      borderColor: "#C9A84C",
      borderWidth: 6,
      titleText: "PHOTO BOOTH",
      bottomText: "PixelBooth",
      fontSize: 14,
    },
  });

  const [shapeVisible, setShapeVisible] = useState(false);
  const [shapes, setShapes] = useState<Shape[]>(initialData?.shapes ?? []);
  const [selectedShapeId, setSelectedShapeId] = useState<string | null>(null);
  const [draggingId, setDraggingId] = useState<string | null>(null);
  const dragOffset = useRef({ x: 0, y: 0 });
  const frameRef = useRef<HTMLDivElement>(null);
  const shapesRef = useRef<Shape[]>(shapes);

  useEffect(() => {
    shapesRef.current = shapes;
  }, [shapes]);

  const [resizeInfo, setResizeInfo] = useState<{
    id: string;
    handle: string;
    startMouseX: number;
    startMouseY: number;
    startWidth: number;
    startHeight: number;
    startLeft: number;
    startTop: number;
  } | null>(null);

  const handleSelectShape = (type: string, color: string) => {
    const newShape: Shape = {
      id: crypto.randomUUID(),
      type,
      x: 6,
      y: 6,
      width: 30,
      height: 30,
      color,
      rotation: 0,
    };
    setShapes((prev) => [...prev, newShape]);
    setSelectedShapeId(newShape.id);
  };

  const handleRemoveShape = (id: string) => {
    setShapes((prev) => prev.filter((s) => s.id !== id));
    if (selectedShapeId === id) setSelectedShapeId(null);
  };

  const handleUpdateShape = (id: string, updates: Partial<Shape>) => {
    setShapes((prev) => prev.map((s) => (s.id === id ? { ...s, ...updates } : s)));
  };

  const handleMouseDown = (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    const shape = shapes.find((s) => s.id === id);
    if (!shape || !frameRef.current) return;
    setDraggingId(id);
    setSelectedShapeId(id);
    const rect = frameRef.current.getBoundingClientRect();
    dragOffset.current = {
      x: ((e.clientX - rect.left) / rect.width) * 100 - shape.x,
      y: ((e.clientY - rect.top) / rect.height) * 100 - shape.y,
    };
  };

  useEffect(() => {
    if (!draggingId) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      if (!frameRef.current) return;
      const shape = shapesRef.current.find((s) => s.id === draggingId);
      if (!shape) return;
      const rect = frameRef.current.getBoundingClientRect();
      const newX = ((e.clientX - rect.left) / rect.width) * 100 - dragOffset.current.x;
      const newY = ((e.clientY - rect.top) / rect.height) * 100 - dragOffset.current.y;
      handleUpdateShape(draggingId, {
        x: Math.max(-10, Math.min(newX, rect.width - shape.width + 10)),
        y: Math.max(-10, Math.min(newY, rect.height - shape.height + 10)),
      });
    };

    const handleGlobalMouseUp = () => {
      setDraggingId(null);
      setResizeInfo(null);
    };

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = "move";

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [draggingId]);

  const handleResizeMouseDown = (e: React.MouseEvent, id: string, handle: string) => {
    e.stopPropagation();
    e.preventDefault();
    const shape = shapes.find((s) => s.id === id);
    if (!shape) return;
    setResizeInfo({
      id,
      handle,
      startMouseX: e.clientX,
      startMouseY: e.clientY,
      startWidth: shape.width,
      startHeight: shape.height,
      startLeft: shape.x,
      startTop: shape.y,
    });
  };

  useEffect(() => {
    if (!resizeInfo) return;

    const handleGlobalMouseMove = (e: MouseEvent) => {
      e.preventDefault();
      const { id, handle, startMouseX, startMouseY, startWidth, startHeight, startLeft, startTop } = resizeInfo;
      if (frameRef.current === null) return;
      const rect = frameRef.current.getBoundingClientRect();
      const dx = ((e.clientX - startMouseX) / rect.width) * 100;
      const dy = ((e.clientY - startMouseY) / rect.height) * 100;

      let newWidth = startWidth;
      let newHeight = startHeight;
      let newX = startLeft;
      let newY = startTop;

      if (handle.includes("e")) {
        newWidth = Math.max(5, startWidth + dx);
      }
      if (handle.includes("w")) {
        newWidth = Math.max(5, startWidth - dx);
        newX = startLeft + startWidth - newWidth;
      }
      if (handle.includes("s")) {
        newHeight = Math.max(5, startHeight + dy);
      }
      if (handle.includes("n")) {
        newHeight = Math.max(5, startHeight - dy);
        newY = startTop + startHeight - newHeight;
      }

      handleUpdateShape(id, { x: newX, y: newY, width: newWidth, height: newHeight });
    };

    const handleGlobalMouseUp = () => setResizeInfo(null);

    document.addEventListener("mousemove", handleGlobalMouseMove);
    document.addEventListener("mouseup", handleGlobalMouseUp);
    document.body.style.userSelect = "none";
    document.body.style.cursor = resizeInfo.handle === "se" || resizeInfo.handle === "nw" ? "nwse-resize" : "nesw-resize";

    return () => {
      document.removeEventListener("mousemove", handleGlobalMouseMove);
      document.removeEventListener("mouseup", handleGlobalMouseUp);
      document.body.style.userSelect = "";
      document.body.style.cursor = "";
    };
  }, [resizeInfo]);

  useEffect(() => {
    reset(
      initialData ?? {
        name: "Frame Name",
        backgroundColor: "#ffffff",
        borderColor: "#C9A84C",
        borderWidth: 6,
        titleText: "PHOTO BOOTH",
        bottomText: "PixelBooth",
        fontSize: 14,
      },
    );
  }, [initialData, reset]);

  const borderWidth = useWatch({
    control,
    name: "borderWidth",
  });

  const backgroundColor = useWatch({
    control,
    name: "backgroundColor",
  });

  const borderColor = useWatch({
    control,
    name: "borderColor",
  });

  const titleText = useWatch({
    control,
    name: "titleText",
  });

  const fontSize = useWatch({
    control,
    name: "fontSize",
  });

  const bottomText = useWatch({
    control,
    name: "bottomText",
  });

  return (
    <div>
      <form
        onSubmit={(e) => {
          handleSubmit((data) => {
            const width = frameRef.current?.clientWidth ?? 0;
            onSubmit({ ...data, shapes, contentWidth: width });
          })(e);
        }}
        className="h-[65vh] bg-black text-white flex"
      >
        {/* LEFT PANEL */}
        <aside className="w-44 shrink-0 border-r border-[#292929] bg-[#111111] flex flex-col">
          <div className="p-3 border-b border-[#292929]">
            <h2 className="text-[#C9A84C] font-mono tracking-widest text-xs">ELEMENTS</h2>
          </div>

          <div className="relative p-3 flex flex-col gap-2">
            <button type="button" className="p-2 text-xs bg-[#1E1A12] border border-[#C9A84C] text-[#C9A84C]">
              + Add Text
            </button>

            <button type="button" className="p-2 text-xs bg-[#1E1A12] border border-[#C9A84C] text-[#C9A84C]">
              + Add Image
            </button>

            <button type="button" onClick={() => setShapeVisible(!shapeVisible)} className="p-2 text-xs bg-[#1E1A12] border border-[#C9A84C] text-[#C9A84C]">
              + Add Shape
            </button>
          </div>

          <div className="border-t border-[#292929] p-3">
            <div className={`${shapeVisible ? "" : "hidden"}`}>
              <ShapeContainer onSelectShape={handleSelectShape} onClose={() => setShapeVisible(false)} />
            </div>
          </div>
        </aside>
        {/* CENTER */}
        <main className="flex-1 flex items-center justify-center bg-[#0B0B0B] p-4">
          <div className="flex flex-col items-center gap-2">
            <span className="font-mono text-[10px] tracking-widest text-[#555250]">FRAME PREVIEW</span>

            <div className="relative" onClick={() => setSelectedShapeId(null)}>
              <FrameCanvas
                frame={{ backgroundColor, borderColor, borderWidth, titleText, bottomText, fontSize, shapes }}
                frameRef={frameRef}
                selectedShapeId={selectedShapeId}
                onShapeClick={(id) => setSelectedShapeId(id)}
                onShapeMouseDown={handleMouseDown}
                onResizeMouseDown={handleResizeMouseDown}
                onRemoveShape={handleRemoveShape}
              />
            </div>
          </div>
        </main>
        {/* RIGHT PANEL */}
        <aside className="w-52 shrink-0 border-l border-[#292929] bg-[#111111] overflow-y-auto">
          <div className="p-3 border-b border-[#292929]">
            <h2 className="text-[#C9A84C] font-mono tracking-widest text-xs">PROPERTIES</h2>
          </div>

          <div className="p-3 flex flex-col gap-3">
            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Frame Name</label>

              <input
                {...register("name")}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Background</label>

              <input type="color" {...register("backgroundColor")} className="w-full h-8" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Border Color</label>

              <input type="color" {...register("borderColor")} className="w-full h-8" />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Border Width</label>
              <div className="flex items-center gap-3">
                <input
                  type="range"
                  min="0"
                  max="30"
                  defaultValue="10"
                  {...register("borderWidth", {
                    valueAsNumber: true,
                  })}
                  className="w-full"
                />
                <span className="text-[10px] text-gray-400">{borderWidth}px</span>
              </div>
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Title Text</label>

              <input
                {...register("titleText")}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>
            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Bottom Text</label>

              <input
                {...register("bottomText")}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>

            <div>
              <label className="block text-xs mb-1 text-[#C9A84C]">Font Size</label>

              <input
                type="number"
                {...register("fontSize", {
                  valueAsNumber: true,
                })}
                defaultValue={24}
                className="
                w-full
                text-xs
                bg-[#0F0C08]
                border border-[#C9A84C]/20
                rounded
                px-2 py-1.5
              "
              />
            </div>

            <button
              type="submit"
              className="
              mt-2
              bg-[#C9A84C]
              text-black
              text-sm
              font-medium
              py-2
              rounded
            "
            >
              Save Frame
            </button>
          </div>
        </aside>
      </form>
    </div>
  );
}

type ShapeContainerProps = {
  onSelectShape: (type: string, color: string) => void;
  onClose?: () => void;
};

function ShapeContainer({ onSelectShape }: ShapeContainerProps) {
  const [selectedColor, setSelectedColor] = useState("#C9A84C");
  const items = [
    { type: "circle", label: "Circle" },
    { type: "square", label: "Square" },
    { type: "rounded-square", label: "Rounded" },
    { type: "diamond", label: "Diamond" },
    { type: "triangle", label: "Triangle" },
    { type: "hexagon", label: "Hexagon" },
    { type: "star", label: "Star" },
    { type: "heart", label: "Heart" },
  ];
  return (
    <div className="w-full p-3 rounded relative">
      <div className="flex items-center gap-2 mb-2 w-full">
        <label className="text-[10px] text-white/80">Color:</label>
        <input type="color" value={selectedColor} onChange={(e) => setSelectedColor(e.target.value)} className="w-full border-0 cursor-pointer" />
      </div>
      <div className="grid grid-cols-3 gap-2 mt-1">
        {items.map(({ type, label }) => {
          const Comp = shapeComponents[type];
          if (!Comp) return null;
          return (
            <button key={type} type="button" onClick={() => onSelectShape(type, selectedColor)} className="flex flex-col items-center gap-1 p-1.5 hover:bg-white/5 rounded">
              <Comp width={24} height={24} color={selectedColor} />
              <span className="text-[9px] text-white/80">{label}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}

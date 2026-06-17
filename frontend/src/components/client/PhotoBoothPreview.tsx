import type { Frame } from "../../types/FrameType";
import type { Layout } from "../../types/LayouOutType";

type Props = {
  frame: Frame | null;
  layout: Layout | null;
};

export default function PhotoBoothPreview({ frame, layout }: Props) {
  const columns = layout?.column || 2;
  const rows = layout?.row || 2;

  const cellWidth = columns === 1 ? "w-full" : columns === 2 ? "w-[48%]" : "w-[31%]";

  return (
    <div
      className="p-3"
      style={{
        backgroundColor: frame?.backgroundColor || "#ffffff",
        border: `${frame?.borderWidth || 0}px solid ${frame?.borderColor || "#000000"}`,
      }}
    >
      <div className="w-[180px] flex flex-col gap-2">
        {/* HEADER */}
        <div
          className="text-center font-bold"
          style={{
            fontSize: `${frame?.fontSize || 14}px`,
          }}
        >
          {frame?.titleText}
        </div>

        {/* PHOTOS */}
        <div
          className="grid gap-1"
          style={{
            gridTemplateColumns: `repeat(${columns}, 1fr)`,
          }}
        >
          {Array.from({ length: columns * rows }).map((_, index) => (
            <div
              key={index}
              className="
                aspect-[3/4]
                border
                border-dashed
                border-gray-400
                bg-gray-100
              "
            />
          ))}
        </div>

        {/* FOOTER */}
        <div
          className="text-center"
          style={{
            fontSize: `${(frame?.fontSize || 14) - 2}px`,
          }}
        >
          {frame?.bottomText}
        </div>
      </div>
    </div>
  );
}

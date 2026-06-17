import type { Frame } from "../types/FrameType";

type Props = {
  frame: Frame;
};

export default function FramePreview({ frame }: Props) {
  return (
    <div
      className="bg-white p-2 shadow-md"
      style={{
        backgroundColor: frame.backgroundColor,
        border: `${frame.borderWidth}px solid ${frame.borderColor}`,
      }}
    >
      <div className="w-30px flex flex-col gap-2">
        <div
          className="text-center font-bold"
          style={{
            fontSize: `${frame.fontSize}px`,
          }}
        >
          {frame.titleText}
        </div>

        <div className="grid grid-cols-2 gap-1">
          <div className="aspect-3/4 border border-dashed border-gray-400" />
          <div className="aspect-3/4 border border-dashed border-gray-400" />
          <div className="aspect-3/4 border border-dashed border-gray-400" />
          <div className="aspect-3/4 border border-dashed border-gray-400" />
        </div>

        <div
          className="text-center"
          style={{
            fontSize: `${Math.max(frame.fontSize - 2, 10)}px`,
          }}
        >
          {frame.bottomText}
        </div>
      </div>
    </div>
  );
}

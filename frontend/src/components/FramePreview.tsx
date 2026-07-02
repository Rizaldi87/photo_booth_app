import type { Frame } from "../types/FrameType";
import FrameCanvas from "./FrameCanvas";

export default function FramePreview({ frame }: { frame: Frame }) {
  return (
    <div className="w-full">
      {" "}
      {/* wrapper untuk atur ukuran di card */}
      <FrameCanvas frame={frame} />
    </div>
  );
}

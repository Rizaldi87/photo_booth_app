import { useCallback, useEffect, useRef, useState } from "react";
import type { Frame } from "../../../types/FrameType";
import type { Layout } from "../../../types/LayouOutType";
import Webcam from "react-webcam";
import * as htmlToImage from "html-to-image";
import { FaCheck } from "react-icons/fa";

type CaptureStepProps = {
  currentStep: number;
  selectedFrame: Frame | null;
  selectedLayout: Layout | null;
};

const PREVIEW_W = 220;
const FRAME_PAD = 14;
const CELL_GAP = 5;
const LABEL_H = 24;
const CAM_RATIO = 3 / 4;

export default function CaptureStep({ currentStep, selectedFrame, selectedLayout }: CaptureStepProps) {
  const [currentPhotoIndex, setCurrentPhotoIndex] = useState(0);
  const [countdown, setCountdown] = useState<number | null>(null);
  const [capturedPhotos, setCapturedPhotos] = useState<string[]>([]);

  const webcamRef = useRef<Webcam>(null);
  const previewRef = useRef<HTMLDivElement>(null);

  const cols = selectedLayout?.column ?? 1;
  const rows = selectedLayout?.row ?? 1;
  const photoCount = selectedLayout?.photo_count ?? cols * rows;

  const hasTopText = Boolean(selectedFrame?.titleText);
  const hasBottomText = Boolean(selectedFrame?.bottomText);

  const borderWidth = selectedFrame?.borderWidth ?? 0;

  const innerW = PREVIEW_W - FRAME_PAD * 2 - borderWidth * 2;
  const cellW = Math.floor((innerW - CELL_GAP * (cols - 1)) / cols);
  const cellH = Math.round(cellW * CAM_RATIO);
  const gridH = rows * cellH + CELL_GAP * (rows - 1);
  const cardH = FRAME_PAD * 2 + (hasTopText ? LABEL_H : 0) + gridH + (hasBottomText ? LABEL_H : 0);

  // ── Countdown + capture ──────────────────────────────────────────────────────
  useEffect(() => {
    if (countdown === null) return;
    if (countdown === 0) {
      const imageSrc = webcamRef.current?.getScreenshot();
      if (imageSrc) {
        setCapturedPhotos((prev) => [...prev, imageSrc]);
        if (currentPhotoIndex < photoCount - 1) setCurrentPhotoIndex((prev) => prev + 1);
      }
      setCountdown(null);
      return;
    }
    const t = setTimeout(() => setCountdown((p) => (p ?? 1) - 1), 1000);
    return () => clearTimeout(t);
  }, [countdown, currentPhotoIndex, photoCount]);

  const capture = useCallback(() => setCountdown(3), []);

  const resetCapture = () => {
    setCurrentPhotoIndex(0);
    setCountdown(null);
    setCapturedPhotos([]);
  };

  const downloadResult = async () => {
    if (!previewRef.current) return;
    try {
      const dataUrl = await htmlToImage.toPng(previewRef.current, {
        pixelRatio: 12,
        cacheBust: true,
      });
      const link = document.createElement("a");
      link.download = "photo-booth.png";
      link.href = dataUrl;
      link.click();
    } catch (err) {
      console.error(err);
    }
  };

  // ── Render ───────────────────────────────────────────────────────────────────
  return (
    <div className="w-full h-screen flex flex-col items-center justify-center bg-black">
      <p className="text-[#C9A84C] font-mono text-xs tracking-widest">STEP {currentStep} of 4</p>

      <h1 className="mt-2 text-5xl text-white font-mono font-light">Take your photo</h1>

      {/* Progress dots */}
      <div className="flex items-center gap-3 mt-3">
        {Array.from({ length: photoCount }).map((_, i) => (
          <div key={i} className={`w-6 h-6 rounded-full flex items-center justify-center transition-all duration-300 ${i < capturedPhotos.length ? "bg-[#C9A84C]" : "border border-[#C9A84C]"}`}>
            <FaCheck className={`text-black text-[10px] transition-all duration-300 ${i < capturedPhotos.length ? "opacity-100 scale-100" : "opacity-0 scale-0"}`} />
          </div>
        ))}
        <p className="font-mono text-[#555250] text-sm">
          {capturedPhotos.length} / {photoCount}
        </p>
      </div>

      {/* Main row */}
      <div className="flex items-center justify-center gap-10 mt-5">
        {/* ── Camera feed ── */}
        <div className="relative w-96 aspect-square bg-[#0b1520] border border-[#333]">
          <div className="absolute top-3 left-3 right-3 flex items-center justify-between z-10">
            <span className="font-mono text-xs text-[#C9A84C]">
              LIVE — SLOT {currentPhotoIndex + 1} OF {photoCount}
            </span>
            <span className="font-mono text-xs text-[#C9A84C] border border-[#C9A84C] px-1.5 py-0.5">{selectedLayout?.name}</span>
          </div>

          <div className={`absolute inset-0 flex items-center justify-center z-10 transition-all duration-200 ${countdown != null && countdown > 0 ? "bg-black/50" : "bg-transparent"}`}>
            {countdown != null && countdown > 0 ? (
              <span className="font-serif text-[#C9A84C]" style={{ fontSize: 100, lineHeight: 1, fontWeight: 300 }}>
                {countdown}
              </span>
            ) : (
              <span className="font-mono text-xs text-[#c9a84c20] tracking-widest">CAMERA PREVIEW</span>
            )}
          </div>

          <Webcam ref={webcamRef} mirrored className="absolute inset-0 w-full h-full object-cover aspect-3/4 z-0" />
        </div>

        {/* ── Print preview ── */}
        <div className="flex flex-col items-center gap-2">
          <span className="font-mono text-[10px] tracking-widest text-[#555250] uppercase">Print Preview</span>

          <div
            ref={previewRef}
            style={{
              width: PREVIEW_W,
              height: cardH,
              boxSizing: "border-box",
              flexShrink: 0,
              overflow: "hidden",
              padding: FRAME_PAD,
              border: `${selectedFrame?.borderWidth}px solid ${selectedFrame?.borderColor}`,
              backgroundColor: selectedFrame?.backgroundColor ?? "#ffffff",
              display: "flex",
              flexDirection: "column",
            }}
          >
            {/* Top label (titleText) — only rendered if non-empty */}
            {hasTopText && (
              <div
                style={{
                  height: LABEL_H,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: selectedFrame?.fontSize ?? 12,
                  fontFamily: "monospace",
                  color: selectedFrame?.borderColor ?? "#555250",
                  letterSpacing: "0.06em",
                }}
              >
                {selectedFrame?.titleText}
              </div>
            )}
            <div
              style={{
                display: "grid",
                gridTemplateColumns: `repeat(${cols}, ${cellW}px)`,
                gridTemplateRows: `repeat(${rows}, ${cellH}px)`,
                gap: CELL_GAP,
                flexShrink: 0,
                margin: "0 auto",
              }}
            >
              {Array.from({ length: photoCount }).map((_, i) => (
                <div
                  key={i}
                  style={{
                    width: cellW,
                    height: cellH,
                    position: "relative",
                    overflow: "hidden",
                    flexShrink: 0,
                    border: !capturedPhotos[i] ? "1.5px dashed rgba(201,168,76,0.5)" : "none",
                  }}
                >
                  {/* Placeholder */}
                  <div
                    style={{
                      position: "absolute",
                      inset: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "#0b1520",
                      color: "#C9A84C",
                      fontSize: 10,
                      fontFamily: "monospace",
                      letterSpacing: "0.06em",
                      transition: "opacity 0.3s",
                      opacity: capturedPhotos[i] ? 0 : 1,
                    }}
                  >
                    {i === currentPhotoIndex ? "NEXT" : i + 1}
                  </div>
                  <img
                    src={capturedPhotos[i] ?? ""}
                    alt={`Captured ${i + 1}`}
                    style={{
                      position: "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      objectFit: "fill",
                      transition: "opacity 0.3s, transform 0.3s",
                      opacity: capturedPhotos[i] ? 1 : 0,
                      transform: capturedPhotos[i] ? "scale(1)" : "scale(0.95)",
                    }}
                  />
                </div>
              ))}
            </div>
            {hasBottomText && (
              <div
                style={{
                  height: LABEL_H,
                  flexShrink: 0,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  whiteSpace: "nowrap",
                  fontSize: selectedFrame?.fontSize ?? 12,
                  fontFamily: "monospace",
                  color: selectedFrame?.borderColor ?? "#555250",
                  letterSpacing: "0.06em",
                  marginTop: "auto",
                }}
              >
                {selectedFrame?.bottomText}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-3">
        <button
          disabled={countdown !== null || capturedPhotos.length >= photoCount}
          onClick={capture}
          className="bg-[#C9A84C] text-black font-mono text-sm px-5 py-3 rounded-sm disabled:opacity-40 disabled:cursor-not-allowed transition-opacity"
        >
          {countdown !== null ? "Get ready…" : `Capture Photo ${currentPhotoIndex + 1} of ${photoCount}`}
        </button>

        {capturedPhotos.length === photoCount && (
          <button onClick={downloadResult} className="bg-[#C9A84C] text-black font-mono text-sm px-5 py-3 rounded-sm">
            Download
          </button>
        )}
        <button onClick={resetCapture} className="mt-3 font-mono text-xs text-red-400 border border-red-900 px-4 py-2 rounded-sm hover:bg-red-950 transition-colors">
          Reset
        </button>
      </div>
    </div>
  );
}

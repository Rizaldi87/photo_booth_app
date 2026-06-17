type LayoutPreviewProps = {
  row: number;
  column: number;
};

export default function LayoutPreview({ row, column }: LayoutPreviewProps) {
  return (
    <div className="w-24 h-24 p-1 bg-[#262626] rounded">
      <div
        className="grid gap-1 w-full h-full"
        style={{
          gridTemplateColumns: `repeat(${column}, 1fr)`,
          gridTemplateRows: `repeat(${row}, 1fr)`,
        }}
      >
        {Array.from({ length: row * column }).map((_, i) => (
          <div key={i} className="border border-[#C9A84C]/50 bg-[#18140E]" />
        ))}
      </div>
    </div>
  );
}

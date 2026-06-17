export default function LoadingBar() {
  return (
    <div className="absolute inset-0 flex items-center justify-center mt-16">
      <div className="relative">
        <div className="w-14 h-14 rounded-full border-2 border-[#C9A84C]/20"></div>
        <div className="absolute inset-0 w-14 h-14 rounded-full border-2 border-transparent border-t-[#C9A84C] animate-spin"></div>
      </div>
    </div>
  );
}

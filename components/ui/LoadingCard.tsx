export default function LoadingCard() {
  return (
    <div
      className="
      animate-pulse
      rounded-3xl
      border
      border-white/10
      bg-[#17112F]
      p-8
      "
    >
      <div className="h-6 w-48 rounded bg-white/10" />

      <div className="mt-6 h-12 w-36 rounded bg-white/10" />

      <div className="mt-8 space-y-3">
        <div className="h-4 rounded bg-white/10" />
        <div className="h-4 w-5/6 rounded bg-white/10" />
        <div className="h-4 w-2/3 rounded bg-white/10" />
      </div>
    </div>
  );
}
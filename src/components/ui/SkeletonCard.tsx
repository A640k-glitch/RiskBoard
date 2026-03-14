export function SkeletonCard({ className }: { className?: string }) {
  return (
    <div className={`bg-gradient-to-br from-[var(--bg-surface)] to-[var(--bg-base)] border border-[var(--border)]/50 rounded-3xl p-14 animate-pulse min-h-[320px] flex flex-col justify-between ${className || ''}`}>
      <div className="h-3 bg-[var(--border)]/50 rounded-full w-1/3 mb-4"></div>
      <div className="mt-auto">
        <div className="h-8 bg-[var(--border)]/50 rounded-full w-1/2 mb-4"></div>
        <div className="h-3 bg-[var(--border)]/50 rounded-full w-1/4"></div>
      </div>
    </div>
  );
}

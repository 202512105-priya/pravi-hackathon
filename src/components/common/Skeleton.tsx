export function Skeleton({ className = '', style }: { className?: string, style?: React.CSSProperties }) {
  return (
    <div className={`animate-pulse bg-slate-200 rounded ${className}`} style={style} />
  );
}

export function CardSkeleton() {
  return (
    <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100">
      <Skeleton className="h-4 w-1/2 mb-4" />
      <Skeleton className="h-8 w-1/3 mb-2" />
      <Skeleton className="h-3 w-2/3" />
    </div>
  );
}

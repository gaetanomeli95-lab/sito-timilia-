export function MenuSkeleton() {
  return (
    <div className="relative min-h-screen bg-[#0c0a08] flex flex-col overflow-hidden animate-pulse">
      {/* Header skeleton */}
      <div className="relative z-20 flex items-center justify-between px-5 lg:px-10 pt-5 pb-3">
        <div className="h-3 w-24 bg-white/5 rounded" />
        <div className="h-3 w-12 bg-white/5 rounded" />
        <div className="h-3 w-16 bg-white/5 rounded" />
      </div>

      {/* Banner skeleton */}
      <div className="relative z-10 mx-4 lg:mx-8 h-[130px] sm:h-[170px] lg:h-[215px] rounded-[1.6rem] bg-white/[0.03] border border-white/[0.06]" />

      {/* Mobile tabs skeleton */}
      <div className="lg:hidden sticky top-0 px-5 py-3 z-20 bg-[#0c0a08]/90">
        <div className="flex gap-1.5">
          {[...Array(6)].map((_, i) => (
            <div key={i} className="h-7 w-20 bg-white/5 rounded-full" />
          ))}
        </div>
      </div>

      {/* Product cards skeleton */}
      <div className="flex-1 px-4 sm:px-6 lg:px-8 py-5">
        <div className="flex items-center gap-4 mb-5">
          <div className="h-5 w-32 bg-white/5 rounded" />
          <div className="h-[1px] flex-1 bg-white/5" />
        </div>
        <div className="flex flex-col gap-4 lg:gap-5">
          {[...Array(4)].map((_, i) => (
            <div
              key={i}
              className="flex gap-4 p-4 rounded-xl bg-white/[0.02] border border-white/[0.04]"
            >
              <div className="w-20 h-20 sm:w-28 sm:h-28 rounded-lg bg-white/[0.04] shrink-0" />
              <div className="flex-1 space-y-2.5">
                <div className="h-4 w-3/4 bg-white/5 rounded" />
                <div className="h-3 w-full bg-white/[0.03] rounded" />
                <div className="h-3 w-2/3 bg-white/[0.03] rounded" />
                <div className="flex gap-2 mt-3">
                  <div className="h-5 w-24 bg-white/[0.04] rounded-full" />
                  <div className="h-5 w-28 bg-white/[0.04] rounded-full" />
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export function ReviewsSkeleton() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16 animate-pulse">
      {[...Array(3)].map((_, i) => (
        <div
          key={i}
          className="rounded-2xl bg-white/[0.02] border border-white/[0.05] p-6 space-y-4"
        >
          <div className="flex items-center justify-between">
            <div className="w-10 h-10 rounded-full bg-white/5" />
            <div className="flex gap-0.5">
              {[...Array(5)].map((_, j) => (
                <div key={j} className="w-3 h-3 bg-white/5 rounded" />
              ))}
            </div>
          </div>
          <div className="space-y-2">
            <div className="h-3 w-full bg-white/[0.04] rounded" />
            <div className="h-3 w-full bg-white/[0.04] rounded" />
            <div className="h-3 w-4/5 bg-white/[0.04] rounded" />
          </div>
          <div className="flex items-center gap-3 pt-4 border-t border-white/5">
            <div className="w-9 h-9 rounded-full bg-white/5" />
            <div className="space-y-1.5">
              <div className="h-3 w-20 bg-white/5 rounded" />
              <div className="h-2 w-16 bg-white/[0.03] rounded" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

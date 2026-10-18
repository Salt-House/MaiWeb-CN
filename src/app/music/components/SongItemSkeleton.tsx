import { Skeleton } from "@/components/ui/Skeleton"

/** MAGiCAL 主题骨架屏：紫罗兰渐变胶囊 + 魔法阵圆盘占位 */
export default function SongItemSkeleton() {
  return (
    <div
      className="relative mr-10 flex items-center w-fit min-w-[450px] max-lg:min-w-[400px] max-w-[480px] max-lg:max-w-[420px] max-h-[160px] max-lg:max-h-[140px] rounded-full mb-10 max-sm:mb-4 pr-4 max-sm:w-full max-sm:min-w-0 max-sm:max-w-full max-sm:mr-0 max-sm:pr-2 border-2 border-mai-yellow"
      style={{
        background: "#6F34B0",
        boxShadow: "0 10px 24px rgba(1, 45, 123, 0.3)",
      }}
    >
      {/* 魔法阵圆盘占位 */}
      <div
        className="flex-shrink-0 size-40 max-lg:size-36 max-sm:size-32 m-1 rounded-full border-4 border-mai-yellow relative overflow-hidden"
        style={{
          background: "#6F34B0",
          boxShadow: "8px 8px 18px rgba(59, 7, 100, 0.45), -6px -6px 16px rgba(233, 213, 255, 0.55), 0 0 12px rgba(251, 191, 36, 0.35)",
        }}
      >
        <div className="absolute inset-3 rounded-full border-2 border-dashed border-mai-yellow/60" />
      </div>

      {/* 内容占位 */}
      <div className="flex-1 ml-4 flex flex-col gap-3 py-2 pr-4">
        <Skeleton className="h-8 w-3/4 rounded-full bg-white/25" />
        <Skeleton className="h-5 w-1/2 rounded-full bg-white/20" />
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-8 w-16 rounded-full bg-white/25" />
          <Skeleton className="h-8 w-16 rounded-full bg-white/20" />
          <Skeleton className="h-8 w-12 rounded-full bg-white/15" />
        </div>
      </div>
    </div>
  )
}

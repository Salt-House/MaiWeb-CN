import { Skeleton } from "@/app/components/Skeleton"

interface CollectionItemSkeletonProps {
  type?: "icon" | "frame" | "plate" | "trophy"
}

export default function CollectionItemSkeleton({ type = "icon" }: CollectionItemSkeletonProps) {
  if (type === "trophy") {
    return (
      <div className="w-full max-w-[320px] mx-auto" style={{ aspectRatio: "272/29" }}>
         <Skeleton className="w-full h-full rounded-full" />
      </div>
    )
  }

  let aspectRatio = "aspect-square"
  if (type === "frame") aspectRatio = "aspect-[16/9]"
  if (type === "plate") aspectRatio = "aspect-[3/1]"

  return (
    <div className="relative bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden h-full flex flex-col">
      <div className={`${aspectRatio} p-4`}>
        <div className="w-full h-full bg-gray-50 rounded-xl p-2">
            <Skeleton className="w-full h-full rounded-lg" />
        </div>
      </div>
      <div className="px-4 pb-4 pt-0 flex-1 flex flex-col">
         <Skeleton className="h-4 w-3/4 mb-2 bg-gray-200 rounded" />
         <Skeleton className="h-3 w-full mb-1 bg-gray-200 rounded" />
         <Skeleton className="h-3 w-2/3 bg-gray-200 rounded" />
         <div className="mt-auto pt-3">
             <Skeleton className="h-5 w-12 rounded-full bg-gray-200" />
         </div>
      </div>
    </div>
  )
}

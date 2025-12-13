import { Skeleton } from "@/app/components/Skeleton"

interface CollectionItemSkeletonProps {
  type?: "icon" | "frame" | "plate" | "trophy"
}

export default function CollectionItemSkeleton({ type = "icon" }: CollectionItemSkeletonProps) {
  if (type === "trophy") {
    return (
      <div className="w-full max-w-[300px] mx-auto" style={{ aspectRatio: "272/29" }}>
         <Skeleton className="w-full h-full rounded-md" />
      </div>
    )
  }

  let aspectRatio = "aspect-square"
  if (type === "frame") aspectRatio = "aspect-[16/9]"
  if (type === "plate") aspectRatio = "aspect-[3/1]"

  return (
    <div className="relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <div className={`${aspectRatio} p-4 flex items-center justify-center bg-gray-50`}>
         <Skeleton className="w-full h-full rounded-md" />
      </div>
      <div className="p-4 bg-white">
         <Skeleton className="h-4 w-3/4 mb-2 bg-gray-200" />
         <Skeleton className="h-3 w-full mb-1 bg-gray-200" />
         <Skeleton className="h-3 w-2/3 bg-gray-200" />
         <div className="mt-3">
             <Skeleton className="h-4 w-10 rounded-full bg-gray-200" />
         </div>
      </div>
    </div>
  )
}

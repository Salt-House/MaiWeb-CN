import { Skeleton } from "@/components/ui/Skeleton"

export default function SongItemSkeleton() {
  return (
    <div className="relative mr-10 flex items-center w-fit min-w-[450px] max-lg:min-w-[400px] max-w-[480px] max-lg:max-w-[420px] max-h-[160px] max-lg:max-h-[140px] bg-white rounded-full mb-10 max-sm:mb-4 pr-4 max-sm:w-full max-sm:min-w-0 max-sm:max-w-full max-sm:mr-0 max-sm:pr-2 shadow-md">
      {/* Avatar */}
      <Skeleton className="flex-shrink-0 size-40 max-lg:size-36 max-sm:size-32 rounded-full" />

      {/* Content */}
      <div className="flex-1 ml-4 flex flex-col gap-3 py-2 pr-4">
        {/* Title */}
        <Skeleton className="h-8 w-3/4 rounded-lg bg-gray-200" />
        
        {/* Artist */}
        <Skeleton className="h-5 w-1/2 rounded-md bg-gray-200" />
        
        {/* Badges/Info */}
        <div className="flex gap-2 mt-2">
          <Skeleton className="h-8 w-16 rounded-full bg-gray-200" />
          <Skeleton className="h-8 w-16 rounded-full bg-gray-200" />
          <Skeleton className="h-8 w-12 rounded-full bg-gray-200" />
        </div>
      </div>
    </div>
  )
}

import { Skeleton } from "@/components/ui/skeleton"

export default function PropertyLoading() {
  return (
    <div className="container mx-auto px-4 py-8">
      <Skeleton className="h-10 w-2/3 mb-6" />
      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-2/3">
          <Skeleton className="h-[400px] w-full rounded-lg mb-8" />
          <div className="mt-8">
            <Skeleton className="h-8 w-48 mb-4" />
            <Skeleton className="h-4 w-full mb-2" />
            <Skeleton className="h-4 w-5/6" />
          </div>
          <div className="mt-8">
            <Skeleton className="h-8 w-32 mb-4" />
            <div className="grid grid-cols-2 gap-4">
              {[...Array(3)].map((_, i) => (
                <Skeleton key={i} className="h-12 w-full" />
              ))}
            </div>
          </div>
        </div>
        <div className="lg:w-1/3">
          <Skeleton className="h-[500px] w-full rounded-lg" />
        </div>
      </div>
    </div>
  )
}

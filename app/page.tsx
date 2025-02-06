import { Suspense } from "react"
import { SearchForm } from "@/components/search-form"
import { PropertiesList } from "@/components/properties-list"
import { Skeleton } from "@/components/ui/skeleton"

interface SearchParams {
  search?: string
}

function PropertyCardSkeleton() {
  return (
    <div className="space-y-3">
      <Skeleton className="h-48 w-full rounded-lg" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-3 w-full" />
      <Skeleton className="h-3 w-1/2" />
      <Skeleton className="h-8 w-full" />
    </div>
  )
}

function PropertiesLoading() {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {[...Array(8)].map((_, i) => (
        <PropertyCardSkeleton key={i} />
      ))}
    </div>
  )
}

export const revalidate = 0

export default function Home({ searchParams }: { searchParams: SearchParams }) {
  return (
    <div className="container mx-auto py-8">
      <section className="mb-12">
        <h1 className="text-4xl font-bold mb-4">Find your next stay</h1>
        <p className="text-xl mb-6">Search low prices on homes, apartments and much more...</p>
        <SearchForm />
      </section>

      <section>
        <h2 className="text-2xl font-semibold mb-6">
          {searchParams.search ? "Search Results" : "Featured Properties"}
        </h2>
        <Suspense fallback={<PropertiesLoading />}>
          <PropertiesList search={searchParams.search} />
        </Suspense>
      </section>
    </div>
  )
}

"use client"

import { Input } from "@/components/ui/input"
import { useState, useTransition } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect } from "react"
import { debounce } from "@/lib/utils/debounce"

export function SearchForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isPending, startTransition] = useTransition()
  const [search, setSearch] = useState(searchParams.get("search") || "")

  useEffect(() => {
    const debouncedSearch = debounce((term: string) => {
      const params = new URLSearchParams()
      if (term) params.set("search", term)
      startTransition(() => {
        router.push(`/?${params.toString()}`, { scroll: false })
      })
    }, 300)

    debouncedSearch(search)
  }, [search, router])

  return (
    <div className="flex flex-col sm:flex-row gap-4">
      <Input
        type="text"
        placeholder="Where are you going?"
        className="flex-grow"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
    </div>
  )
}

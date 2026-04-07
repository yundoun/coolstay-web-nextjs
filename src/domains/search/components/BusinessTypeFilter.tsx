"use client"

import { useRouter, useSearchParams } from "next/navigation"
import { cn } from "@/lib/utils"
import { BUSINESS_TYPES } from "../utils/searchParams"

export function BusinessTypeFilter() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const currentType = searchParams?.get("type") ?? ""

  const handleSelect = (code: string) => {
    const params = new URLSearchParams(searchParams?.toString() ?? "")
    if (code) {
      params.set("type", code)
    } else {
      params.delete("type")
    }
    router.push(`/search?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-1 -mx-1 px-1">
      {BUSINESS_TYPES.map(({ code, label }) => {
        const isActive = currentType === code
        return (
          <button
            key={code || "ALL"}
            onClick={() => handleSelect(code)}
            className={cn(
              "shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors",
              isActive
                ? "bg-primary text-primary-foreground shadow-sm"
                : "bg-muted/60 border border-border/50 text-muted-foreground hover:border-primary/40 hover:text-foreground"
            )}
          >
            {label}
          </button>
        )
      })}
    </div>
  )
}

"use client"

import { useState } from "react"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { categoryFilters } from "../data/mock"

interface CategoryFiltersProps {
  onSortChange?: (sort: string) => void
}

export function CategoryFilters({ onSortChange }: CategoryFiltersProps) {
  const [selected, setSelected] = useState("rating")

  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide">
      {categoryFilters.map((filter) => (
        <Link
          key={filter.code}
          href={`/search?sort=${filter.code}`}
          onClick={() => setSelected(filter.code)}
          className={cn(
            "px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap",
            "border transition-all duration-200",
            selected === filter.code
              ? "bg-foreground text-background border-foreground"
              : "bg-background text-muted-foreground border-border hover:border-foreground/30"
          )}
        >
          {filter.label}
        </Link>
      ))}
    </div>
  )
}

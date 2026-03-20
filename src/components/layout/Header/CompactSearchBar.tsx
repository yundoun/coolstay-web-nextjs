"use client"

import { Search } from "lucide-react"
import { useSearchModal } from "@/lib/stores/search-modal"
import { cn } from "@/lib/utils"

export function CompactSearchBar() {
  const { open } = useSearchModal()

  return (
    <button
      onClick={open}
      className={cn(
        "w-full flex items-center gap-2 px-4 py-2",
        "bg-muted/60 hover:bg-muted rounded-full",
        "border border-border/50 hover:border-border",
        "shadow-sm hover:shadow-md",
        "transition-all duration-300",
        "cursor-text group"
      )}
    >
      <Search className="size-4 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground group-hover:text-foreground/60 transition-colors">
        지역, 숙소명 검색
      </span>
    </button>
  )
}

"use client"

import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function CompactSearchBar() {
  return (
    <button
      data-slot="compact-search-bar"
      className={cn(
        "w-full flex items-center gap-2 px-2 py-2",
        "bg-muted hover:bg-muted/80 rounded-full",
        "border border-border shadow-sm",
        "transition-all hover:shadow-md"
      )}
    >
      {/* 어디로 */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1 text-sm">
        <MapPin className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-foreground font-medium">어디로</span>
      </div>

      <span className="text-border/60">|</span>

      {/* 날짜 */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1 text-sm">
        <CalendarDays className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">날짜</span>
      </div>

      <span className="text-border/60">|</span>

      {/* 인원 */}
      <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1 text-sm">
        <Users className="size-3.5 text-muted-foreground shrink-0" />
        <span className="text-muted-foreground">인원</span>
      </div>

      {/* 검색 버튼 */}
      <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground">
        <Search className="size-4" />
      </div>
    </button>
  )
}

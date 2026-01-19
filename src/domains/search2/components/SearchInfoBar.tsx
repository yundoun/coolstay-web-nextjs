"use client"

import { SlidersHorizontal, LayoutGrid, List, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { cn } from "@/lib/utils"
import { sortOptions } from "../data/mock"

interface SearchInfoBarProps {
  totalCount: number
  regionLabel?: string
  sort: string
  onSortChange: (sort: string) => void
  onFilterClick?: () => void
  activeFilterCount?: number
}

export function SearchInfoBar({
  totalCount,
  regionLabel,
  sort,
  onSortChange,
  onFilterClick,
  activeFilterCount = 0,
}: SearchInfoBarProps) {
  const currentSort = sortOptions.find((s) => s.value === sort)

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        "py-4 border-b border-border/50"
      )}
    >
      {/* Left: Search Info */}
      <div className="flex items-center gap-2">
        <h2 className="text-sm md:text-base font-medium text-foreground">
          {regionLabel && (
            <span className="text-primary font-semibold">{regionLabel}</span>
          )}
          {regionLabel ? " 검색 결과 " : "검색 결과 "}
          <span className="text-muted-foreground">
            {totalCount.toLocaleString()}개
          </span>
        </h2>
      </div>

      {/* Right: Actions */}
      <div className="flex items-center gap-2">
        {/* Sort Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="outline"
              size="sm"
              className={cn(
                "gap-1.5 rounded-full",
                "border-border/50 hover:border-border",
                "transition-all duration-200"
              )}
            >
              <span className="hidden sm:inline">{currentSort?.label}</span>
              <span className="sm:hidden">정렬</span>
              <ChevronDown className="size-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-40">
            {sortOptions.map((option) => (
              <DropdownMenuItem
                key={option.value}
                onClick={() => onSortChange(option.value)}
                className={cn(
                  "cursor-pointer",
                  sort === option.value && "bg-primary/10 text-primary"
                )}
              >
                {option.label}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>

        {/* Filter Button - Mobile */}
        {onFilterClick && (
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5 rounded-full md:hidden",
              "border-border/50 hover:border-border",
              "transition-all duration-200",
              activeFilterCount > 0 && "border-primary text-primary"
            )}
            onClick={onFilterClick}
          >
            <SlidersHorizontal className="size-4" />
            <span>필터</span>
            {activeFilterCount > 0 && (
              <span className="flex items-center justify-center size-5 rounded-full bg-primary text-primary-foreground text-xs font-medium">
                {activeFilterCount}
              </span>
            )}
          </Button>
        )}
      </div>
    </div>
  )
}

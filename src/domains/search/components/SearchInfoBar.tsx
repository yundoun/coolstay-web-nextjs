"use client"

import { ChevronDown } from "lucide-react"
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
  keyword?: string
  sort: string
  onSortChange: (sort: string) => void
}

export function SearchInfoBar({
  totalCount,
  regionLabel,
  keyword,
  sort,
  onSortChange,
}: SearchInfoBarProps) {
  const currentSort = sortOptions.find((s) => s.value === sort)

  return (
    <div
      className={cn(
        "flex items-center justify-between gap-4",
        "py-4 border-b border-border/50"
      )}
    >
      <div className="flex items-center gap-2">
        <h2 className="text-sm md:text-base font-medium text-foreground">
          {keyword && (
            <span className="text-primary font-semibold">&apos;{keyword}&apos;</span>
          )}
          {!keyword && regionLabel && (
            <span className="text-primary font-semibold">{regionLabel}</span>
          )}
          {(keyword || regionLabel) ? " 검색 결과 " : "검색 결과 "}
          <span className="text-muted-foreground">
            {totalCount.toLocaleString()}개
          </span>
        </h2>
      </div>

      <div className="flex items-center gap-2">
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
      </div>
    </div>
  )
}

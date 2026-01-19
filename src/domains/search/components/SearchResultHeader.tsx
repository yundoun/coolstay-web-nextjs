"use client"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { sortOptions } from "../data/filterOptions"

interface SearchResultHeaderProps {
  totalCount: number
  sort: string
  onSortChange: (sort: string) => void
}

export function SearchResultHeader({
  totalCount,
  sort,
  onSortChange,
}: SearchResultHeaderProps) {
  return (
    <div className="flex items-center justify-between mb-4">
      <p className="text-sm text-muted-foreground">
        총 <span className="font-semibold text-foreground">{totalCount.toLocaleString()}</span>개의 숙소
      </p>
      <Select value={sort} onValueChange={onSortChange}>
        <SelectTrigger className="w-[140px]">
          <SelectValue />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  )
}

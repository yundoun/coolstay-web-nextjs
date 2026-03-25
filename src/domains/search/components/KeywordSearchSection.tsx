"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Search, Hash, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { HASHTAG_KEYWORDS } from "../data/autocomplete"

interface KeywordSearchSectionProps {
  onKeywordSelect?: (keyword: string) => void
}

export function KeywordSearchSection({ onKeywordSelect }: KeywordSearchSectionProps) {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [activeKeywords, setActiveKeywords] = useState<Set<string>>(new Set())

  const handleSearch = () => {
    if (!query.trim()) return
    onKeywordSelect?.(query.trim())
    router.push(`/search?keyword=${encodeURIComponent(query.trim())}`)
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") handleSearch()
  }

  const handleHashtagClick = (keyword: string) => {
    setActiveKeywords((prev) => {
      const next = new Set(prev)
      if (next.has(keyword)) {
        next.delete(keyword)
      } else {
        next.add(keyword)
      }
      return next
    })
    onKeywordSelect?.(keyword)
  }

  return (
    <div className="space-y-4">
      {/* Keyword Search Input */}
      <div className="flex gap-2">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-muted-foreground" />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="키워드로 검색 (예: 수영장, 오션뷰)"
            className="w-full pl-10 pr-9 py-2.5 rounded-lg border bg-background text-sm outline-none placeholder:text-muted-foreground focus:border-primary focus:ring-2 focus:ring-primary/10 transition-all"
          />
          {query && (
            <button
              onClick={() => setQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            >
              <X className="size-4" />
            </button>
          )}
        </div>
        <Button onClick={handleSearch} disabled={!query.trim()}>
          검색
        </Button>
      </div>

      {/* Hashtag Keywords */}
      <div>
        <div className="flex items-center gap-1.5 mb-2">
          <Hash className="size-4 text-primary" />
          <span className="text-sm font-medium">인기 키워드</span>
        </div>
        <div className="flex flex-wrap gap-2">
          {HASHTAG_KEYWORDS.map((keyword) => {
            const isActive = activeKeywords.has(keyword)
            return (
              <button
                key={keyword}
                onClick={() => handleHashtagClick(keyword)}
                className={cn(
                  "inline-flex items-center px-3 py-1.5 rounded-full text-sm transition-colors",
                  isActive
                    ? "bg-primary text-primary-foreground"
                    : "bg-muted/60 border border-border/50 text-foreground hover:border-primary/50 hover:bg-primary/5"
                )}
              >
                <span className="text-xs mr-0.5">#</span>
                {keyword}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

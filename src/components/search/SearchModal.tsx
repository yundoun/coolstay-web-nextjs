"use client"

import { useState, useEffect, useCallback, useRef } from "react"
import { useRouter } from "next/navigation"
import {
  X,
  Search,
  CalendarDays,
  Users,
  Clock,
  Minus,
  Plus,
  ArrowLeft,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { useSearchModal } from "@/lib/stores/search-modal"

// 인기 검색어 (실제로는 API에서 가져옴)
const popularKeywords = [
  { rank: 1, keyword: "대구" },
  { rank: 2, keyword: "서면" },
  { rank: 3, keyword: "경주" },
  { rank: 4, keyword: "대전" },
  { rank: 5, keyword: "부산" },
  { rank: 6, keyword: "동성로" },
  { rank: 7, keyword: "울산" },
  { rank: 8, keyword: "서울" },
]

function getDefaultDates() {
  const today = new Date()
  const tomorrow = new Date(today)
  tomorrow.setDate(tomorrow.getDate() + 1)
  const days = ["일", "월", "화", "수", "목", "금", "토"]
  const fmt = (d: Date) =>
    `${d.getMonth() + 1}.${String(d.getDate()).padStart(2, "0")}(${days[d.getDay()]})`
  const fmtValue = (d: Date) =>
    `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`
  return {
    displayCheckIn: fmt(today),
    displayCheckOut: fmt(tomorrow),
    valueCheckIn: fmtValue(today),
    valueCheckOut: fmtValue(tomorrow),
  }
}

export function SearchModal() {
  const { isOpen, close } = useSearchModal()
  const router = useRouter()
  const inputRef = useRef<HTMLInputElement>(null)

  const [query, setQuery] = useState("")
  const [adults, setAdults] = useState(2)
  const [kids, setKids] = useState(0)
  const [recentSearches, setRecentSearches] = useState<string[]>([
    "해운대 호텔",
    "제주 펜션",
  ])

  const defaults = getDefaultDates()

  // ESC 닫기 + body overflow
  useEffect(() => {
    const handleEsc = (e: KeyboardEvent) => {
      if (e.key === "Escape") close()
    }
    if (isOpen) {
      document.addEventListener("keydown", handleEsc)
      document.body.style.overflow = "hidden"
      // 모달 열리면 input 포커스
      setTimeout(() => inputRef.current?.focus(), 100)
    }
    return () => {
      document.removeEventListener("keydown", handleEsc)
      document.body.style.overflow = ""
    }
  }, [isOpen, close])

  // 모달 열릴 때 리셋
  useEffect(() => {
    if (isOpen) setQuery("")
  }, [isOpen])

  const handleSearch = useCallback(
    (keyword?: string) => {
      const searchTerm = keyword || query
      if (searchTerm.trim()) {
        // 최근 검색어에 추가
        setRecentSearches((prev) => {
          const filtered = prev.filter((k) => k !== searchTerm)
          return [searchTerm, ...filtered].slice(0, 10)
        })
      }
      close()
      const params = new URLSearchParams()
      if (searchTerm.trim()) params.set("keyword", searchTerm.trim())
      router.push(`/search?${params.toString()}`)
    },
    [query, close, router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter") handleSearch()
    },
    [handleSearch]
  )

  const handleClearRecent = useCallback(() => {
    setRecentSearches([])
  }, [])

  const handleRemoveRecent = useCallback((keyword: string) => {
    setRecentSearches((prev) => prev.filter((k) => k !== keyword))
  }, [])

  const guestLabel = kids > 0 ? `${adults + kids}명` : `${adults}명`

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-[var(--z-modal)] flex items-start justify-center">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-background/80 backdrop-blur-sm animate-fade-in"
        onClick={close}
      />

      {/* Modal */}
      <div
        className={cn(
          "relative w-full max-w-lg mx-4 mt-12 md:mt-20",
          "bg-card rounded-xl border shadow-xl",
          "animate-fade-in-up",
          "max-h-[85vh] overflow-hidden flex flex-col"
        )}
      >
        {/* Header — 모바일 앱과 동일 구조 */}
        <div className="flex items-center gap-3 p-4 border-b shrink-0">
          <Button variant="ghost" size="icon" onClick={close} className="size-8 rounded-full shrink-0">
            <ArrowLeft className="size-4" />
          </Button>
          <h2 className="font-semibold">검색</h2>
        </div>

        {/* 검색 입력 필드 */}
        <div className="px-4 pt-4 shrink-0">
          <div className="flex items-center gap-2 px-4 py-3 border rounded-xl bg-background focus-within:ring-2 focus-within:ring-primary/20 focus-within:border-primary transition-all">
            <Search className="size-4 text-muted-foreground shrink-0" />
            <input
              ref={inputRef}
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              placeholder="지역, 전철역, 숙소명으로 찾아보세요"
              className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground"
            />
            {query && (
              <Button
                variant="ghost"
                size="icon"
                className="size-6 rounded-full shrink-0"
                onClick={() => setQuery("")}
              >
                <X className="size-3" />
              </Button>
            )}
          </div>
        </div>

        {/* 날짜/인원 조건 바 */}
        <div className="flex items-center gap-2 px-4 py-3 shrink-0">
          <div className="flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs text-muted-foreground">
            <CalendarDays className="size-3" />
            <span>{defaults.displayCheckIn} - {defaults.displayCheckOut} · 1박</span>
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <button className="flex items-center gap-1.5 px-3 py-1.5 border rounded-full text-xs text-muted-foreground hover:border-primary transition-colors">
                <Users className="size-3" />
                <span>{guestLabel}</span>
              </button>
            </PopoverTrigger>
            <PopoverContent className="w-56 p-4" align="start">
              <div className="space-y-4">
                <GuestCounter label="성인" count={adults} min={1} max={10} onChange={setAdults} />
                <GuestCounter label="아동" count={kids} min={0} max={5} onChange={setKids} />
              </div>
            </PopoverContent>
          </Popover>
        </div>

        {/* 스크롤 가능 컨텐츠 영역 */}
        <div className="flex-1 overflow-y-auto border-t">
          {/* 최근 검색 */}
          <div className="px-4 py-4">
            <div className="flex items-center justify-between mb-3">
              <h3 className="text-sm font-semibold">최근 검색</h3>
              {recentSearches.length > 0 && (
                <button
                  onClick={handleClearRecent}
                  className="text-xs text-primary hover:underline"
                >
                  전체 삭제
                </button>
              )}
            </div>

            {recentSearches.length === 0 ? (
              <p className="text-sm text-muted-foreground text-center py-6">
                최근 검색한 조건이 없습니다.
              </p>
            ) : (
              <div className="space-y-1">
                {recentSearches.map((keyword) => (
                  <div
                    key={keyword}
                    className="flex items-center justify-between group"
                  >
                    <button
                      onClick={() => handleSearch(keyword)}
                      className="flex items-center gap-2.5 py-2 text-sm hover:text-primary transition-colors"
                    >
                      <Clock className="size-3.5 text-muted-foreground" />
                      {keyword}
                    </button>
                    <button
                      onClick={() => handleRemoveRecent(keyword)}
                      className="p-1 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <X className="size-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* 인기 검색어 순위 */}
          <div className="px-4 py-4 border-t">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-sm font-semibold">인기 검색어 순위</h3>
              <span className="text-xs text-muted-foreground">
                {new Date().toLocaleDateString("ko-KR")} 기준
              </span>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-8">
              {popularKeywords.map((item) => (
                <button
                  key={item.rank}
                  onClick={() => handleSearch(item.keyword)}
                  className="flex items-center gap-3 py-2.5 text-sm hover:text-primary transition-colors text-left border-b border-border/30 last:border-0"
                >
                  <span
                    className={cn(
                      "w-5 text-center text-xs font-bold",
                      item.rank <= 3 ? "text-primary" : "text-muted-foreground"
                    )}
                  >
                    {item.rank}
                  </span>
                  <span className="font-medium">{item.keyword}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function GuestCounter({
  label,
  count,
  min,
  max,
  onChange,
}: {
  label: string
  count: number
  min: number
  max: number
  onChange: (n: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={count <= min}
          onClick={() => onChange(count - 1)}
        >
          <Minus className="size-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={count >= max}
          onClick={() => onChange(count + 1)}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}

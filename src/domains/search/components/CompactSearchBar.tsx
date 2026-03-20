"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Search, X, MapPin, TrainFront, Clock } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import {
  POPULAR_KEYWORDS,
  suggestKeywords,
  suggestRegions,
  suggestAccommodations,
} from "../data/autocomplete"

const ICON_MAP = { pin: MapPin, train: TrainFront } as const

const sectionHeaderCn = "px-4 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"

/** 헤더용 인기검색어 (상위 6개, 랭킹 포함) */
const HEADER_POPULAR = POPULAR_KEYWORDS.slice(0, 6).map((keyword, i) => ({
  rank: i + 1,
  keyword,
}))

/* ── 매칭 텍스트 하이라이트 ── */

function HighlightMatch({ text, query }: { text: string; query: string }) {
  if (!query) return <>{text}</>
  const idx = text.indexOf(query)
  if (idx === -1) return <>{text}</>
  return (
    <>
      {text.slice(0, idx)}
      <span className="text-primary font-semibold">{query}</span>
      {text.slice(idx + query.length)}
    </>
  )
}

/* ── 컴포넌트 ── */

export function CompactSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [recentSearches, setRecentSearches] = useState<string[]>(() => {
    if (typeof window === "undefined") return []
    try {
      return JSON.parse(localStorage.getItem("recentSearches") || "[]")
    } catch {
      return []
    }
  })
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const trimmed = query.trim()
  const keywords = suggestKeywords(trimmed)
  const regions = suggestRegions(trimmed)
  const accommodations = suggestAccommodations(trimmed)
  const showKeywords = trimmed.length > 0 && keywords.length > 0
  const showRegions = trimmed.length > 0 && regions.length > 0
  const showAccommodations = trimmed.length > 0 && accommodations.length > 0
  const showDropdown = isFocused && (showKeywords || showRegions || showAccommodations || trimmed.length === 0)

  // 드롭다운 위치 계산
  useEffect(() => {
    if (!showDropdown || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 420),
    })
  }, [showDropdown])

  // 외부 클릭
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (
        wrapperRef.current &&
        !wrapperRef.current.contains(target) &&
        !(target as HTMLElement).closest?.("[data-search-dropdown]")
      ) {
        setIsFocused(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => document.removeEventListener("mousedown", handleClickOutside)
  }, [])

  const addRecentSearch = useCallback((keyword: string) => {
    setRecentSearches((prev) => {
      const updated = [keyword, ...prev.filter((k) => k !== keyword)].slice(0, 10)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
      return updated
    })
  }, [])

  const removeRecentSearch = useCallback((keyword: string) => {
    setRecentSearches((prev) => {
      const updated = prev.filter((k) => k !== keyword)
      localStorage.setItem("recentSearches", JSON.stringify(updated))
      return updated
    })
  }, [])

  const clearRecentSearches = useCallback(() => {
    setRecentSearches([])
    localStorage.removeItem("recentSearches")
  }, [])

  const handleSelect = useCallback(
    (keyword: string) => {
      addRecentSearch(keyword)
      setQuery("")
      setIsFocused(false)
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`)
    },
    [router, addRecentSearch]
  )

  const handleAccommodationClick = useCallback(
    (id: string) => {
      setQuery("")
      setIsFocused(false)
      router.push(`/accommodations/${id}`)
    },
    [router]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      if (e.key === "Enter" && query.trim()) handleSelect(query.trim())
      if (e.key === "Escape") {
        setIsFocused(false)
        inputRef.current?.blur()
      }
    },
    [query, handleSelect]
  )

  return (
    <>
      <div ref={wrapperRef} className="relative w-full">
        <div
          className={cn(
            "flex items-center gap-2 px-4 py-2",
            "rounded-full border bg-muted/60",
            "transition-all duration-200",
            isFocused
              ? "border-primary/50 bg-background shadow-md ring-2 ring-primary/10"
              : "border-border/50 hover:border-border hover:bg-muted shadow-sm"
          )}
        >
          <Search className="size-4 text-muted-foreground shrink-0" />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            onKeyDown={handleKeyDown}
            placeholder="지역, 숙소명 검색"
            className="flex-1 bg-transparent text-sm outline-none placeholder:text-muted-foreground min-w-0"
          />
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="size-5 rounded-full shrink-0"
              onClick={() => {
                setQuery("")
                inputRef.current?.focus()
              }}
            >
              <X className="size-3" />
            </Button>
          )}
        </div>
      </div>

      {/* 드롭다운 — Portal로 body에 렌더링 */}
      {mounted &&
        showDropdown &&
        createPortal(
          <div
            data-search-dropdown
            className="fixed z-[60] animate-fade-in-down"
            style={{
              top: dropdownPos.top,
              left: dropdownPos.left,
              width: dropdownPos.width,
            }}
          >
            <div className="bg-card border rounded-xl shadow-xl overflow-hidden max-h-[70vh] overflow-y-auto">
              {/* 빈 입력 상태: 최근검색 + 인기검색어 */}
              {trimmed.length === 0 && (
                <>
                  {/* 최근 검색 */}
                  {recentSearches.length > 0 && (
                    <div className="py-1.5">
                      <div className="flex items-center justify-between px-4 py-1.5">
                        <p className="text-[11px] font-medium text-muted-foreground uppercase tracking-wider">최근검색</p>
                        <button
                          onClick={clearRecentSearches}
                          className="text-[11px] text-primary hover:underline"
                        >
                          전체 삭제
                        </button>
                      </div>
                      {recentSearches.map((keyword) => (
                        <div key={keyword} className="flex items-center group">
                          <button
                            onClick={() => handleSelect(keyword)}
                            className="flex-1 flex items-center gap-3 px-4 py-2 text-sm hover:bg-muted transition-colors text-left"
                          >
                            <Clock className="size-3.5 text-muted-foreground shrink-0" />
                            <span>{keyword}</span>
                          </button>
                          <button
                            onClick={() => removeRecentSearch(keyword)}
                            className="px-3 py-2 text-muted-foreground hover:text-foreground opacity-0 group-hover:opacity-100 transition-opacity"
                          >
                            <X className="size-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* 인기검색어 */}
                  <div className={cn("py-1.5", recentSearches.length > 0 && "border-t")}>
                    <p className={sectionHeaderCn}>인기검색어</p>
                    <div className="grid grid-cols-2 gap-x-2">
                      {HEADER_POPULAR.map(({ rank, keyword }) => (
                        <button
                          key={keyword}
                          onClick={() => handleSelect(keyword)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                        >
                          <span className={cn(
                            "w-5 text-center text-xs font-bold shrink-0",
                            rank <= 3 ? "text-primary" : "text-muted-foreground"
                          )}>
                            {rank}
                          </span>
                          <span>{keyword}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* ① 키워드 자동완성 */}
              {showKeywords && (
                <div className="py-1.5">
                  <p className={sectionHeaderCn}>검색어 추천</p>
                  {keywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleSelect(keyword)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <Search className="size-4 text-muted-foreground shrink-0" />
                      <span>
                        <HighlightMatch text={keyword} query={trimmed} />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* ② 지역 제안 */}
              {showRegions && (
                <div className={cn("py-1.5", showKeywords && "border-t")}>
                  <p className={sectionHeaderCn}>지역</p>
                  {regions.map((region) => {
                    const Icon = ICON_MAP[region.icon]
                    return (
                      <button
                        key={region.name}
                        onClick={() => handleSelect(region.name)}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                      >
                        <Icon className="size-4 text-muted-foreground shrink-0" />
                        <span>
                          <HighlightMatch text={region.name} query={trimmed} />
                        </span>
                      </button>
                    )
                  })}
                </div>
              )}

              {/* ③ 숙소 제안 */}
              {showAccommodations && (
                <div className={cn("py-1.5", (showKeywords || showRegions) && "border-t")}>
                  <p className={sectionHeaderCn}>숙소</p>
                  {accommodations.map((item) => (
                    <button
                      key={item.id}
                      onClick={() => handleAccommodationClick(item.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left"
                    >
                      <div className="relative size-10 rounded-lg overflow-hidden shrink-0 border">
                        <Image
                          src={item.imageUrl}
                          alt={item.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">
                          <HighlightMatch text={item.name} query={trimmed} />
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {item.type} · {item.location}
                        </p>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>,
          document.body
        )}
    </>
  )
}

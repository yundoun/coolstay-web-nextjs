"use client"

import { useState, useRef, useEffect, useCallback, useMemo } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { createPortal } from "react-dom"
import { Search, X, Clock, MapPin, TrainFront, Building2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { useKeywordList, usePopularKeywords } from "../hooks/useKeywordData"

const sectionHeaderCn = "px-4 py-1.5 text-[11px] font-medium text-muted-foreground uppercase tracking-wider"

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
  const searchParams = useSearchParams()
  const urlKeyword = searchParams?.get("keyword") ?? ""
  const [query, setQuery] = useState(urlKeyword)
  const [isFocused, setIsFocused] = useState(false)

  // URL keyword 변경 시 input 동기화
  useEffect(() => {
    if (!isFocused) setQuery(urlKeyword)
  }, [urlKeyword, isFocused])
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

  // API에서 키워드 목록 가져오기 (자동완성용)
  const { data: keywordData } = useKeywordList()
  const keywordItems = keywordData?.keyword_lists ?? []
  const searchResults = keywordData?.search_results ?? []

  // 인기검색어 API (CMS 관리)
  const { data: popularData } = usePopularKeywords()
  const popularKeywords = popularData?.popular_keywords ?? []

  // 자동완성 필터링 (AOS 패턴: 키워드 3개 + 지역/지하철 5개 + 숙소 5개)
  const trimmed = query.trim()

  const keywordSuggestions = useMemo(() => {
    if (!trimmed) return []
    return keywordItems
      .filter((item) => item.keyword.includes(trimmed))
      .slice(0, 3)
  }, [trimmed, keywordItems])

  const regionSuggestions = useMemo(() => {
    if (!trimmed) return []
    return searchResults
      .filter((item) => (item.type === "R" || item.type === "S") && item.entity_name?.includes(trimmed))
      .slice(0, 5)
  }, [trimmed, searchResults])

  const storeSuggestions = useMemo(() => {
    if (!trimmed) return []
    return searchResults
      .filter((item) => item.type === "M" && item.entity_name?.includes(trimmed))
      .slice(0, 5)
  }, [trimmed, searchResults])

  const hasSuggestions = trimmed.length > 0 && (keywordSuggestions.length > 0 || regionSuggestions.length > 0 || storeSuggestions.length > 0)
  const showDropdown = isFocused && (hasSuggestions || trimmed.length === 0)

  // 드롭다운 위치 계산
  useEffect(() => {
    if (!showDropdown || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    const isMobileWidth = window.innerWidth < 768
    setDropdownPos({
      top: rect.bottom + 8,
      left: isMobileWidth ? 8 : rect.left,
      width: isMobileWidth ? window.innerWidth - 16 : Math.max(rect.width, 420),
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
      setQuery(keyword)
      setIsFocused(false)

      const today = new Date()
      const tomorrow = new Date(today)
      tomorrow.setDate(tomorrow.getDate() + 1)
      const fmt = (d: Date) =>
        `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(d.getDate()).padStart(2, "0")}`

      // 현재 URL에서 기존 검색 params 보존 (날짜, 인원 등)
      const currentParams = new URLSearchParams(window.location.search)
      const params = new URLSearchParams()
      params.set("keyword", keyword)
      // 기존 params에서 날짜/인원 보존, 없으면 기본값
      params.set("checkIn", currentParams.get("checkIn") || fmt(today))
      params.set("checkOut", currentParams.get("checkOut") || fmt(tomorrow))
      params.set("adults", currentParams.get("adults") || "2")
      const kids = currentParams.get("kids")
      if (kids) params.set("kids", kids)
      // sort 보존
      const sort = currentParams.get("sort")
      if (sort) params.set("sort", sort)
      router.push(`/search?${params.toString()}`)
    },
    [router, addRecentSearch]
  )

  const handleStoreClick = useCallback(
    (entityId: string, entityName: string) => {
      addRecentSearch(entityName)
      setQuery("")
      setIsFocused(false)
      router.push(`/accommodations/${entityId}`)
    },
    [router, addRecentSearch]
  )

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent) => {
      // IME 조합 중(한글 입력 중)에는 무시
      if (e.nativeEvent.isComposing) return
      if (e.key === "Enter" && query.trim()) {
        e.preventDefault()
        handleSelect(query.trim())
      }
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
            onFocus={() => {
              setIsFocused(true)
            }}
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
                  {popularKeywords.length > 0 && (
                  <div className={cn("py-1.5", recentSearches.length > 0 && "border-t")}>
                    <p className={sectionHeaderCn}>인기검색어</p>
                    <div className="grid grid-cols-2 gap-x-2">
                      {popularKeywords.map(({ ranking, keyword }) => (
                        <button
                          key={keyword}
                          onClick={() => handleSelect(keyword)}
                          className="flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                        >
                          <span className={cn(
                            "w-5 text-center text-xs font-bold shrink-0",
                            ranking <= 3 ? "text-primary" : "text-muted-foreground"
                          )}>
                            {ranking}
                          </span>
                          <span>{keyword}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                  )}
                </>
              )}

              {/* ① 키워드 자동완성 (최대 3개) */}
              {keywordSuggestions.length > 0 && (
                <div className="py-1.5">
                  <p className={sectionHeaderCn}>검색어</p>
                  {keywordSuggestions.map((item) => (
                    <button
                      key={`k-${item.keyword}`}
                      onClick={() => handleSelect(item.keyword)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <Search className="size-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 min-w-0 truncate">
                        <HighlightMatch text={item.keyword} query={trimmed} />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* ② 지역/지하철 (최대 5개) */}
              {regionSuggestions.length > 0 && (
                <div className={cn("py-1.5", keywordSuggestions.length > 0 && "border-t")}>
                  <p className={sectionHeaderCn}>지역</p>
                  {regionSuggestions.map((item) => (
                    <button
                      key={`r-${item.type}-${item.entity_name}`}
                      onClick={() => handleSelect(item.entity_name ?? "")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      {item.type === "S" ? (
                        <TrainFront className="size-4 text-muted-foreground shrink-0" />
                      ) : (
                        <MapPin className="size-4 text-muted-foreground shrink-0" />
                      )}
                      <span className="flex-1 min-w-0 truncate">
                        <HighlightMatch text={item.entity_name ?? ""} query={trimmed} />
                      </span>
                    </button>
                  ))}
                </div>
              )}

              {/* ③ 숙소 (최대 5개, 클릭 시 상세 이동) */}
              {storeSuggestions.length > 0 && (
                <div className={cn("py-1.5", (keywordSuggestions.length > 0 || regionSuggestions.length > 0) && "border-t")}>
                  <p className={sectionHeaderCn}>숙소</p>
                  {storeSuggestions.map((item) => (
                    <button
                      key={`m-${item.v2_entity_id ?? item.entity_id}`}
                      onClick={() => handleStoreClick(item.v2_entity_id ?? item.entity_id ?? "", item.entity_name ?? "")}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <Building2 className="size-4 text-muted-foreground shrink-0" />
                      <span className="flex-1 min-w-0 truncate">
                        <HighlightMatch text={item.entity_name ?? ""} query={trimmed} />
                      </span>
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

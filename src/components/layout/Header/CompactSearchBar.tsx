"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Search, X, MapPin, TrainFront } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

/* ── 데이터 ── */

const KEYWORDS = [
  "오이도", "용인", "을왕리", "양양", "안양", "여의도",
  "대구", "서면", "경주", "부산", "서울", "해운대", "강남", "제주",
  "속초", "전주", "동대문", "명동", "강릉", "여수", "서귀포",
  "인천", "수원", "대전", "광주", "울산", "춘천", "목포",
]

type Region = { name: string; icon: "pin" | "train"; area?: string }
const REGIONS: Region[] = [
  { name: "서울 전체", icon: "pin", area: "서울" },
  { name: "서울 강남/역삼", icon: "pin", area: "서울" },
  { name: "서울 홍대/합정/마포", icon: "pin", area: "서울" },
  { name: "서울 명동/을지로", icon: "pin", area: "서울" },
  { name: "서울역", icon: "train", area: "서울" },
  { name: "부산 전체", icon: "pin", area: "부산" },
  { name: "부산 해운대/센텀", icon: "pin", area: "부산" },
  { name: "부산 서면/부산역", icon: "pin", area: "부산" },
  { name: "부산역", icon: "train", area: "부산" },
  { name: "제주 전체", icon: "pin", area: "제주" },
  { name: "제주시", icon: "pin", area: "제주" },
  { name: "서귀포시", icon: "pin", area: "제주" },
  { name: "강남역", icon: "train", area: "서울" },
  { name: "홍대입구역", icon: "train", area: "서울" },
  { name: "해운대역", icon: "train", area: "부산" },
  { name: "강릉역", icon: "train", area: "강원" },
  { name: "경주역", icon: "train", area: "경북" },
  { name: "전주역", icon: "train", area: "전북" },
  { name: "대구역", icon: "train", area: "대구" },
  { name: "대전역", icon: "train", area: "대전" },
  { name: "인천 전체", icon: "pin", area: "인천" },
  { name: "강릉 전체", icon: "pin", area: "강원" },
  { name: "속초 전체", icon: "pin", area: "강원" },
  { name: "여수 전체", icon: "pin", area: "전남" },
  { name: "경주 전체", icon: "pin", area: "경북" },
]

type Accommodation = {
  id: string
  name: string
  type: string
  location: string
  imageUrl: string
}
const ACCOMMODATIONS: Accommodation[] = [
  { id: "1", name: "파라다이스 호텔 부산", type: "호텔/리조트", location: "부산", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop" },
  { id: "2", name: "그랜드 하얏트 제주", type: "호텔/리조트", location: "제주", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=80&fit=crop" },
  { id: "3", name: "세인트존스 호텔", type: "호텔/리조트", location: "강원", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=80&fit=crop" },
  { id: "6", name: "호텔 스카이파크 명동", type: "호텔/리조트", location: "서울", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=80&h=80&fit=crop" },
  { id: "4", name: "롯데호텔 서울", type: "호텔/리조트", location: "서울", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&h=80&fit=crop" },
  { id: "5", name: "메종 글래드 제주", type: "호텔/리조트", location: "제주", imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=80&h=80&fit=crop" },
  { id: "7", name: "해운대 그랜드 호텔", type: "호텔/리조트", location: "부산", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=80&h=80&fit=crop" },
  { id: "8", name: "경주 힐튼 호텔", type: "호텔/리조트", location: "경주", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=80&h=80&fit=crop" },
]

const POPULAR_KEYWORDS = [
  { rank: 1, keyword: "제주" },
  { rank: 2, keyword: "서울" },
  { rank: 3, keyword: "부산" },
  { rank: 4, keyword: "강릉" },
  { rank: 5, keyword: "속초" },
  { rank: 6, keyword: "여수" },
]

const ICON_MAP = { pin: MapPin, train: TrainFront } as const

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

/* ── 제안 로직 ── */

function suggestKeywords(query: string) {
  if (!query) return []
  return KEYWORDS.filter((k) => k.includes(query)).slice(0, 5)
}

function suggestRegions(query: string) {
  if (!query) return []
  return REGIONS.filter((r) => r.name.includes(query) || (r.area && r.area.includes(query))).slice(0, 5)
}

function suggestAccommodations(query: string) {
  if (!query) return []
  return ACCOMMODATIONS.filter(
    (a) => a.name.includes(query) || a.location.includes(query)
  ).slice(0, 3)
}

/* ── 컴포넌트 ── */

export function CompactSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
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

  const handleSelect = useCallback(
    (keyword: string) => {
      setQuery("")
      setIsFocused(false)
      router.push(`/search?keyword=${encodeURIComponent(keyword)}`)
    },
    [router]
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
              {/* 빈 입력 상태: 인기검색어 */}
              {trimmed.length === 0 && (
                <div className="py-1.5">
                  <p className={sectionHeaderCn}>인기검색어</p>
                  <div className="grid grid-cols-2 gap-x-2">
                    {POPULAR_KEYWORDS.map(({ rank, keyword }) => (
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

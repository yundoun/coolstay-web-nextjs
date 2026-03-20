"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import { useRouter } from "next/navigation"
import { createPortal } from "react-dom"
import Image from "next/image"
import { Search, X } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

const suggestKeywords = (query: string) => {
  const all = [
    "오이도", "용인", "을왕리", "양양", "안양", "여의도",
    "대구", "서면", "경주", "부산", "서울", "해운대", "강남", "제주",
    "속초", "전주", "동대문", "명동", "강릉", "여수",
  ]
  if (!query.trim()) return []
  return all.filter((k) => k.includes(query)).slice(0, 6)
}

const suggestMotels = (query: string) => {
  const all = [
    { id: "1", name: "파라다이스 호텔 부산", type: "호텔/리조트", location: "부산", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop" },
    { id: "2", name: "그랜드 하얏트 제주", type: "호텔/리조트", location: "제주", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=80&fit=crop" },
    { id: "3", name: "세인트존스 호텔", type: "호텔/리조트", location: "강원", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=80&fit=crop" },
    { id: "6", name: "호텔 스카이파크 명동", type: "호텔/리조트", location: "서울", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=80&h=80&fit=crop" },
    { id: "4", name: "롯데호텔 서울", type: "호텔/리조트", location: "서울", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&h=80&fit=crop" },
  ]
  if (!query.trim()) return []
  return all.filter((m) => m.name.includes(query) || m.location.includes(query)).slice(0, 4)
}

export function CompactSearchBar() {
  const router = useRouter()
  const [query, setQuery] = useState("")
  const [isFocused, setIsFocused] = useState(false)
  const [dropdownPos, setDropdownPos] = useState({ top: 0, left: 0, width: 0 })
  const wrapperRef = useRef<HTMLDivElement>(null)
  const inputRef = useRef<HTMLInputElement>(null)
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  const keywords = suggestKeywords(query)
  const motels = suggestMotels(query)
  const showDropdown = isFocused && query.trim().length > 0 && (keywords.length > 0 || motels.length > 0)

  // 드롭다운 위치 계산
  useEffect(() => {
    if (!showDropdown || !wrapperRef.current) return
    const rect = wrapperRef.current.getBoundingClientRect()
    setDropdownPos({
      top: rect.bottom + 8,
      left: rect.left,
      width: Math.max(rect.width, 400),
    })
  }, [showDropdown, query])

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

  const handleMotelClick = useCallback(
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

      {/* 드롭다운 — Portal로 body에 렌더링 (헤더 stacking context 우회) */}
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
            <div className="bg-card border rounded-xl shadow-xl overflow-hidden">
              {/* 키워드 제안 */}
              {keywords.length > 0 && (
                <div className="py-2">
                  {keywords.map((keyword) => (
                    <button
                      key={keyword}
                      onClick={() => handleSelect(keyword)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors text-left"
                    >
                      <Search className="size-4 text-muted-foreground shrink-0" />
                      <span>{keyword}</span>
                    </button>
                  ))}
                </div>
              )}

              {/* 숙소 제안 */}
              {motels.length > 0 && (
                <div className={cn("py-2", keywords.length > 0 && "border-t")}>
                  {motels.map((motel) => (
                    <button
                      key={motel.id}
                      onClick={() => handleMotelClick(motel.id)}
                      className="w-full flex items-center gap-3 px-4 py-2.5 hover:bg-muted transition-colors text-left"
                    >
                      <div className="relative size-10 rounded-lg overflow-hidden shrink-0 border">
                        <Image
                          src={motel.imageUrl}
                          alt={motel.name}
                          fill
                          className="object-cover"
                          sizes="40px"
                        />
                      </div>
                      <div className="min-w-0">
                        <p className="text-sm font-medium truncate">{motel.name}</p>
                        <p className="text-xs text-muted-foreground">
                          {motel.type} · {motel.location}
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

"use client"

import { useState, useEffect, useCallback } from "react"
import { Megaphone, ChevronDown, ChevronUp, Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getNoticeList } from "@/domains/cs/api/csApi"
import type { BoardItem } from "@/domains/cs/types"

export function NoticeListPage() {
  const [items, setItems] = useState<BoardItem[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [expandedId, setExpandedId] = useState<string | null>(null)

  const fetchList = useCallback(async () => {
    setIsLoading(true)
    try {
      const res = await getNoticeList()
      setItems(res.board_items ?? [])
    } catch {
      setItems([])
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => { fetchList() }, [fetchList])

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>

      {isLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-8 animate-spin text-muted-foreground" />
        </div>
      ) : items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Megaphone className="size-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">공지사항이 없습니다</p>
        </div>
      ) : (
        <div className="divide-y rounded-xl border bg-card overflow-hidden">
          {items.map((notice) => {
            const expanded = expandedId === notice.key
            return (
              <div key={notice.key}>
                <button
                  onClick={() => setExpandedId(expanded ? null : notice.key)}
                  className="w-full text-left px-4 py-4 hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        {notice.status === "IMPORTANT" && (
                          <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                            중요
                          </Badge>
                        )}
                      </div>
                      <p className={cn("text-sm font-medium leading-snug", expanded ? "" : "line-clamp-1")}>
                        {notice.title}
                      </p>
                    </div>
                    <div className="shrink-0 pt-1">
                      {expanded ? (
                        <ChevronUp className="size-4 text-muted-foreground" />
                      ) : (
                        <ChevronDown className="size-4 text-muted-foreground" />
                      )}
                    </div>
                  </div>
                </button>

                {expanded && (
                  <div className="px-4 pb-4">
                    <div className="rounded-lg bg-muted/30 p-4">
                      <p className="text-sm text-foreground whitespace-pre-line leading-relaxed">
                        {notice.description}
                      </p>
                    </div>
                  </div>
                )}
              </div>
            )
          })}
        </div>
      )}
    </Container>
  )
}

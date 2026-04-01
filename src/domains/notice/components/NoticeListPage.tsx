"use client"

import { useState } from "react"
import { useQuery } from "@tanstack/react-query"
import { Megaphone, ChevronDown, ChevronUp } from "lucide-react"
import { Container } from "@/components/layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getNoticeList } from "@/domains/cs/api/csApi"
import type { BoardItem } from "@/domains/cs/types"

export function NoticeListPage() {
  const { data, isLoading } = useQuery({
    queryKey: ["notices"],
    queryFn: () => getNoticeList(),
    retry: 1,
  })
  const items = data?.board_items ?? []
  const [expandedId, setExpandedId] = useState<number | null>(null)

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>

      {isLoading ? (
        <LoadingSpinner />
      ) : items.length === 0 ? (
        <EmptyState icon={Megaphone} title="공지사항이 없습니다" />
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

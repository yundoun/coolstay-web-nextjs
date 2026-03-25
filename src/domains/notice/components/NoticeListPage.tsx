"use client"

import { useState } from "react"
import { Megaphone, ChevronDown, ChevronUp } from "lucide-react"
import { Container } from "@/components/layout"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { noticesMock } from "../data/mock"

function isNew(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  return diff < 7 * 24 * 60 * 60 * 1000
}

export function NoticeListPage() {
  const [expandedId, setExpandedId] = useState<string | null>(null)

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">공지사항</h1>

      <div className="divide-y rounded-xl border bg-card overflow-hidden">
        {noticesMock.map((notice) => {
          const expanded = expandedId === notice.id
          return (
            <div key={notice.id}>
              <button
                onClick={() =>
                  setExpandedId(expanded ? null : notice.id)
                }
                className="w-full text-left px-4 py-4 hover:bg-muted/50 transition-colors"
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      {notice.isImportant && (
                        <Badge variant="destructive" className="text-[10px] px-1.5 py-0">
                          중요
                        </Badge>
                      )}
                      {isNew(notice.createdAt) && (
                        <Badge className="text-[10px] px-1.5 py-0 bg-blue-500">
                          NEW
                        </Badge>
                      )}
                    </div>
                    <p
                      className={cn(
                        "text-sm font-medium leading-snug",
                        expanded ? "" : "line-clamp-1"
                      )}
                    >
                      {notice.title}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                      {notice.createdAt}
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
                      {notice.content}
                    </p>
                  </div>
                </div>
              )}
            </div>
          )
        })}
      </div>

      {noticesMock.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <Megaphone className="size-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">공지사항이 없습니다</p>
        </div>
      )}
    </Container>
  )
}

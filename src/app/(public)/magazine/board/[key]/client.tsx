"use client"

import { usePathname } from "next/navigation"
import { BoardDetailPage } from "@/domains/magazine/components/BoardDetailPage"

export function MagazineBoardDetailClient() {
  const pathname = usePathname()
  // /web/coolstay/magazine/board/{key} or /magazine/board/{key}
  const segments = (pathname ?? "").split("/").filter(Boolean)
  const boardIdx = segments.indexOf("board")
  const key = boardIdx >= 0 ? Number(segments[boardIdx + 1]) : NaN

  if (!key || isNaN(key)) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        잘못된 게시글 주소입니다
      </div>
    )
  }

  return <BoardDetailPage boardKey={key} />
}

"use client"

import { useParams } from "next/navigation"
import { BoardDetailPage } from "@/domains/magazine/components/BoardDetailPage"

export function MagazineBoardDetailClient() {
  const params = useParams<{ key: string }>()
  const key = Number(params?.key)

  if (!key || isNaN(key)) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        잘못된 게시글 주소입니다
      </div>
    )
  }

  return <BoardDetailPage boardKey={key} />
}

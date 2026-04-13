"use client"

import { useParams } from "next/navigation"
import { PackageDetailPage } from "@/domains/magazine/components/PackageDetailPage"

export default function MagazinePackageDetailPage() {
  const params = useParams<{ key: string }>()
  const key = Number(params?.key)

  if (!key || isNaN(key)) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        잘못된 패키지 주소입니다
      </div>
    )
  }

  return <PackageDetailPage packageKey={key} />
}

"use client"

import { usePathname } from "next/navigation"
import { PackageDetailPage } from "@/domains/magazine/components/PackageDetailPage"

export function MagazinePackageDetailClient() {
  const pathname = usePathname()
  // /web/coolstay/magazine/package/{key} or /magazine/package/{key}
  const segments = (pathname ?? "").split("/").filter(Boolean)
  const pkgIdx = segments.indexOf("package")
  const key = pkgIdx >= 0 ? Number(segments[pkgIdx + 1]) : NaN

  if (!key || isNaN(key)) {
    return (
      <div className="py-20 text-center text-muted-foreground">
        잘못된 패키지 주소입니다
      </div>
    )
  }

  return <PackageDetailPage packageKey={key} />
}

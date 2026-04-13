"use client"

import Image from "next/image"
import Link from "next/link"
import { cn } from "@/lib/utils"
import type { MagazinePackage } from "../types"

interface Props {
  packages: MagazinePackage[]
  hideMore?: boolean
}

export function PackageCardGrid({ packages, hideMore }: Props) {
  if (packages.length === 0) return null

  return (
    <div>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
        {packages.map((pkg) => (
          <Link
            key={pkg.key}
            href={`/magazine/package/${pkg.key}`}
            className={cn(
              "group rounded-xl overflow-hidden border bg-card",
              "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
            )}
          >
            <div className="relative aspect-[4/3] overflow-hidden">
              {pkg.image_url ? (
                <Image
                  src={pkg.image_url}
                  alt={`패키지 ${pkg.key}`}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                />
              ) : (
                <div className="h-full w-full bg-gradient-to-br from-muted to-muted-foreground/10" />
              )}
            </div>
          </Link>
        ))}
      </div>
      {!hideMore && (
        <div className="mt-4 text-center">
          <Link
            href="/magazine/package"
            className="text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            패키지 전체보기 →
          </Link>
        </div>
      )}
    </div>
  )
}

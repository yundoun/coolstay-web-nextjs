"use client"

import Image from "next/image"
import Link from "next/link"
import { MapPin, TrendingUp, AlertTriangle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { StoreItem } from "@/lib/api/types"

export function MileageStoreCard({ store }: { store: StoreItem }) {
  const pointRate = store.benefit_point_rate ?? 0
  const userPoint = store.user_point_amount ?? 0
  const expirePoint = store.expire_point_amount ?? 0
  const thumbUrl = store.images?.[0]?.url

  return (
    <Link
      href={`/accommodations/${store.key}`}
      className="flex gap-4 rounded-xl border bg-card p-4 hover:shadow-md transition-shadow"
    >
      {/* 썸네일 */}
      <div className="relative w-20 h-[106px] rounded-lg overflow-hidden shrink-0 bg-muted">
        {thumbUrl ? (
          <Image
            src={thumbUrl}
            alt={store.name}
            fill
            className="object-cover"
            sizes="80px"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-muted-foreground text-xs">
            No Image
          </div>
        )}
        {pointRate > 0 && (
          <Badge className="absolute bottom-1 left-1 text-[10px] px-1.5 py-0.5 bg-primary/90">
            {pointRate}% 적립
          </Badge>
        )}
      </div>

      {/* 정보 */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <h3 className="font-semibold text-sm truncate">{store.name}</h3>
          {store.location && (
            <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
              <MapPin className="size-3 shrink-0" />
              <span className="truncate">{store.location.nearby_description}</span>
            </p>
          )}
        </div>

        <div className="mt-2">
          <div className="flex items-center gap-1.5">
            <TrendingUp className="size-4 text-primary" />
            <span className="text-lg font-bold text-primary">
              {userPoint.toLocaleString()}
              <span className="text-xs font-normal text-muted-foreground ml-0.5">P</span>
            </span>
          </div>
          {expirePoint > 0 && (
            <p className="text-xs text-red-500 flex items-center gap-1 mt-1">
              <AlertTriangle className="size-3" />
              소멸 예정 {expirePoint.toLocaleString()}P
            </p>
          )}
        </div>
      </div>
    </Link>
  )
}

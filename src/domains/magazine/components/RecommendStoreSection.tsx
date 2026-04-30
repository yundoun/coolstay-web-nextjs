"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart } from "lucide-react"
import { cn } from "@/lib/utils"
import { useMagazineStores } from "../hooks/useMagazine"
import type { StoreItem } from "@/lib/api/types"

export function RecommendStoreSection() {
  const [coords, setCoords] = useState<{ lat: string; lng: string } | null>(null)

  useEffect(() => {
    if (!navigator.geolocation) {
      setCoords({ lat: "37.4979", lng: "127.0276" })
      return
    }
    navigator.geolocation.getCurrentPosition(
      (pos) => setCoords({ lat: String(pos.coords.latitude), lng: String(pos.coords.longitude) }),
      () => setCoords({ lat: "37.4979", lng: "127.0276" })
    )
  }, [])

  const { data, isLoading } = useMagazineStores(coords?.lat, coords?.lng)
  const stores = data?.motels ?? []

  if (isLoading || stores.length === 0) return null

  return (
    <div className="flex gap-[15px] overflow-x-auto px-4 pb-1 scrollbar-hide">
      {stores.map((store) => (
        <StoreCard key={store.key} store={store} />
      ))}
    </div>
  )
}

function StoreCard({ store }: { store: StoreItem }) {
  const image = store.images?.[0]?.url
  const stayItem = store.items?.find((i) => i.category?.code === "010102")
  const rentItem = store.items?.find((i) => i.category?.code === "010101")
  const displayItem = stayItem ?? rentItem ?? store.items?.[0]
  const price = displayItem?.consecutive_price ?? displayItem?.price ?? 0
  const hasCoupon = (store.coupons?.length ?? 0) > 0

  return (
    <Link
      href={`/accommodations/${store.key}`}
      className={cn(
        "group flex-shrink-0 w-[200px] rounded-xl overflow-hidden bg-card border",
        "transition-all duration-300 hover:shadow-lg hover:-translate-y-0.5"
      )}
    >
      <div className="relative aspect-[4/3] overflow-hidden">
        {image ? (
          <Image
            src={image}
            alt={store.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="200px"
          />
        ) : (
          <div className="h-full w-full bg-muted flex items-center justify-center text-3xl">🐝</div>
        )}
        <div className="absolute top-2 right-2">
          <Heart className={cn(
            "size-5",
            store.user_like_yn === "Y" ? "fill-red-500 text-red-500" : "fill-white/30 text-white"
          )} />
        </div>
        {hasCoupon && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            <span className="text-[10px] font-medium bg-red-500 text-white px-1.5 py-0.5 rounded">
              선착순 쿠폰
            </span>
          </div>
        )}
      </div>
      <div className="p-2.5">
        <p className="text-sm font-medium line-clamp-1">{store.name}</p>
        <div className="flex items-center gap-1 mt-1">
          <Heart className="size-3 text-muted-foreground" />
          <span className="text-xs text-muted-foreground">{store.like_count}</span>
        </div>
        {price > 0 && (
          <p className="text-sm font-bold mt-1">{price.toLocaleString()}원</p>
        )}
      </div>
    </Link>
  )
}

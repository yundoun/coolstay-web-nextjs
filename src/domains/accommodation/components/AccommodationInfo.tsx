"use client"

import { useState, useCallback } from "react"
import { useRouter, usePathname } from "next/navigation"
import { Star, MapPin, Share2, Heart, Coins, Ticket, Gift } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useAuthStore } from "@/lib/stores/auth"
import { useFavorites } from "@/domains/favorites/hooks/useFavorites"
import type { AccommodationDetail } from "../types"

interface AccommodationInfoProps {
  accommodation: AccommodationDetail
}

export function AccommodationInfo({ accommodation }: AccommodationInfoProps) {
  const { addFavorite, removeFavorites } = useFavorites()
  const [liked, setLiked] = useState(accommodation.userLikeYn === "Y")
  const [toggling, setToggling] = useState(false)
  const router = useRouter()
  const pathname = usePathname()
  const isLoggedIn = useAuthStore((s) => s.isLoggedIn)

  const handleToggleFavorite = useCallback(async () => {
    if (toggling) return
    if (!isLoggedIn) {
      router.push(`/login?redirect=${encodeURIComponent(pathname ?? "/")}`)
      return
    }
    const prev = liked
    setLiked(!prev)
    setToggling(true)
    try {
      if (prev) {
        await removeFavorites([accommodation.id])
      } else {
        await addFavorite(accommodation.id)
      }
    } catch {
      setLiked(prev)
    } finally {
      setToggling(false)
    }
  }, [toggling, liked, accommodation.id, addFavorite, removeFavorites, isLoggedIn, router, pathname])
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        {/* Tags */}
        {accommodation.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mb-3">
            {accommodation.tags.map((tag) => (
              <Badge key={tag} variant="outline" className="text-xs">
                {tag}
              </Badge>
            ))}
          </div>
        )}
        {/* Title */}
        <h1 className="text-2xl font-bold tracking-tight md:text-3xl">
          {accommodation.name}
        </h1>

        {/* Location & Rating & Mileage */}
        <div className="mt-2 flex flex-wrap items-center gap-3 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <MapPin className="size-4" />
            <span>{accommodation.address}</span>
          </div>
          <div className="flex items-center gap-1">
            <Star className="size-4 fill-primary text-primary" />
            <span className="font-medium text-foreground">
              {accommodation.rating}
            </span>
            <span>({accommodation.reviewCount.toLocaleString()})</span>
          </div>
        </div>

        {/* 쿠폰 배너 */}
        {accommodation.downloadCouponInfo &&
          accommodation.downloadCouponInfo.status !== "NON_TARGET" && (
          <div className="mt-3 flex items-center gap-2 px-3 py-2.5 rounded-lg bg-primary/5 border border-primary/20">
            <Ticket className="size-4 text-primary shrink-0" />
            <div className="flex-1 min-w-0">
              <span className="text-sm font-semibold text-foreground">
                {accommodation.downloadCouponInfo.stay_amount > 0
                  ? `${accommodation.downloadCouponInfo.stay_amount.toLocaleString()}원 즉시할인 쿠폰`
                  : "할인 쿠폰 사용 가능"}
              </span>
              {accommodation.coupons.length > 1 && (
                <span className="text-xs text-muted-foreground ml-1.5">
                  외 {accommodation.coupons.length - 1}장
                </span>
              )}
            </div>
          </div>
        )}

        {/* 마일리지/첫예약 혜택 */}
        {(accommodation.benefitPointRate > 0 || accommodation.v2SupportFlag?.first_reserve) && (
          <div className="mt-2 flex flex-wrap gap-2">
            {accommodation.benefitPointRate > 0 && (
              <div className="flex items-center gap-1 text-xs text-emerald-700 bg-emerald-50 px-2 py-1 rounded-full">
                <Coins className="size-3" />
                <span className="font-medium">최대 마일리지 적립 +{accommodation.benefitPointRate}%</span>
              </div>
            )}
            {accommodation.v2SupportFlag?.first_reserve && (
              <div className="flex items-center gap-1 text-xs text-primary bg-primary/5 px-2 py-1 rounded-full">
                <Gift className="size-3" />
                <span className="font-medium">첫 예약 혜택</span>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-2",
              liked && "text-red-500 border-red-200 bg-red-50 hover:bg-red-100"
            )}
            onClick={handleToggleFavorite}
            disabled={toggling}
          >
            <Heart className={cn("size-4", liked && "fill-current")} />
            {liked ? "찜" : "찜하기"}
          </Button>
          <Button variant="outline" size="sm" className="gap-2">
            <Share2 className="size-4" />
            공유
          </Button>
        </div>
      </div>

      {accommodation.parkingInfo && (
        <div className="p-4 rounded-xl bg-muted/50">
          <p className="text-sm">
            <span className="font-medium">주차 정보: </span>
            <span className="text-muted-foreground">{accommodation.parkingInfo}</span>
          </p>
        </div>
      )}
    </div>
  )
}

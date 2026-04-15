"use client"

import { useState, useCallback } from "react"
import { Star, MapPin, Share2, Heart, Coins } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import { useFavorites } from "@/domains/favorites/hooks/useFavorites"
import type { AccommodationDetail } from "../types"

interface AccommodationInfoProps {
  accommodation: AccommodationDetail
}

export function AccommodationInfo({ accommodation }: AccommodationInfoProps) {
  const { addFavorite, removeFavorites } = useFavorites()
  const [liked, setLiked] = useState(accommodation.userLikeYn === "Y")
  const [toggling, setToggling] = useState(false)

  const handleToggleFavorite = useCallback(async () => {
    if (toggling) return
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
  }, [toggling, liked, accommodation.id, addFavorite, removeFavorites])
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
          {/* 마일리지 적립률 */}
          {accommodation.benefitPointRate > 0 && (
            <div className="flex items-center gap-1 text-primary font-medium">
              <Coins className="size-4" />
              <span>+{accommodation.benefitPointRate}% 적립</span>
            </div>
          )}
        </div>

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

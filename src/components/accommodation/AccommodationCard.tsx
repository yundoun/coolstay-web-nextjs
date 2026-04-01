"use client"

import Image from "next/image"
import Link from "next/link"
import { Heart, Star, Ticket } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Accommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  priceLabel?: string
  likeCount?: number
  isLiked?: boolean
  imageUrl: string
  tags?: string[]
  isSoldOut?: boolean
  partnershipType?: string
  consecutiveYn?: string
  rating?: number
  reviewCount?: number
  mileageRate?: number
  hasCoupon?: boolean
  address?: string
}

export interface AccommodationCardProps {
  accommodation: Accommodation
  priority?: boolean
}

export function AccommodationCard({ accommodation, priority = false }: AccommodationCardProps) {
  const discount = accommodation.originalPrice
    ? Math.round(
        ((accommodation.originalPrice - accommodation.price) /
          accommodation.originalPrice) *
          100
      )
    : null

  return (
    <Link
      href={`/accommodations/${accommodation.id}`}
      className="group block"
    >
      <article className="overflow-hidden rounded-xl bg-card transition-shadow hover:shadow-lg">
        {/* Image */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={accommodation.imageUrl}
            alt={accommodation.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-300 ease-out group-hover:scale-[1.03]"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Discount Badge */}
          {discount && discount > 0 && (
            <Badge
              variant="default"
              className="absolute left-3 top-3 rounded-md font-bold"
            >
              {discount}%
            </Badge>
          )}

          {/* Wishlist Button */}
          <Button
            variant="ghost"
            size="icon"
            className={cn(
              "absolute right-2 top-2 size-8 rounded-full",
              "bg-black/20 backdrop-blur-sm",
              accommodation.isLiked
                ? "text-red-500 hover:bg-black/30 hover:text-red-500"
                : "text-white hover:bg-black/30 hover:text-white"
            )}
            onClick={(e) => {
              e.preventDefault()
            }}
          >
            <Heart className={cn("size-4", accommodation.isLiked && "fill-current")} />
            <span className="sr-only">찜하기</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Tags */}
          {accommodation.tags && accommodation.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {accommodation.tags.slice(0, 3).map((tag) => (
                <Badge
                  key={tag}
                  variant="secondary"
                  className="text-xs font-normal"
                >
                  {tag}
                </Badge>
              ))}
            </div>
          )}

          {/* Name & Location */}
          <h3 className="font-semibold text-foreground line-clamp-1 group-hover:text-primary transition-colors">
            {accommodation.name}
          </h3>
          {accommodation.location && (
            <p className="mt-0.5 text-sm text-muted-foreground">
              {accommodation.location}
            </p>
          )}

          {/* Rating · Mileage · Coupon */}
          {(accommodation.rating || accommodation.mileageRate || accommodation.hasCoupon) && (
            <div className="mt-1.5 flex flex-wrap items-center gap-x-2.5 gap-y-1 text-xs text-muted-foreground">
              {accommodation.rating != null && accommodation.rating > 0 && (
                <span className="inline-flex items-center gap-0.5">
                  <Star className="size-3 fill-amber-400 text-amber-400" />
                  <span className="font-medium text-foreground">{accommodation.rating.toFixed(1)}</span>
                  {accommodation.reviewCount != null && accommodation.reviewCount > 0 && (
                    <span>({accommodation.reviewCount.toLocaleString()})</span>
                  )}
                </span>
              )}
              {accommodation.mileageRate != null && accommodation.mileageRate > 0 && (
                <span className="inline-flex items-center gap-0.5 text-emerald-600">
                  <span className="font-medium">+{accommodation.mileageRate}% 적립</span>
                </span>
              )}
              {accommodation.hasCoupon && (
                <span className="inline-flex items-center gap-0.5 rounded bg-primary/10 px-1.5 py-px text-primary font-medium">
                  <Ticket className="size-3" />
                  쿠폰
                </span>
              )}
            </div>
          )}

          {/* Like Count */}
          {accommodation.likeCount != null && accommodation.likeCount > 0 && (
            <div className="mt-1.5 flex items-center gap-1">
              <Heart className="size-3.5 fill-rose-400 text-rose-400" />
              <span className="text-sm text-muted-foreground">
                {accommodation.likeCount.toLocaleString()}
              </span>
            </div>
          )}

          {/* Price */}
          <div className="mt-3 flex items-baseline gap-2">
            {accommodation.originalPrice && (
              <span className="text-sm text-muted-foreground line-through">
                {accommodation.originalPrice.toLocaleString()}원
              </span>
            )}
            <span className="text-lg font-bold text-foreground">
              {accommodation.price.toLocaleString()}원
            </span>
            {accommodation.priceLabel && (
              <span className="text-sm text-muted-foreground">
                {accommodation.priceLabel}
              </span>
            )}
          </div>
        </div>
      </article>
    </Link>
  )
}

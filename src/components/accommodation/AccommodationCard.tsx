"use client"

import Image from "next/image"
import Link from "next/link"
import { Star, Heart } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

export interface Accommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  tags?: string[]
  isSoldOut?: boolean
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
        {/* Image Container */}
        <div className="relative aspect-[4/3] overflow-hidden">
          <Image
            src={accommodation.imageUrl}
            alt={accommodation.name}
            fill
            priority={priority}
            className="object-cover transition-transform duration-500 group-hover:scale-105"
            sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, 25vw"
          />

          {/* Discount Badge */}
          {discount && (
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
              "bg-black/20 text-white backdrop-blur-sm",
              "hover:bg-black/30 hover:text-white"
            )}
            onClick={(e) => {
              e.preventDefault()
              // TODO: Add wishlist functionality
            }}
          >
            <Heart className="size-4" />
            <span className="sr-only">찜하기</span>
          </Button>
        </div>

        {/* Content */}
        <div className="p-4">
          {/* Tags */}
          {accommodation.tags && accommodation.tags.length > 0 && (
            <div className="mb-2 flex flex-wrap gap-1">
              {accommodation.tags.slice(0, 2).map((tag) => (
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
          <p className="mt-0.5 text-sm text-muted-foreground">
            {accommodation.location}
          </p>

          {/* Rating */}
          <div className="mt-2 flex items-center gap-1">
            <Star className="size-4 fill-primary text-primary" />
            <span className="text-sm font-medium">{accommodation.rating}</span>
            <span className="text-sm text-muted-foreground">
              ({accommodation.reviewCount.toLocaleString()})
            </span>
          </div>

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
            <span className="text-sm text-muted-foreground">/박</span>
          </div>
        </div>
      </article>
    </Link>
  )
}

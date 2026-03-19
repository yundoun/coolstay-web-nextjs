"use client"

import Image from "next/image"
import Link from "next/link"
import { Users, AlertCircle } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import type { Room } from "../types"

interface RoomCardProps {
  room: Room
  accommodationId: string
}

export function RoomCard({ room, accommodationId }: RoomCardProps) {
  const discount = room.originalPrice
    ? Math.round(
        ((room.originalPrice - room.price) / room.originalPrice) * 100
      )
    : null

  return (
    <div
      className={cn(
        "flex flex-col sm:flex-row gap-4 p-4 rounded-2xl border bg-card",
        "transition-all duration-300",
        room.isAvailable
          ? "hover:shadow-lg hover:border-primary/30"
          : "opacity-60"
      )}
    >
      {/* Image */}
      <div className="relative w-full sm:w-48 md:w-56 aspect-[4/3] sm:aspect-auto sm:h-40 rounded-xl overflow-hidden shrink-0">
        <Image
          src={room.imageUrl}
          alt={room.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, 224px"
        />
        {!room.isAvailable && (
          <div className="absolute inset-0 bg-black/60 flex items-center justify-center">
            <span className="text-white font-bold text-lg">매진</span>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="flex-1 min-w-0 flex flex-col justify-between">
        <div>
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            {room.isAvailable && room.remainingCount <= 3 && (
              <Badge variant="destructive" className="shrink-0 text-xs">
                <AlertCircle className="size-3 mr-1" />
                {room.remainingCount}실 남음
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
            {room.description}
          </p>

          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>최대 {room.maxGuests}인</span>
            </div>
          </div>

          {/* Keywords */}
          <div className="mt-2 flex flex-wrap gap-1">
            {room.keywords.map((keyword) => (
              <Badge key={keyword} variant="outline" className="text-xs">
                {keyword}
              </Badge>
            ))}
          </div>
        </div>

        {/* Price & Book */}
        <div className="mt-4 flex items-end justify-between">
          <div>
            {room.originalPrice && (
              <div className="flex items-center gap-2">
                <span className="text-xs text-muted-foreground line-through">
                  {room.originalPrice.toLocaleString()}원
                </span>
                {discount && (
                  <span className="text-xs font-bold text-rose-500">
                    {discount}%
                  </span>
                )}
              </div>
            )}
            <div className="flex items-baseline gap-1">
              <span className="text-xl font-bold">
                {room.price.toLocaleString()}
              </span>
              <span className="text-sm text-muted-foreground">원/박</span>
            </div>
          </div>

          <Button
            disabled={!room.isAvailable}
            asChild={room.isAvailable}
          >
            {room.isAvailable ? (
              <Link href={`/booking/${accommodationId}?room=${room.id}`}>
                예약하기
              </Link>
            ) : (
              "매진"
            )}
          </Button>
        </div>
      </div>
    </div>
  )
}

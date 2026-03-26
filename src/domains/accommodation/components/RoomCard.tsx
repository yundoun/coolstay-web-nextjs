"use client"

import Image from "next/image"
import { Users, AlertCircle, Clock, Moon, ChevronRight } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { Room } from "../types"

interface RoomCardProps {
  room: Room
  accommodationId?: string
  onDetailClick?: (room: Room) => void
}

export function RoomCard({ room, onDetailClick }: RoomCardProps) {
  return (
    <div
      className={cn(
        "rounded-xl border bg-card overflow-hidden",
        "transition-all duration-300",
        room.isAvailable
          ? "hover:shadow-lg hover:border-primary/30 cursor-pointer"
          : "opacity-60"
      )}
      onClick={() => onDetailClick?.(room)}
    >
      <div className="flex flex-col sm:flex-row gap-0 sm:gap-4 p-0 sm:p-4">
        {/* Image */}
        <div className="relative w-full sm:w-48 md:w-56 aspect-[16/9] sm:aspect-auto sm:h-44 rounded-none sm:rounded-xl overflow-hidden shrink-0">
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
        <div className="flex-1 min-w-0 p-4 sm:p-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-lg">{room.name}</h3>
            {room.isAvailable && room.remainingCount <= 3 && room.remainingCount > 0 && (
              <Badge variant="destructive" className="shrink-0 text-xs">
                <AlertCircle className="size-3 mr-1" />
                {room.remainingCount}실 남음
              </Badge>
            )}
          </div>

          <p className="mt-1 text-sm text-muted-foreground line-clamp-1">
            {room.description}
          </p>

          <div className="mt-2 flex items-center gap-3 text-sm text-muted-foreground">
            <div className="flex items-center gap-1">
              <Users className="size-4" />
              <span>최대 {room.maxGuests}인</span>
            </div>
          </div>

          {/* Keywords */}
          {room.keywords.length > 0 && (
            <div className="mt-2 flex flex-wrap gap-1">
              {room.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          {/* 대실/숙박 가격 + 상세보기 유도 */}
          <div className="mt-4 flex items-end justify-between gap-3">
            <div className="flex flex-col sm:flex-row gap-3 flex-1">
              {/* 대실 */}
              {room.rentalAvailable && room.rentalPrice && (
                <div className="flex items-center gap-1.5">
                  <Clock className="size-3 text-muted-foreground" />
                  <span className="text-xs text-muted-foreground">대실</span>
                  {room.rentalOriginalPrice && (
                    <span className="text-xs text-muted-foreground line-through">
                      {room.rentalOriginalPrice.toLocaleString()}
                    </span>
                  )}
                  <span className="text-sm font-bold">
                    {room.rentalPrice.toLocaleString()}원
                  </span>
                </div>
              )}

              {/* 숙박 */}
              <div className="flex items-center gap-1.5">
                <Moon className="size-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">숙박</span>
                {room.stayOriginalPrice && (
                  <span className="text-xs text-muted-foreground line-through">
                    {room.stayOriginalPrice.toLocaleString()}
                  </span>
                )}
                <span className="text-sm font-bold">
                  {room.stayPrice.toLocaleString()}원
                </span>
              </div>
            </div>

            <ChevronRight className="size-5 text-muted-foreground shrink-0" />
          </div>
        </div>
      </div>
    </div>
  )
}

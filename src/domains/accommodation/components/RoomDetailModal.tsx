"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  ChevronLeft,
  ChevronRight,
  Clock,
  Moon,
  Users,
  X,
  FileText,
} from "lucide-react"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { cn } from "@/lib/utils"
import type { Room } from "../types"

interface RoomDetailModalProps {
  room: Room | null
  accommodationId: string
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function RoomDetailModal({
  room,
  accommodationId,
  open,
  onOpenChange,
}: RoomDetailModalProps) {
  const [currentImage, setCurrentImage] = useState(0)

  if (!room) return null

  const images = room.images.length > 0 ? room.images : [room.imageUrl]

  const goToImage = (index: number) => {
    setCurrentImage(Math.max(0, Math.min(index, images.length - 1)))
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto p-0 gap-0">
        {/* Image Carousel */}
        <div className="relative aspect-[16/10] overflow-hidden bg-muted">
          <Image
            src={images[currentImage]}
            alt={`${room.name} 이미지 ${currentImage + 1}`}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, 512px"
          />

          {images.length > 1 && (
            <>
              <Button
                variant="ghost"
                size="icon"
                className="absolute left-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                onClick={() => goToImage(currentImage - 1)}
                disabled={currentImage === 0}
              >
                <ChevronLeft className="size-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 -translate-y-1/2 size-8 rounded-full bg-black/30 text-white hover:bg-black/50 hover:text-white"
                onClick={() => goToImage(currentImage + 1)}
                disabled={currentImage === images.length - 1}
              >
                <ChevronRight className="size-5" />
              </Button>
            </>
          )}

          {/* Image counter */}
          <div className="absolute bottom-3 left-1/2 -translate-x-1/2 flex gap-1.5">
            {images.map((_, index) => (
              <button
                key={index}
                onClick={() => goToImage(index)}
                className={cn(
                  "size-2 rounded-full transition-all",
                  index === currentImage
                    ? "bg-white w-5"
                    : "bg-white/50 hover:bg-white/70"
                )}
              />
            ))}
          </div>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <DialogHeader className="p-0">
            <DialogTitle className="text-xl">{room.name}</DialogTitle>
            <p className="text-sm text-muted-foreground mt-1">
              {room.description}
            </p>
          </DialogHeader>

          {/* Capacity */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <Users className="size-4" />
            <span>최대 {room.maxGuests}인</span>
          </div>

          {/* Keywords */}
          {room.keywords.length > 0 && (
            <div className="flex flex-wrap gap-1.5">
              {room.keywords.map((keyword) => (
                <Badge key={keyword} variant="outline" className="text-xs">
                  {keyword}
                </Badge>
              ))}
            </div>
          )}

          <Separator />

          {/* Rental (대실) Info */}
          {room.rentalAvailable && room.rentalPrice && (
            <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
              <div className="flex items-center gap-2">
                <Clock className="size-4 text-muted-foreground" />
                <span className="font-medium text-sm">대실</span>
                {room.rentalTime && (
                  <span className="text-xs text-muted-foreground">
                    ({room.rentalTime})
                  </span>
                )}
              </div>
              <div className="flex items-baseline gap-2">
                {room.rentalOriginalPrice && (
                  <span className="text-sm text-muted-foreground line-through">
                    {room.rentalOriginalPrice.toLocaleString()}원
                  </span>
                )}
                <span className="text-lg font-bold">
                  {room.rentalPrice.toLocaleString()}원
                </span>
                {room.rentalOriginalPrice && (
                  <Badge variant="destructive" className="text-xs">
                    {Math.round(
                      ((room.rentalOriginalPrice - room.rentalPrice) /
                        room.rentalOriginalPrice) *
                        100
                    )}
                    % OFF
                  </Badge>
                )}
              </div>
            </div>
          )}

          {/* Stay (숙박) Info */}
          <div className="p-4 rounded-xl bg-muted/50 border space-y-2">
            <div className="flex items-center gap-2">
              <Moon className="size-4 text-muted-foreground" />
              <span className="font-medium text-sm">숙박</span>
            </div>
            <div className="flex items-baseline gap-2">
              {room.stayOriginalPrice && (
                <span className="text-sm text-muted-foreground line-through">
                  {room.stayOriginalPrice.toLocaleString()}원
                </span>
              )}
              <span className="text-lg font-bold">
                {room.stayPrice.toLocaleString()}원
              </span>
              {room.stayOriginalPrice && (
                <Badge variant="destructive" className="text-xs">
                  {Math.round(
                    ((room.stayOriginalPrice - room.stayPrice) /
                      room.stayOriginalPrice) *
                      100
                  )}
                  % OFF
                </Badge>
              )}
            </div>
          </div>

          {/* Amenities */}
          {room.amenities.length > 0 && (
            <>
              <Separator />
              <div>
                <h4 className="text-sm font-semibold mb-2">편의시설</h4>
                <div className="flex flex-wrap gap-2">
                  {room.amenities.map((amenity) => (
                    <Badge
                      key={amenity}
                      variant="secondary"
                      className="text-xs"
                    >
                      {amenity}
                    </Badge>
                  ))}
                </div>
              </div>
            </>
          )}

          {/* Cancel Policy Link */}
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <FileText className="size-4" />
            <span>취소/환불 규정은 숙소 정보에서 확인해 주세요.</span>
          </div>

          <Separator />

          {/* Action Buttons */}
          <div className="flex gap-3">
            {room.rentalAvailable && room.rentalPrice && (
              <Button
                variant="outline"
                className="flex-1 gap-2"
                disabled={!room.isAvailable}
                asChild={room.isAvailable}
              >
                {room.isAvailable ? (
                  <Link
                    href={`/booking/${accommodationId}?room=${room.id}&type=rental`}
                  >
                    <Clock className="size-4" />
                    대실 예약
                  </Link>
                ) : (
                  <span>매진</span>
                )}
              </Button>
            )}
            <Button
              className="flex-1 gap-2"
              disabled={!room.stayAvailable}
              asChild={room.stayAvailable}
            >
              {room.stayAvailable ? (
                <Link
                  href={`/booking/${accommodationId}?room=${room.id}&type=stay`}
                >
                  <Moon className="size-4" />
                  숙박 예약
                </Link>
              ) : (
                <span>매진</span>
              )}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}

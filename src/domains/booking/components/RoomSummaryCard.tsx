import Image from "next/image"
import { Clock, Moon, MapPin } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import type { BookingContext } from "../types"

interface RoomSummaryCardProps {
  context: BookingContext
}

export function RoomSummaryCard({ context }: RoomSummaryCardProps) {
  const isRental = context.bookingType === "rental"

  return (
    <div className="flex gap-4 p-4 rounded-xl border bg-card">
      <div className="relative w-28 h-20 rounded-lg overflow-hidden shrink-0">
        <Image
          src={context.room.imageUrl}
          alt={context.room.name}
          fill
          className="object-cover"
          sizes="112px"
        />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-center gap-2 mb-1">
          <Badge variant={isRental ? "outline" : "default"} className="text-xs">
            {isRental ? (
              <><Clock className="size-3 mr-1" />대실</>
            ) : (
              <><Moon className="size-3 mr-1" />숙박</>
            )}
          </Badge>
          {context.usageTime && (
            <span className="text-xs text-muted-foreground">{context.usageTime}</span>
          )}
        </div>
        <h3 className="font-semibold truncate">{context.room.name}</h3>
        <div className="flex items-center gap-1 mt-1 text-sm text-muted-foreground">
          <MapPin className="size-3.5" />
          <span className="truncate">{context.accommodation.name}</span>
        </div>
        <div className="mt-2 flex items-baseline gap-2">
          {context.originalPrice && (
            <span className="text-sm text-muted-foreground line-through">
              {context.originalPrice.toLocaleString()}원
            </span>
          )}
          <span className="text-lg font-bold">
            {context.price.toLocaleString()}원
          </span>
        </div>
      </div>
    </div>
  )
}

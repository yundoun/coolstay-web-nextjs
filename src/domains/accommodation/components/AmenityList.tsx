"use client"

import {
  Wifi,
  ParkingCircle,
  Waves,
  Utensils,
  Sparkles,
  Dumbbell,
  Coffee,
  Tv,
  Check,
  X,
} from "lucide-react"
import { cn } from "@/lib/utils"
import type { AmenityItem } from "../types"

const iconMap: Record<string, React.ElementType> = {
  wifi: Wifi,
  parking: ParkingCircle,
  pool: Waves,
  breakfast: Utensils,
  spa: Sparkles,
  fitness: Dumbbell,
  lounge: Coffee,
  vod: Tv,
}

interface AmenityListProps {
  amenities: AmenityItem[]
}

export function AmenityList({ amenities }: AmenityListProps) {
  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">편의시설</h2>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {amenities.map((amenity) => {
          const Icon = iconMap[amenity.icon] || Sparkles

          return (
            <div
              key={amenity.id}
              className={cn(
                "flex items-center gap-3 p-3 rounded-xl border",
                amenity.available
                  ? "bg-card border-border"
                  : "bg-muted/30 border-border/50 opacity-50"
              )}
            >
              <Icon className="size-5 text-primary shrink-0" />
              <span className="text-sm">{amenity.name}</span>
              {amenity.available ? (
                <Check className="size-4 text-success ml-auto shrink-0" />
              ) : (
                <X className="size-4 text-muted-foreground ml-auto shrink-0" />
              )}
            </div>
          )
        })}
      </div>
    </div>
  )
}

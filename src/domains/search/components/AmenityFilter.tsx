"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FilterSection } from "./FilterSection"
import { amenityOptions } from "../data/filterOptions"

interface AmenityFilterProps {
  selectedAmenities: string[]
  onToggle: (amenity: string) => void
}

export function AmenityFilter({
  selectedAmenities,
  onToggle,
}: AmenityFilterProps) {
  return (
    <FilterSection title="편의시설">
      <div className="grid grid-cols-2 gap-3">
        {amenityOptions.map((amenity) => {
          const Icon = amenity.icon
          return (
            <div key={amenity.value} className="flex items-center space-x-2">
              <Checkbox
                id={`amenity-${amenity.value}`}
                checked={selectedAmenities.includes(amenity.value)}
                onCheckedChange={() => onToggle(amenity.value)}
              />
              <Label
                htmlFor={`amenity-${amenity.value}`}
                className="flex cursor-pointer items-center gap-1.5 text-sm font-normal"
              >
                {Icon && <Icon className="size-3.5 text-muted-foreground" />}
                <span>{amenity.label}</span>
              </Label>
            </div>
          )
        })}
      </div>
    </FilterSection>
  )
}

"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FilterSection } from "./FilterSection"
import { accommodationTypeOptions } from "../data/filterOptions"

interface AccommodationTypeFilterProps {
  selectedTypes: string[]
  onToggle: (type: string) => void
}

export function AccommodationTypeFilter({
  selectedTypes,
  onToggle,
}: AccommodationTypeFilterProps) {
  return (
    <FilterSection title="숙소 유형">
      <div className="space-y-3">
        {accommodationTypeOptions.map((type) => {
          const Icon = type.icon
          return (
            <div key={type.value} className="flex items-center space-x-2">
              <Checkbox
                id={`type-${type.value}`}
                checked={selectedTypes.includes(type.value)}
                onCheckedChange={() => onToggle(type.value)}
              />
              <Label
                htmlFor={`type-${type.value}`}
                className="flex cursor-pointer items-center gap-2 text-sm font-normal"
              >
                <Icon className="size-4 text-muted-foreground" />
                <span>{type.label}</span>
              </Label>
            </div>
          )
        })}
      </div>
    </FilterSection>
  )
}

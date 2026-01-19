"use client"

import { Star } from "lucide-react"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Label } from "@/components/ui/label"
import { FilterSection } from "./FilterSection"
import { ratingOptions } from "../data/filterOptions"

interface RatingFilterProps {
  selectedRating: string | null
  onChange: (rating: string | null) => void
}

export function RatingFilter({ selectedRating, onChange }: RatingFilterProps) {
  return (
    <FilterSection title="평점">
      <RadioGroup
        value={selectedRating || ""}
        onValueChange={(value) => onChange(value || null)}
      >
        <div className="space-y-3">
          {ratingOptions.map((option) => (
            <div key={option.value} className="flex items-center space-x-2">
              <RadioGroupItem
                value={option.value}
                id={`rating-${option.value}`}
              />
              <Label
                htmlFor={`rating-${option.value}`}
                className="flex cursor-pointer items-center gap-1.5 text-sm font-normal"
              >
                <Star className="size-3.5 fill-primary text-primary" />
                <span>{option.label}</span>
              </Label>
            </div>
          ))}
        </div>
      </RadioGroup>
    </FilterSection>
  )
}

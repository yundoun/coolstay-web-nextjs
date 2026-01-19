"use client"

import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { FilterSection } from "./FilterSection"
import { regionOptions } from "../data/filterOptions"

interface RegionFilterProps {
  selectedRegions: string[]
  onToggle: (region: string) => void
}

export function RegionFilter({ selectedRegions, onToggle }: RegionFilterProps) {
  return (
    <FilterSection title="지역">
      <div className="space-y-3">
        {regionOptions.map((region) => (
          <div key={region.value} className="flex items-center space-x-2">
            <Checkbox
              id={`region-${region.value}`}
              checked={selectedRegions.includes(region.value)}
              onCheckedChange={() => onToggle(region.value)}
            />
            <Label
              htmlFor={`region-${region.value}`}
              className="flex flex-1 cursor-pointer items-center justify-between text-sm font-normal"
            >
              <span>{region.label}</span>
              {region.accommodationCount && (
                <span className="text-muted-foreground">
                  {region.accommodationCount.toLocaleString()}
                </span>
              )}
            </Label>
          </div>
        ))}
      </div>
    </FilterSection>
  )
}

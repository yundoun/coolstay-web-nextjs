"use client"

import { useState, useEffect } from "react"
import { Slider } from "@/components/ui/slider"
import { FilterSection } from "./FilterSection"
import { PRICE_RANGE } from "../types"

interface PriceRangeFilterProps {
  minPrice: number
  maxPrice: number
  onChange: (minPrice: number, maxPrice: number) => void
}

export function PriceRangeFilter({
  minPrice,
  maxPrice,
  onChange,
}: PriceRangeFilterProps) {
  // 로컬 상태로 슬라이더 값 관리 (드래그 중 실시간 업데이트용)
  const [localRange, setLocalRange] = useState([minPrice, maxPrice])

  // props가 변경되면 로컬 상태 업데이트
  useEffect(() => {
    setLocalRange([minPrice, maxPrice])
  }, [minPrice, maxPrice])

  const formatPrice = (price: number) => {
    if (price >= 1000000) {
      return `${(price / 10000).toLocaleString()}만원`
    }
    return `${price.toLocaleString()}원`
  }

  return (
    <FilterSection title="가격">
      <div className="space-y-4 px-1">
        <Slider
          value={localRange}
          min={PRICE_RANGE.min}
          max={PRICE_RANGE.max}
          step={PRICE_RANGE.step}
          onValueChange={setLocalRange}
          onValueCommit={(value) => onChange(value[0], value[1])}
        />
        <div className="flex items-center justify-between text-sm">
          <span className="text-muted-foreground">
            {formatPrice(localRange[0])}
          </span>
          <span className="text-muted-foreground">
            {formatPrice(localRange[1])}
          </span>
        </div>
      </div>
    </FilterSection>
  )
}

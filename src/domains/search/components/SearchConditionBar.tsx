"use client"

import { useState } from "react"
import { CalendarDays, Users, MapPin, Minus, Plus } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { cn } from "@/lib/utils"
import { regionOptions } from "../data/filterOptions"

interface SearchConditionBarProps {
  selectedRegion: string | null
  onRegionChange: (region: string) => void
  checkIn: string
  checkOut: string
  adults: number
  kids: number
  onDateChange: (checkIn: string, checkOut: string) => void
  onGuestChange: (adults: number, kids: number) => void
}

export function SearchConditionBar({
  selectedRegion,
  onRegionChange,
  checkIn,
  checkOut,
  adults,
  kids,
  onDateChange,
  onGuestChange,
}: SearchConditionBarProps) {
  const regionLabel =
    regionOptions.find((r) => r.value === selectedRegion)?.label || "전체"

  const guestLabel =
    kids > 0 ? `성인 ${adults} 아동 ${kids}` : `성인 ${adults}`

  return (
    <div className="flex flex-wrap items-center gap-2 py-4">
      {/* Region Quick Select */}
      <Popover>
        <PopoverTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className={cn(
              "gap-1.5 rounded-full",
              selectedRegion && "border-primary text-primary"
            )}
          >
            <MapPin className="size-3.5" />
            {regionLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-3" align="start">
          <p className="text-sm font-medium mb-2">지역 선택</p>
          <div className="grid grid-cols-4 gap-1.5">
            {regionOptions.map((region) => (
              <button
                key={region.value}
                onClick={() => onRegionChange(region.value)}
                className={cn(
                  "px-2 py-2 text-xs rounded-lg transition-colors text-center",
                  selectedRegion === region.value
                    ? "bg-primary text-primary-foreground font-medium"
                    : "hover:bg-muted text-muted-foreground"
                )}
              >
                {region.label}
              </button>
            ))}
          </div>
        </PopoverContent>
      </Popover>

      {/* Date Select */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
            <CalendarDays className="size-3.5" />
            <span>
              {checkIn} ~ {checkOut}
            </span>
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-72 p-4" align="start">
          <p className="text-sm font-medium mb-3">날짜 선택</p>
          <div className="space-y-3">
            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs text-muted-foreground">체크인</label>
                <input
                  type="date"
                  value={checkIn}
                  onChange={(e) => onDateChange(e.target.value, checkOut)}
                  className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-background"
                />
              </div>
              <div>
                <label className="text-xs text-muted-foreground">체크아웃</label>
                <input
                  type="date"
                  value={checkOut}
                  onChange={(e) => onDateChange(checkIn, e.target.value)}
                  className="w-full mt-1 px-3 py-2 text-sm border rounded-lg bg-background"
                />
              </div>
            </div>
          </div>
        </PopoverContent>
      </Popover>

      {/* Guest Count */}
      <Popover>
        <PopoverTrigger asChild>
          <Button variant="outline" size="sm" className="gap-1.5 rounded-full">
            <Users className="size-3.5" />
            {guestLabel}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-64 p-4" align="start">
          <p className="text-sm font-medium mb-3">인원 선택</p>
          <div className="space-y-4">
            <GuestCounter
              label="성인"
              count={adults}
              min={1}
              max={10}
              onChange={(count) => onGuestChange(count, kids)}
            />
            <GuestCounter
              label="아동"
              count={kids}
              min={0}
              max={5}
              onChange={(count) => onGuestChange(adults, count)}
            />
          </div>
        </PopoverContent>
      </Popover>
    </div>
  )
}

function GuestCounter({
  label,
  count,
  min,
  max,
  onChange,
}: {
  label: string
  count: number
  min: number
  max: number
  onChange: (count: number) => void
}) {
  return (
    <div className="flex items-center justify-between">
      <span className="text-sm">{label}</span>
      <div className="flex items-center gap-3">
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={count <= min}
          onClick={() => onChange(count - 1)}
        >
          <Minus className="size-3" />
        </Button>
        <span className="w-6 text-center text-sm font-medium">{count}</span>
        <Button
          variant="outline"
          size="icon"
          className="size-8 rounded-full"
          disabled={count >= max}
          onClick={() => onChange(count + 1)}
        >
          <Plus className="size-3" />
        </Button>
      </div>
    </div>
  )
}

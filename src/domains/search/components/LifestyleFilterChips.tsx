"use client"

import { useRef } from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { lifestyleFilters } from "../data/lifestyleFilters"

interface LifestyleFilterChipsProps {
  selectedFilters: string[]
  onToggle: (value: string) => void
}

export function LifestyleFilterChips({
  selectedFilters,
  onToggle,
}: LifestyleFilterChipsProps) {
  const scrollRef = useRef<HTMLDivElement>(null)

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      const scrollAmount = 200
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth",
      })
    }
  }

  return (
    <div className="relative group">
      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute left-0 top-1/2 -translate-y-1/2 z-10",
          "hidden md:flex",
          "size-8 rounded-full",
          "bg-background/80 backdrop-blur-sm shadow-md",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "-translate-x-4"
        )}
        onClick={() => scroll("left")}
      >
        <ChevronLeft className="size-4" />
      </Button>

      <Button
        variant="ghost"
        size="icon"
        className={cn(
          "absolute right-0 top-1/2 -translate-y-1/2 z-10",
          "hidden md:flex",
          "size-8 rounded-full",
          "bg-background/80 backdrop-blur-sm shadow-md",
          "opacity-0 group-hover:opacity-100 transition-opacity",
          "translate-x-4"
        )}
        onClick={() => scroll("right")}
      >
        <ChevronRight className="size-4" />
      </Button>

      <div
        ref={scrollRef}
        className={cn(
          "flex gap-2 overflow-x-auto scrollbar-hide",
          "pb-2 -mb-2",
          "scroll-smooth snap-x snap-mandatory"
        )}
      >
        {lifestyleFilters.map((filter) => {
          const isSelected = selectedFilters.includes(filter.value)

          return (
            <button
              key={filter.value}
              onClick={() => onToggle(filter.value)}
              className={cn(
                "flex items-center gap-2 px-4 py-2.5 rounded-full",
                "whitespace-nowrap snap-start",
                "text-sm font-medium",
                "transition-all duration-300",
                "border",
                isSelected
                  ? [
                      "bg-primary text-primary-foreground",
                      "border-primary",
                      "shadow-lg shadow-primary/25",
                      "scale-105",
                    ]
                  : [
                      "bg-background/80 backdrop-blur-sm",
                      "border-border",
                      "hover:border-primary/50 hover:bg-primary/5",
                      "hover:shadow-md",
                    ]
              )}
            >
              <span className="text-base">{filter.icon}</span>
              <span>{filter.label}</span>
            </button>
          )
        })}
      </div>

      <div className="absolute right-0 top-0 bottom-2 w-12 bg-gradient-to-l from-background to-transparent pointer-events-none hidden md:block" />
      <div className="absolute left-0 top-0 bottom-2 w-12 bg-gradient-to-r from-background to-transparent pointer-events-none hidden md:block" />
    </div>
  )
}

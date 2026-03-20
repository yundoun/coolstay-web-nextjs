"use client"

import Link from "next/link"
import { cn } from "@/lib/utils"
import { businessTypes } from "../data/mock"

export function BusinessTypeGrid() {
  return (
    <div className="grid grid-cols-4 sm:grid-cols-8 gap-2">
      {businessTypes.map((type) => (
        <Link
          key={type.code}
          href={type.href}
          className={cn(
            "flex flex-col items-center gap-2 py-3 px-2 rounded-xl",
            "transition-all duration-200",
            "hover:bg-muted hover:shadow-sm hover:-translate-y-0.5"
          )}
        >
          <span className="text-2xl md:text-3xl">{type.emoji}</span>
          <span className="text-xs font-medium text-muted-foreground">
            {type.label}
          </span>
        </Link>
      ))}
    </div>
  )
}

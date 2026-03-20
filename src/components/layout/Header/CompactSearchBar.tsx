"use client"

import Link from "next/link"
import { Search, MapPin, CalendarDays, Users } from "lucide-react"
import { cn } from "@/lib/utils"

export function CompactSearchBar() {
  return (
    <Link
      href="/search"
      className={cn(
        "w-full flex items-center gap-0 px-1.5 py-1.5",
        "bg-muted/80 hover:bg-muted rounded-full",
        "border border-border/50 hover:border-border",
        "shadow-sm hover:shadow-md",
        "transition-all duration-300"
      )}
    >
      <PillItem icon={MapPin} label="어디로" />
      <Divider />
      <PillItem icon={CalendarDays} label="날짜" />
      <Divider />
      <PillItem icon={Users} label="인원" />

      <div className="shrink-0 flex items-center justify-center size-8 rounded-full bg-primary text-primary-foreground ml-1">
        <Search className="size-4" />
      </div>
    </Link>
  )
}

function PillItem({
  icon: Icon,
  label,
}: {
  icon: React.ElementType
  label: string
}) {
  return (
    <div className="flex-1 flex items-center justify-center gap-1.5 px-3 py-1">
      <Icon className="size-3.5 text-muted-foreground shrink-0" />
      <span className="text-sm text-muted-foreground">{label}</span>
    </div>
  )
}

function Divider() {
  return <span className="text-border/60 text-sm">|</span>
}

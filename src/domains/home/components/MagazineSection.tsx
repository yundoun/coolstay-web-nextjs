"use client"

import Image from "next/image"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { magazineItems } from "../data/mock"

export function MagazineSection() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      {magazineItems.map((item) => (
        <Link
          key={item.id}
          href={item.href}
          className={cn(
            "group rounded-2xl overflow-hidden border bg-card",
            "transition-all duration-300",
            "hover:shadow-lg hover:-translate-y-1"
          )}
        >
          <div className="relative aspect-[16/10] overflow-hidden">
            <Image
              src={item.imageUrl}
              alt={item.title}
              fill
              className="object-cover transition-transform duration-700 group-hover:scale-105"
              sizes="(max-width: 640px) 100vw, 33vw"
            />
          </div>
          <div className="p-4">
            <Badge variant="outline" className="text-xs mb-2">
              {item.category}
            </Badge>
            <h3 className="font-semibold line-clamp-1 group-hover:text-primary transition-colors">
              {item.title}
            </h3>
            <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
              {item.description}
            </p>
          </div>
        </Link>
      ))}
    </div>
  )
}

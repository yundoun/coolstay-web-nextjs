"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Clock, Star, MapPin, Pencil, Trash2, Search } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { recentViewedMock, wishlistMock } from "../data/mock"
import type { FavoriteAccommodation } from "../types"

type Tab = "recent" | "wishlist"

export function FavoritesPage() {
  const [tab, setTab] = useState<Tab>("recent")
  const [editMode, setEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())
  const [recentItems, setRecentItems] = useState(recentViewedMock)
  const [wishlistItems, setWishlistItems] = useState(wishlistMock)

  const currentItems = tab === "recent" ? recentItems : wishlistItems

  const toggleSelect = (id: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(id)) next.delete(id)
      else next.add(id)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === currentItems.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(currentItems.map((i) => i.id)))
    }
  }

  const deleteSelected = () => {
    if (tab === "recent") {
      setRecentItems((prev) => prev.filter((i) => !selectedIds.has(i.id)))
    } else {
      setWishlistItems((prev) => prev.filter((i) => !selectedIds.has(i.id)))
    }
    setSelectedIds(new Set())
    setEditMode(false)
  }

  const handleTabChange = (newTab: Tab) => {
    setTab(newTab)
    setEditMode(false)
    setSelectedIds(new Set())
  }

  return (
    <Container size="normal" padding="responsive" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">찜 / 최근본</h1>
        {currentItems.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={() => {
              setEditMode(!editMode)
              setSelectedIds(new Set())
            }}
          >
            <Pencil className="size-4 mr-1" />
            {editMode ? "완료" : "편집"}
          </Button>
        )}
      </div>

      {/* Tabs */}
      <div className="flex gap-1 mb-6 border-b">
        <TabButton
          active={tab === "recent"}
          onClick={() => handleTabChange("recent")}
          icon={<Clock className="size-3.5" />}
        >
          최근본
          <span className="ml-1.5 text-xs text-muted-foreground">{recentItems.length}</span>
        </TabButton>
        <TabButton
          active={tab === "wishlist"}
          onClick={() => handleTabChange("wishlist")}
          icon={<Heart className="size-3.5" />}
        >
          찜
          <span className="ml-1.5 text-xs text-muted-foreground">{wishlistItems.length}</span>
        </TabButton>
      </div>

      {/* Edit Mode Actions */}
      {editMode && currentItems.length > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/50">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={selectedIds.size === currentItems.length && currentItems.length > 0}
              onCheckedChange={selectAll}
            />
            <span className="text-sm">전체 선택</span>
          </label>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.size === 0}
            onClick={deleteSelected}
          >
            <Trash2 className="size-3.5 mr-1" />
            선택 삭제 ({selectedIds.size})
          </Button>
        </div>
      )}

      {/* Content */}
      {currentItems.length === 0 ? (
        <FavoritesEmptyState tab={tab} />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {currentItems.map((item) => (
            <AccommodationCard
              key={item.id}
              item={item}
              editMode={editMode}
              selected={selectedIds.has(item.id)}
              onToggle={() => toggleSelect(item.id)}
            />
          ))}
        </div>
      )}
    </Container>
  )
}

function TabButton({
  active,
  onClick,
  icon,
  children,
}: {
  active: boolean
  onClick: () => void
  icon: React.ReactNode
  children: React.ReactNode
}) {
  return (
    <button
      onClick={onClick}
      className={cn(
        "flex items-center gap-1.5 px-4 py-3 text-sm font-medium border-b-2 -mb-px transition-colors",
        active
          ? "border-primary text-primary"
          : "border-transparent text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {children}
    </button>
  )
}

function AccommodationCard({
  item,
  editMode,
  selected,
  onToggle,
}: {
  item: FavoriteAccommodation
  editMode: boolean
  selected: boolean
  onToggle: () => void
}) {
  const content = (
    <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3]">
        <Image
          src={item.imageUrl}
          alt={item.name}
          fill
          className="object-cover"
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
        />
        {editMode && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox checked={selected} onCheckedChange={onToggle} />
          </div>
        )}
        {item.tags && item.tags.length > 0 && (
          <div className="absolute bottom-2 left-2 flex gap-1">
            {item.tags.map((tag) => (
              <Badge key={tag} className="text-xs bg-black/60 text-white border-none">
                {tag}
              </Badge>
            ))}
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
        <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
          <MapPin className="size-3" />
          {item.location}
        </p>
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Star className="size-3.5 fill-yellow-400 text-yellow-400" />
            <span className="text-xs font-medium">{item.rating}</span>
            <span className="text-xs text-muted-foreground">({item.reviewCount.toLocaleString()})</span>
          </div>
          <div className="text-right">
            {item.originalPrice && (
              <span className="text-xs text-muted-foreground line-through mr-1">
                {item.originalPrice.toLocaleString()}
              </span>
            )}
            <span className="font-bold text-sm">{item.price.toLocaleString()}원</span>
          </div>
        </div>
      </div>
    </div>
  )

  if (editMode) {
    return (
      <button onClick={onToggle} className="text-left w-full">
        {content}
      </button>
    )
  }

  return (
    <Link href={`/accommodations/${item.id}`}>
      {content}
    </Link>
  )
}

function FavoritesEmptyState({ tab }: { tab: Tab }) {
  const config = tab === "recent"
    ? { icon: Clock, title: "최근 본 숙소가 없습니다", description: "다양한 숙소를 둘러보세요" }
    : { icon: Heart, title: "찜한 숙소가 없습니다", description: "마음에 드는 숙소를 찜해보세요" }

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={{ label: "숙소 둘러보기", href: "/search" }}
    />
  )
}

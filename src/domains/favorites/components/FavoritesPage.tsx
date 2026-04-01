"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Heart, Clock, Star, MapPin, Pencil, Trash2, Loader2 } from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { EmptyState } from "@/components/ui/empty-state"
import { Badge } from "@/components/ui/badge"
import { Checkbox } from "@/components/ui/checkbox"
import { cn } from "@/lib/utils"
import { useFavorites } from "../hooks/useFavorites"
import { useRecentViewed } from "../hooks/useRecentViewed"
import type { StoreItem } from "@/lib/api/types"
import type { RecentViewedItem } from "../types"

type Tab = "recent" | "wishlist"

export function FavoritesPage() {
  const [tab, setTab] = useState<Tab>("recent")
  const [editMode, setEditMode] = useState(false)
  const [selectedIds, setSelectedIds] = useState<Set<string>>(new Set())

  const {
    wishlistItems,
    isLoading: isFavoritesLoading,
    error: favoritesError,
    removeFavorites,
    isDeleting,
  } = useFavorites()

  const {
    recentItems,
    removeRecentItems,
  } = useRecentViewed()

  const currentItemKeys =
    tab === "wishlist"
      ? wishlistItems.map((i) => i.key)
      : recentItems.map((i) => i.key)

  const currentCount =
    tab === "wishlist" ? wishlistItems.length : recentItems.length

  const toggleSelect = (key: string) => {
    setSelectedIds((prev) => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectAll = () => {
    if (selectedIds.size === currentItemKeys.length) {
      setSelectedIds(new Set())
    } else {
      setSelectedIds(new Set(currentItemKeys))
    }
  }

  const deleteSelected = async () => {
    const keys = Array.from(selectedIds)
    if (tab === "wishlist") {
      await removeFavorites(keys)
    } else {
      removeRecentItems(keys)
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
        {currentCount > 0 && (
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
          <span className="ml-1.5 text-xs text-muted-foreground">
            {recentItems.length}
          </span>
        </TabButton>
        <TabButton
          active={tab === "wishlist"}
          onClick={() => handleTabChange("wishlist")}
          icon={<Heart className="size-3.5" />}
        >
          찜
          <span className="ml-1.5 text-xs text-muted-foreground">
            {wishlistItems.length}
          </span>
        </TabButton>
      </div>

      {/* Edit Mode Actions */}
      {editMode && currentCount > 0 && (
        <div className="flex items-center justify-between mb-4 p-3 rounded-lg bg-muted/50">
          <label className="flex items-center gap-2 cursor-pointer">
            <Checkbox
              checked={
                selectedIds.size === currentCount && currentCount > 0
              }
              onCheckedChange={selectAll}
            />
            <span className="text-sm">전체 선택</span>
          </label>
          <Button
            variant="destructive"
            size="sm"
            disabled={selectedIds.size === 0 || isDeleting}
            onClick={deleteSelected}
          >
            {isDeleting ? (
              <Loader2 className="size-3.5 mr-1 animate-spin" />
            ) : (
              <Trash2 className="size-3.5 mr-1" />
            )}
            선택 삭제 ({selectedIds.size})
          </Button>
        </div>
      )}

      {/* Content */}
      {tab === "wishlist" && isFavoritesLoading ? (
        <div className="flex items-center justify-center py-20">
          <Loader2 className="size-6 animate-spin text-muted-foreground" />
        </div>
      ) : tab === "wishlist" && favoritesError ? (
        <div className="text-center py-20 text-destructive">{favoritesError}</div>
      ) : currentCount === 0 ? (
        <FavoritesEmptyState tab={tab} />
      ) : tab === "wishlist" ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {wishlistItems.map((item) => (
            <WishlistCard
              key={item.key}
              item={item}
              editMode={editMode}
              selected={selectedIds.has(item.key)}
              onToggle={() => toggleSelect(item.key)}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {recentItems.map((item) => (
            <RecentCard
              key={item.key}
              item={item}
              editMode={editMode}
              selected={selectedIds.has(item.key)}
              onToggle={() => toggleSelect(item.key)}
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

/** 찜 목록 카드 — StoreItem 기반 */
function WishlistCard({
  item,
  editMode,
  selected,
  onToggle,
}: {
  item: StoreItem
  editMode: boolean
  selected: boolean
  onToggle: () => void
}) {
  const mainImage = item.images?.[0]?.url || item.images?.[0]?.thumb_url || ""
  const firstRoom = item.items?.[0]
  const price = firstRoom?.discount_price ?? firstRoom?.price ?? 0
  const originalPrice =
    firstRoom && firstRoom.price > (firstRoom.discount_price ?? firstRoom.price)
      ? firstRoom.price
      : undefined

  const content = (
    <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3]">
        {mainImage ? (
          <Image
            src={mainImage}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            이미지 없음
          </div>
        )}
        {editMode && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox checked={selected} onCheckedChange={onToggle} />
          </div>
        )}
        {item.user_like_yn === "Y" && !editMode && (
          <div className="absolute top-3 right-3">
            <Heart className="size-5 fill-red-500 text-red-500" />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
        {item.distance && (
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="size-3" />
            {item.distance}
          </p>
        )}
        <div className="flex items-center justify-between mt-2">
          <div className="flex items-center gap-1">
            <Heart className="size-3.5 text-red-400" />
            <span className="text-xs font-medium">{item.like_count}</span>
          </div>
          <div className="text-right">
            {originalPrice && (
              <span className="text-xs text-muted-foreground line-through mr-1">
                {originalPrice.toLocaleString()}
              </span>
            )}
            {price > 0 && (
              <span className="font-bold text-sm">
                {price.toLocaleString()}원
              </span>
            )}
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

  return <Link href={`/accommodations/${item.key}`}>{content}</Link>
}

/** 최근 본 숙소 카드 — RecentViewedItem 기반 */
function RecentCard({
  item,
  editMode,
  selected,
  onToggle,
}: {
  item: RecentViewedItem
  editMode: boolean
  selected: boolean
  onToggle: () => void
}) {
  const content = (
    <div className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
      <div className="relative aspect-[4/3]">
        {item.imageUrl ? (
          <Image
            src={item.imageUrl}
            alt={item.name}
            fill
            className="object-cover"
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full bg-muted flex items-center justify-center text-muted-foreground text-sm">
            이미지 없음
          </div>
        )}
        {editMode && (
          <div className="absolute top-3 left-3 z-10">
            <Checkbox checked={selected} onCheckedChange={onToggle} />
          </div>
        )}
      </div>
      <div className="p-3">
        <h3 className="font-semibold text-sm truncate">{item.name}</h3>
        <p className="text-xs text-muted-foreground mt-0.5">
          {new Date(item.viewedAt).toLocaleDateString("ko-KR")}에 봄
        </p>
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

  return <Link href={`/accommodations/${item.key}`}>{content}</Link>
}

function FavoritesEmptyState({ tab }: { tab: Tab }) {
  const config =
    tab === "recent"
      ? {
          icon: Clock,
          title: "최근 본 숙소가 없습니다",
          description: "다양한 숙소를 둘러보세요",
        }
      : {
          icon: Heart,
          title: "찜한 숙소가 없습니다",
          description: "마음에 드는 숙소를 찜해보세요",
        }

  return (
    <EmptyState
      icon={config.icon}
      title={config.title}
      description={config.description}
      action={{ label: "숙소 둘러보기", href: "/search" }}
    />
  )
}

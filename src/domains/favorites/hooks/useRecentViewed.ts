"use client"

import { useState, useCallback, useEffect } from "react"
import type { RecentViewedItem } from "../types"

const STORAGE_KEY = "recent_viewed"
const MAX_ITEMS = 20

function loadItems(): RecentViewedItem[] {
  if (typeof window === "undefined") return []
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return []
    const parsed = JSON.parse(raw)
    return Array.isArray(parsed) ? parsed : []
  } catch {
    return []
  }
}

function saveItems(items: RecentViewedItem[]) {
  if (typeof window === "undefined") return
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export function useRecentViewed() {
  const [recentItems, setRecentItems] = useState<RecentViewedItem[]>([])

  // 클라이언트 마운트 시 localStorage에서 로드
  useEffect(() => {
    setRecentItems(loadItems())
  }, [])

  const addRecentItem = useCallback(
    (item: Omit<RecentViewedItem, "viewedAt">) => {
      setRecentItems((prev) => {
        // 이미 존재하면 제거 후 맨 앞에 추가
        const filtered = prev.filter((i) => i.key !== item.key)
        const newItem: RecentViewedItem = { ...item, viewedAt: Date.now() }
        const updated = [newItem, ...filtered].slice(0, MAX_ITEMS)
        saveItems(updated)
        return updated
      })
    },
    []
  )

  const removeRecentItem = useCallback((key: string) => {
    setRecentItems((prev) => {
      const updated = prev.filter((i) => i.key !== key)
      saveItems(updated)
      return updated
    })
  }, [])

  const removeRecentItems = useCallback((keys: string[]) => {
    const keySet = new Set(keys)
    setRecentItems((prev) => {
      const updated = prev.filter((i) => !keySet.has(i.key))
      saveItems(updated)
      return updated
    })
  }, [])

  const clearRecent = useCallback(() => {
    setRecentItems([])
    saveItems([])
  }, [])

  return {
    recentItems,
    addRecentItem,
    removeRecentItem,
    removeRecentItems,
    clearRecent,
  }
}

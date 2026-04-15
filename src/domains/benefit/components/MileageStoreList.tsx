"use client"

import { Coins } from "lucide-react"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { ErrorState } from "@/components/ui/error-state"
import { EmptyState } from "@/components/ui/empty-state"
import { useMileageStores } from "../hooks/useMileageStores"
import { MileageStoreCard } from "./MileageStoreCard"

export function MileageStoreList() {
  const { stores, isLoading, error } = useMileageStores()

  if (isLoading) return <LoadingSpinner />
  if (error) return <ErrorState message={error} />

  if (stores.length === 0) {
    return (
      <EmptyState
        icon={Coins}
        title="마일리지 적립 내역이 없습니다"
        description="숙소 예약 시 마일리지가 적립됩니다"
        action={{ label: "숙소 찾기", href: "/search" }}
      />
    )
  }

  return (
    <div className="space-y-3">
      <p className="text-sm text-muted-foreground">
        마일리지 적립 제휴점{" "}
        <span className="font-semibold text-foreground">{stores.length}</span>개
      </p>
      {stores.map((store) => (
        <MileageStoreCard key={store.key} store={store} />
      ))}
    </div>
  )
}

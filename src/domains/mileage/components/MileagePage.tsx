"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import {
  Coins,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  ArrowLeft,
  MapPin,
  Home,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { cn } from "@/lib/utils"
import { useMileageDetail } from "../hooks/useMileage"

export function MileagePage() {
  const [selectedStore, setSelectedStore] = useState<string | null>(null)
  // TODO: 마일리지 목록 API가 없어서 상세 조회만 가능
  // 숙소별 목록은 마이페이지 API 연동 후 store_key 목록을 가져와야 함
  const { data: mileageData, isLoading } = useMileageDetail(selectedStore || undefined)
  const summary = {
    currentBalance: mileageData?.amount ?? 0,
    totalEarned: mileageData?.total_amount ?? 0,
    expiringAmount: mileageData?.expire_amount ?? 0,
  }
  const stores: { id: string; name: string }[] = [] // 목록 API 연동 전까지 빈 배열

  const activeStore = stores.find((s) => s.id === selectedStore)

  if (stores.length === 0) {
    return (
      <Container size="normal" padding="responsive" className="py-8">
        <h1 className="text-2xl font-bold mb-6">마일리지</h1>
        <EmptyState />
      </Container>
    )
  }

  return (
    <Container size="normal" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">마일리지</h1>

      {/* Summary Card */}
      <div className="rounded-xl border bg-gradient-to-br from-primary/5 to-primary/10 p-5">
        <div className="flex items-center gap-2 mb-3">
          <Coins className="size-5 text-primary" />
          <span className="text-sm font-medium text-muted-foreground">보유 마일리지</span>
        </div>
        <p className="text-3xl font-bold text-primary">
          {summary.currentBalance.toLocaleString()}
          <span className="text-base font-normal text-muted-foreground ml-1">P</span>
        </p>
        <div className="flex gap-6 mt-4 pt-3 border-t border-primary/10">
          <div>
            <p className="text-xs text-muted-foreground flex items-center gap-1">
              <TrendingUp className="size-3" />
              총 누적
            </p>
            <p className="text-sm font-semibold mt-0.5">
              {summary.totalEarned.toLocaleString()}P
            </p>
          </div>
          {summary.expiringAmount > 0 && (
            <div>
              <p className="text-xs text-red-500 flex items-center gap-1">
                <AlertTriangle className="size-3" />
                소멸 예정
              </p>
              <p className="text-sm font-semibold mt-0.5 text-red-500">
                {summary.expiringAmount.toLocaleString()}P
                {summary.expiringDate && (
                  <span className="text-xs font-normal text-muted-foreground ml-1">
                    ({summary.expiringDate})
                  </span>
                )}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Store Mileage List */}
      <div className="mt-6">
        <h2 className="font-semibold mb-3">매장별 마일리지</h2>

        {activeStore ? (
          <StoreDetail store={activeStore} onBack={() => setSelectedStore(null)} />
        ) : (
          <div className="space-y-3">
            {stores.map((store) => (
              <StoreCard
                key={store.id}
                store={store}
                onClick={() => setSelectedStore(store.id)}
              />
            ))}
          </div>
        )}
      </div>
    </Container>
  )
}

function StoreCard({
  store,
  onClick,
}: {
  store: StoreMileage
  onClick: () => void
}) {
  return (
    <button
      onClick={onClick}
      className="w-full rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow text-left"
    >
      <div className="flex gap-4 p-4">
        <div className="relative w-16 h-16 rounded-lg overflow-hidden shrink-0">
          <Image
            src={store.accommodationImageUrl}
            alt={store.accommodationName}
            fill
            className="object-cover"
            sizes="64px"
          />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm truncate">{store.accommodationName}</h3>
          <p className="text-xs text-muted-foreground flex items-center gap-1 mt-0.5">
            <MapPin className="size-3" />
            {store.location}
          </p>
          <div className="flex items-center gap-3 mt-2">
            <Badge variant="outline" className="text-xs">
              적립률 {store.earnRate}%
            </Badge>
            <span className="text-sm font-bold">
              {store.totalEarned.toLocaleString()}P
            </span>
          </div>
        </div>
        <div className="flex items-center shrink-0">
          <ChevronRight className="size-4 text-muted-foreground" />
        </div>
      </div>
      {store.expiringAmount > 0 && (
        <div className="border-t px-4 py-2 bg-red-50">
          <p className="text-xs text-red-500">
            소멸 예정 {store.expiringAmount.toLocaleString()}P
            {store.expiringDate && ` (${store.expiringDate})`}
          </p>
        </div>
      )}
    </button>
  )
}

function StoreDetail({
  store,
  onBack,
}: {
  store: StoreMileage
  onBack: () => void
}) {
  return (
    <div>
      <button
        onClick={onBack}
        className="flex items-center gap-1 text-sm text-primary font-medium mb-3 hover:underline"
      >
        <ArrowLeft className="size-4" />
        목록으로
      </button>

      <div className="flex items-center gap-3 mb-4 p-3 rounded-lg bg-muted/50">
        <div className="relative w-12 h-12 rounded-lg overflow-hidden shrink-0">
          <Image
            src={store.accommodationImageUrl}
            alt={store.accommodationName}
            fill
            className="object-cover"
            sizes="48px"
          />
        </div>
        <div>
          <p className="font-semibold text-sm">{store.accommodationName}</p>
          <p className="text-xs text-muted-foreground">적립률 {store.earnRate}%</p>
        </div>
      </div>

      {/* History Table */}
      <div className="rounded-xl border overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="text-xs">날짜</TableHead>
              <TableHead className="text-xs">상태</TableHead>
              <TableHead className="text-xs text-right">금액</TableHead>
              <TableHead className="text-xs text-right">잔액</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {store.history.map((entry) => {
              const statusInfo = STATUS_LABELS[entry.status]
              return (
                <TableRow key={entry.id}>
                  <TableCell className="text-xs">{entry.date}</TableCell>
                  <TableCell>
                    <span className={cn("text-xs font-medium", statusInfo.color)}>
                      {statusInfo.label}
                    </span>
                  </TableCell>
                  <TableCell className={cn(
                    "text-xs text-right font-medium",
                    entry.amount > 0 ? "text-blue-600" : "text-red-500"
                  )}>
                    {entry.amount > 0 ? "+" : ""}{entry.amount.toLocaleString()}
                  </TableCell>
                  <TableCell className="text-xs text-right">
                    {entry.balance.toLocaleString()}P
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}

function EmptyState() {
  return (
    <div className="flex flex-col items-center justify-center py-20 text-center">
      <div className="rounded-full bg-muted p-6 mb-4">
        <Coins className="size-10 text-muted-foreground" />
      </div>
      <p className="text-lg font-semibold">마일리지가 없습니다</p>
      <p className="mt-1 text-sm text-muted-foreground">
        숙소 예약 시 마일리지가 적립됩니다
      </p>
      <Button className="mt-4" asChild>
        <Link href="/">
          <Home className="size-4 mr-2" />
          홈으로
        </Link>
      </Button>
    </div>
  )
}

"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"
import { Ticket, Coins } from "lucide-react"
import { Container } from "@/components/layout"
import { cn } from "@/lib/utils"
import { useCouponList } from "@/domains/coupon/hooks/useCouponList"
import { CouponListPage } from "@/domains/coupon/components"
import { useMileageStores } from "../hooks/useMileageStores"
import { MileageStoreList } from "./MileageStoreList"

type Tab = "coupons" | "mileage"

const TABS: { key: Tab; label: string; icon: typeof Ticket }[] = [
  { key: "coupons", label: "쿠폰", icon: Ticket },
  { key: "mileage", label: "마일리지", icon: Coins },
]

export function BenefitPage() {
  const searchParams = useSearchParams()
  const [activeTab, setActiveTab] = useState<Tab>(
    searchParams?.get("tab") === "mileage" ? "mileage" : "coupons",
  )

  const { totalCount: couponCount } = useCouponList()
  const { totalCount: mileageCount } = useMileageStores()

  function getCount(tab: Tab) {
    return tab === "coupons" ? couponCount : mileageCount
  }

  return (
    <Container size="narrow" padding="responsive" className="pt-6 pb-8">
      {/* 탭 바 */}
      <div
        role="tablist"
        className="flex border-b border-border mb-6"
      >
        {TABS.map(({ key, label, icon: Icon }) => {
          const isActive = activeTab === key
          const count = getCount(key)
          return (
            <button
              key={key}
              role="tab"
              aria-selected={isActive}
              onClick={() => setActiveTab(key)}
              className={cn(
                "relative flex-1 flex items-center justify-center gap-2 py-3.5 text-sm font-medium transition-colors",
                isActive
                  ? "text-primary"
                  : "text-muted-foreground hover:text-foreground",
              )}
            >
              <Icon className="size-4" />
              <span>{label}</span>
              {count > 0 && (
                <span
                  className={cn(
                    "inline-flex items-center justify-center min-w-[20px] h-5 px-1.5 rounded-full text-[11px] font-bold",
                    isActive
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground",
                  )}
                >
                  {count}
                </span>
              )}
              {/* 활성 인디케이터 */}
              {isActive && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-full" />
              )}
            </button>
          )
        })}
      </div>

      {/* 탭 콘텐츠 */}
      {activeTab === "coupons" && <CouponListPage embedded />}
      {activeTab === "mileage" && <MileageStoreList />}
    </Container>
  )
}

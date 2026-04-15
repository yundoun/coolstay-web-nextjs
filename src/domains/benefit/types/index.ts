import type { StoreItem } from "@/lib/api/types"

/** ST004 응답의 숙소 아이템 (마일리지 필드 포함) */
export type MileageStore = StoreItem & {
  user_point_amount: number
  benefit_point_rate: number
  expire_point_amount?: number
}

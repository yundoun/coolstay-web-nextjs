// ─── API 타입 ───

export interface MileageDetailParams {
  store_key: string
}

export interface MileagePoint {
  key: string
  amount: number
  remained_point: number
  status: string
  reason: string | null
}

export interface MileageDetailResponse {
  amount?: number           // 현재 잔액 (적립 내역 없으면 미반환)
  total_amount?: number     // 총 적립액 (적립 내역 없으면 미반환)
  expire_amount?: number    // 만료 예정 금액 (적립 내역 없으면 미반환)
  points: MileagePoint[]
}

export interface MileageDeleteRequest {
  store_keys: string[]
  flag?: string
}

// ─── Legacy (mock용, API 연동 후 제거) ───

export type MileageStatus = "earned" | "used" | "expired"

export interface MileageHistoryEntry {
  id: string
  date: string
  status: MileageStatus
  amount: number
  balance: number
  description: string
}

export interface StoreMileage {
  id: string
  accommodationId: string
  accommodationName: string
  accommodationImageUrl: string
  location: string
  earnRate: number
  totalEarned: number
  expiringAmount: number
  expiringDate?: string
  history: MileageHistoryEntry[]
}

export interface MileageSummary {
  currentBalance: number
  totalEarned: number
  expiringAmount: number
  expiringDate?: string
}

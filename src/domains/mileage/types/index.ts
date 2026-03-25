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

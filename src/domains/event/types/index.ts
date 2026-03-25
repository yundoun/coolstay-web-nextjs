export type EventStatus = "ongoing" | "upcoming" | "ended"

export interface EventItem {
  id: string
  title: string
  description: string
  imageUrl: string
  startDate: string
  endDate: string
  status: EventStatus
  hasCoupon: boolean
  couponName?: string
}

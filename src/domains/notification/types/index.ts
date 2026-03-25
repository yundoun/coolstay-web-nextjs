export type NotificationType =
  | "booking"
  | "coupon"
  | "review"
  | "event"
  | "system"

export interface NotificationItem {
  id: string
  type: NotificationType
  title: string
  message: string
  createdAt: string
  isRead: boolean
  link?: string
}

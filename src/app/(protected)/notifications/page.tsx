import { NotificationPage } from "@/domains/notification/components"

export function generateMetadata() {
  return {
    title: "알림 | 꿀스테이",
  }
}

export default function NotificationsRoute() {
  return <NotificationPage />
}

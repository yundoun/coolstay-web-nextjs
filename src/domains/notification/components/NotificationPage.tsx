"use client"

import { useState } from "react"
import Link from "next/link"
import {
  Bell,
  CalendarCheck,
  Ticket,
  PenLine,
  PartyPopper,
  Info,
  Trash2,
  BellOff,
} from "lucide-react"
import { Container } from "@/components/layout"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"
import { notificationsMock } from "../data/mock"
import type { NotificationItem, NotificationType } from "../types"

const typeConfig: Record<
  NotificationType,
  { icon: React.ElementType; color: string }
> = {
  booking: { icon: CalendarCheck, color: "text-blue-500 bg-blue-50" },
  coupon: { icon: Ticket, color: "text-orange-500 bg-orange-50" },
  review: { icon: PenLine, color: "text-green-500 bg-green-50" },
  event: { icon: PartyPopper, color: "text-purple-500 bg-purple-50" },
  system: { icon: Info, color: "text-gray-500 bg-gray-50" },
}

function getRelativeTime(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const minutes = Math.floor(diff / 60000)
  const hours = Math.floor(diff / 3600000)
  const days = Math.floor(diff / 86400000)

  if (minutes < 1) return "방금 전"
  if (minutes < 60) return `${minutes}분 전`
  if (hours < 24) return `${hours}시간 전`
  if (days === 1) return "어제"
  if (days < 7) return `${days}일 전`
  return new Date(dateStr).toLocaleDateString("ko-KR")
}

export function NotificationPage() {
  const [notifications, setNotifications] = useState(notificationsMock)

  const unreadCount = notifications.filter((n) => !n.isRead).length

  const handleDeleteAll = () => {
    if (confirm("모든 알림을 삭제하시겠습니까?")) {
      setNotifications([])
    }
  }

  const handleClick = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    )
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <h1 className="text-2xl font-bold">알림</h1>
          {unreadCount > 0 && (
            <span className="flex items-center justify-center size-6 rounded-full bg-primary text-primary-foreground text-xs font-bold">
              {unreadCount}
            </span>
          )}
        </div>
        {notifications.length > 0 && (
          <Button
            variant="ghost"
            size="sm"
            onClick={handleDeleteAll}
            className="text-muted-foreground"
          >
            <Trash2 className="size-4 mr-1" />
            전체 삭제
          </Button>
        )}
      </div>

      {notifications.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="rounded-full bg-muted p-6 mb-4">
            <BellOff className="size-10 text-muted-foreground" />
          </div>
          <p className="text-lg font-semibold">알림이 없습니다</p>
          <p className="mt-1 text-sm text-muted-foreground">
            새로운 알림이 도착하면 여기에 표시됩니다
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {notifications.map((notification) => (
            <NotificationCard
              key={notification.id}
              notification={notification}
              onClick={() => handleClick(notification.id)}
            />
          ))}
        </div>
      )}
    </Container>
  )
}

function NotificationCard({
  notification,
  onClick,
}: {
  notification: NotificationItem
  onClick: () => void
}) {
  const config = typeConfig[notification.type]
  const Icon = config.icon
  const [iconBg, iconColor] = config.color.split(" ")

  const Wrapper = notification.link ? Link : "div"
  const wrapperProps = notification.link
    ? { href: notification.link, onClick }
    : { onClick }

  return (
    <Wrapper
      {...(wrapperProps as any)}
      className={cn(
        "flex gap-3 p-4 rounded-xl border transition-colors cursor-pointer",
        notification.isRead
          ? "bg-card hover:bg-muted/30"
          : "bg-primary/5 border-primary/20 hover:bg-primary/10"
      )}
    >
      <div
        className={cn(
          "flex items-center justify-center size-10 rounded-full shrink-0",
          config.color
        )}
      >
        <Icon className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p
            className={cn(
              "text-sm leading-snug",
              notification.isRead ? "font-medium" : "font-bold"
            )}
          >
            {notification.title}
          </p>
          {!notification.isRead && (
            <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />
          )}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
          {notification.message}
        </p>
        <p className="text-xs text-muted-foreground/70 mt-1.5">
          {getRelativeTime(notification.createdAt)}
        </p>
      </div>
    </Wrapper>
  )
}

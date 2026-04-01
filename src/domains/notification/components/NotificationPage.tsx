"use client"

import { useState } from "react"
import Link from "next/link"
import { useQuery, useQueryClient } from "@tanstack/react-query"
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
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { EmptyState } from "@/components/ui/empty-state"
import { cn } from "@/lib/utils"
import { getAlarmList, deleteAlarms, updateAlarmCard } from "@/domains/alarm/api/alarmApi"
import type { Alarm } from "@/domains/alarm/types"

const categoryIcons: Record<string, { icon: React.ElementType; color: string }> = {
  RESERVATION: { icon: CalendarCheck, color: "text-blue-500 bg-blue-50" },
  BENEFIT: { icon: Ticket, color: "text-orange-500 bg-orange-50" },
  ACTIVITY: { icon: PenLine, color: "text-green-500 bg-green-50" },
  EVENT: { icon: PartyPopper, color: "text-purple-500 bg-purple-50" },
}
const defaultIcon = { icon: Info, color: "text-gray-500 bg-gray-50" }

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
  const queryClient = useQueryClient()
  const { data, isLoading } = useQuery({
    queryKey: ["alarms"],
    queryFn: () => getAlarmList({ count: 50 }),
    retry: 1,
  })

  const alarms = data?.alarms ?? []
  const unreadCount = alarms.filter((a) => a.read_yn === "N").length

  const handleDeleteAll = async () => {
    if (!confirm("모든 알림을 삭제하시겠습니까?")) return
    try {
      await deleteAlarms({ delete_type: "ALL", alarm_key: alarms.map((a) => a.key) })
      queryClient.invalidateQueries({ queryKey: ["alarms"] })
    } catch { /* ignore */ }
  }

  const handleClick = async (alarm: Alarm) => {
    if (alarm.read_yn === "N") {
      try {
        await updateAlarmCard({ type: "READ", alarm_key: [alarm.key] })
        // Optimistic update
        queryClient.setQueryData(["alarms"], {
          ...data,
          alarms: alarms.map((a) => a.key === alarm.key ? { ...a, read_yn: "Y" } : a),
        })
      } catch { /* ignore */ }
    }
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
        {alarms.length > 0 && (
          <Button variant="ghost" size="sm" onClick={handleDeleteAll} className="text-muted-foreground">
            <Trash2 className="size-4 mr-1" />
            전체 삭제
          </Button>
        )}
      </div>

      {isLoading ? (
        <LoadingSpinner />
      ) : alarms.length === 0 ? (
        <EmptyState
          icon={BellOff}
          title="알림이 없습니다"
          description="새로운 알림이 도착하면 여기에 표시됩니다"
        />
      ) : (
        <div className="space-y-2">
          {alarms.map((alarm) => (
            <AlarmCard key={alarm.key} alarm={alarm} onClick={() => handleClick(alarm)} />
          ))}
        </div>
      )}
    </Container>
  )
}

function AlarmCard({ alarm, onClick }: { alarm: Alarm; onClick: () => void }) {
  const config = categoryIcons[alarm.category_code] || defaultIcon
  const Icon = config.icon
  const isRead = alarm.read_yn === "Y"

  // link는 객체 — target이 있으면 링크로, 없으면 div로 렌더링
  const linkTarget = alarm.link?.target
  const Wrapper = linkTarget ? Link : "div"
  const wrapperProps = linkTarget ? { href: linkTarget, onClick } : { onClick }

  const regDate = new Date(alarm.reg_dt < 1e12 ? alarm.reg_dt * 1000 : alarm.reg_dt)
  const timeAgo = getRelativeTime(regDate.toISOString())

  return (
    <Wrapper
      {...(wrapperProps as React.ComponentProps<"div"> & React.ComponentProps<typeof Link>)}
      className={cn(
        "flex gap-3 p-4 rounded-xl border transition-colors cursor-pointer",
        isRead ? "bg-card hover:bg-muted/30" : "bg-primary/5 border-primary/20 hover:bg-primary/10"
      )}
    >
      <div className={cn("flex items-center justify-center size-10 rounded-full shrink-0", config.color)}>
        <Icon className="size-5" />
      </div>
      <div className="flex-1 min-w-0">
        <div className="flex items-start justify-between gap-2">
          <p className={cn("text-sm leading-snug", isRead ? "font-medium" : "font-bold")}>
            {alarm.title}
          </p>
          {!isRead && <span className="size-2 rounded-full bg-primary shrink-0 mt-1.5" />}
        </div>
        <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{alarm.summary || alarm.description}</p>
        <p className="text-xs text-muted-foreground/70 mt-1.5">{timeAgo}</p>
      </div>
    </Wrapper>
  )
}

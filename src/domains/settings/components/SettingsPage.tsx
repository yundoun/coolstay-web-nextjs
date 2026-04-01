"use client"

import Link from "next/link"
import {
  Bell,
  Smartphone,
  Megaphone,
  LogOut,
  ChevronRight,
  FileText,
  UserX,
} from "lucide-react"
import { Container } from "@/components/layout"
import { LoadingSpinner } from "@/components/ui/loading-spinner"
import { Switch } from "@/components/ui/switch"
import { useSettings } from "../hooks/useSettings"

export function SettingsPage() {
  const { getSettingValue, updateSetting, isLoading } = useSettings()

  const handleLogout = () => {
    if (confirm("로그아웃하시겠습니까?")) {
      alert("로그아웃되었습니다.")
    }
  }

  return (
    <Container size="narrow" padding="responsive" className="py-8">
      <h1 className="text-2xl font-bold mb-6">설정</h1>

      {/* Notification Settings */}
      {isLoading ? (
        <LoadingSpinner />
      ) : (
        <div className="rounded-xl border bg-card overflow-hidden">
          <div className="px-4 py-3 bg-muted/30">
            <div className="flex items-center gap-2">
              <Bell className="size-4 text-muted-foreground" />
              <h2 className="text-sm font-semibold">알림 설정</h2>
            </div>
          </div>

          {/* 실제 API 코드: US002=푸시알림, US003=마케팅, US007=야간알림 */}
          <div className="divide-y">
            <SettingToggle
              icon={<Bell className="size-5 text-muted-foreground" />}
              label="푸시 알림 수신"
              description="예약 확인, 이용 안내 등을 푸시 알림으로 받습니다"
              checked={getSettingValue("US002") === "Y"}
              onCheckedChange={(v) => updateSetting("US002", v ? "Y" : "N")}
            />
            <SettingToggle
              icon={<Megaphone className="size-5 text-muted-foreground" />}
              label="마케팅 정보 수신 동의"
              description="이벤트, 할인 쿠폰 등 마케팅 정보를 받습니다"
              checked={getSettingValue("US003") === "Y"}
              onCheckedChange={(v) => updateSetting("US003", v ? "Y" : "N")}
            />
            <SettingToggle
              icon={<Smartphone className="size-5 text-muted-foreground" />}
              label="야간 알림 수신"
              description="21시~08시 사이 알림 수신을 허용합니다"
              checked={getSettingValue("US007") === "Y"}
              onCheckedChange={(v) => updateSetting("US007", v ? "Y" : "N")}
            />
          </div>
        </div>
      )}

      {/* Links */}
      <div className="mt-4 rounded-xl border bg-card overflow-hidden divide-y">
        <Link
          href="/terms"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
        >
          <FileText className="size-5 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">이용약관</span>
          <ChevronRight className="size-4 text-muted-foreground/50" />
        </Link>
        <Link
          href="/mypage/withdraw"
          className="flex items-center gap-3 px-4 py-3.5 hover:bg-muted/50 transition-colors"
        >
          <UserX className="size-5 text-muted-foreground" />
          <span className="flex-1 text-sm font-medium">회원 탈퇴</span>
          <ChevronRight className="size-4 text-muted-foreground/50" />
        </Link>
      </div>

      {/* Logout */}
      <div className="mt-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-4 py-3.5 rounded-xl border bg-card text-sm text-red-500 hover:bg-red-50 transition-colors"
        >
          <LogOut className="size-5" />
          <span className="font-medium">로그아웃</span>
        </button>
      </div>

      {/* App Version */}
      <div className="mt-6 text-center">
        <p className="text-xs text-muted-foreground">꿀스테이 웹 v1.0.0</p>
      </div>
    </Container>
  )
}

function SettingToggle({
  icon,
  label,
  description,
  checked,
  onCheckedChange,
}: {
  icon: React.ReactNode
  label: string
  description: string
  checked: boolean
  onCheckedChange: (checked: boolean) => void
}) {
  return (
    <div className="flex items-center gap-3 px-4 py-3.5">
      {icon}
      <div className="flex-1 min-w-0">
        <p className="text-sm font-medium">{label}</p>
        <p className="text-xs text-muted-foreground">{description}</p>
      </div>
      <Switch checked={checked} onCheckedChange={onCheckedChange} />
    </div>
  )
}

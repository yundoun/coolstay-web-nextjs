import { SettingsPage } from "@/domains/settings/components"

export function generateMetadata() {
  return {
    title: "설정 | 꿀스테이",
  }
}

export default function SettingsRoute() {
  return <SettingsPage />
}

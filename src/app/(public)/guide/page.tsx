import { GuidePage } from "@/domains/guide/components"

export function generateMetadata() {
  return {
    title: "이용 가이드 | 꿀스테이",
  }
}

export default function GuideRoute() {
  return <GuidePage />
}

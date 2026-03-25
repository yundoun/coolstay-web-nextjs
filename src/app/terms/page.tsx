import { TermsPage } from "@/domains/terms/components"

export function generateMetadata() {
  return {
    title: "이용약관 | 꿀스테이",
  }
}

export default function TermsRoute() {
  return <TermsPage />
}

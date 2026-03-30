import { FaqPage } from "@/domains/faq/components"

export function generateMetadata() {
  return {
    title: "자주 묻는 질문 | 꿀스테이",
  }
}

export default function FaqRoute() {
  return <FaqPage />
}

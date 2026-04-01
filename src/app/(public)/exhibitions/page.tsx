import { ExhibitionListPage } from "@/domains/exhibition/components"

export function generateMetadata() {
  return {
    title: "기획전 | 꿀스테이",
  }
}

export default function ExhibitionsRoute() {
  return <ExhibitionListPage />
}

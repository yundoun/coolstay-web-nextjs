import { MagazineBoardDetailClient } from "./client"

export function generateStaticParams() {
  return [{ key: "_" }]
}

export default function MagazineBoardDetailPage() {
  return <MagazineBoardDetailClient />
}

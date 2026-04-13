import { MagazinePackageDetailClient } from "./client"

export function generateStaticParams() {
  return [{ key: "_" }]
}

export default function MagazinePackageDetailPage() {
  return <MagazinePackageDetailClient />
}

import { FavoritesPage } from "@/domains/favorites/components"

export function generateMetadata() {
  return {
    title: "찜 / 최근본 | 꿀스테이",
  }
}

export default function FavoritesRoute() {
  return <FavoritesPage />
}

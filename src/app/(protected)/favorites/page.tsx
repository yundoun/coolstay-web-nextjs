import { FavoritesPage } from "@/domains/favorites/components"

export function generateMetadata() {
  return {
    title: "찜한 숙소 | 꿀스테이",
  }
}

export default function FavoritesRoute() {
  return <FavoritesPage />
}

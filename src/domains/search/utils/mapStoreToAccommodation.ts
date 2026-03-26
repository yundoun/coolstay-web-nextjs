import type { StoreItem } from "@/lib/api/types"
import type { Accommodation } from "@/components/accommodation"

/**
 * API StoreItem → AccommodationCard용 Accommodation 변환
 */
export function mapStoreToAccommodation(store: StoreItem): Accommodation {
  // 숙박(010102) 아이템에서 최저가 추출, 없으면 대실(010101)
  const stayItem = store.items?.find((i) => i.category?.code === "010102")
  const rentItem = store.items?.find((i) => i.category?.code === "010101")
  const priceItem = stayItem || rentItem

  const price = priceItem?.discount_price ?? priceItem?.price ?? 0
  const originalPrice = priceItem?.price !== priceItem?.discount_price ? priceItem?.price : undefined

  // 대표 이미지
  const mainImage = store.images?.[0]
  const imageUrl = mainImage?.url || mainImage?.thumb_url || ""

  // 태그 생성
  const tags: string[] = []
  if (store.parking_yn === "Y") tags.push("주차가능")
  if (store.extra_services?.length) {
    store.extra_services.forEach((s) => {
      if (s.visible_yn === "Y") tags.push(s.name)
    })
  }

  return {
    id: store.key,
    name: store.name,
    location: store.distance ? `${store.distance}m` : "",
    price,
    originalPrice,
    rating: 0,
    reviewCount: store.like_count ?? 0,
    imageUrl,
    tags: tags.slice(0, 3),
  }
}

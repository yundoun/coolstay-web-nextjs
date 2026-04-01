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
  const originalPrice =
    priceItem && priceItem.price > priceItem.discount_price
      ? priceItem.price
      : undefined
  const priceLabel = stayItem ? "숙박" : rentItem ? "대실" : undefined

  // 대표 이미지
  const mainImage = store.images?.[0]
  const imageUrl = mainImage?.url || mainImage?.thumb_url || ""

  // 태그 생성
  const tags: string[] = []
  if (store.partnership_type) tags.push("제휴")
  if (store.consecutive_yn === "Y") tags.push("연박")
  if (store.parking_yn === "Y") tags.push("주차가능")
  if (store.extra_services?.length) {
    store.extra_services
      .filter((s) => s.visible_yn === "Y")
      .forEach((s) => tags.push(s.name))
  }

  return {
    id: store.key,
    name: store.name,
    location: store.distance ? `${store.distance}m` : "",
    price,
    originalPrice,
    priceLabel,
    likeCount: store.like_count || undefined,
    isLiked: store.user_like_yn === "Y",
    imageUrl,
    tags: tags.slice(0, 3),
    partnershipType: store.partnership_type || undefined,
    consecutiveYn: store.consecutive_yn,
    rating: parseFloat(store.rating?.avg_score || "0") || undefined,
    reviewCount: store.rating?.review_count || undefined,
    mileageRate: store.benefit_point_rate || undefined,
    hasCoupon: !!store.download_coupon_info && store.download_coupon_info.status !== "NON_TARGET",
    address: store.location?.address || "",
  }
}

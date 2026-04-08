import type { StoreItem } from "@/lib/api/types"
import type { Accommodation } from "@/components/accommodation"

// v2_support_flag → 사용자 표시 라벨 매핑
// 실제 API는 is_ 접두사 없이 반환 (2026-04-08 전 API 검증 완료)
const SUPPORT_FLAG_LABELS: Record<string, string> = {
  first_reserve: "첫 예약",
  low_price_korea: "최저가",
  visit_korea: "숙박대전",
  favor_coupon_store: "찜혜택",
  unlimited_coupon: "무제한쿠폰",
  revisit: "재방문",
}

/**
 * API StoreItem → AccommodationCard용 Accommodation 변환
 */
export function mapStoreToAccommodation(store: StoreItem): Accommodation {
  // 목록 API: items[]에서 직접 대실/숙박 찾기, 또는 items[].sub_items[]에서 찾기
  let stayItem = store.items?.find((i) => i.category?.code === "010102")
  let rentItem = store.items?.find((i) => i.category?.code === "010101")

  // sub_items 구조인 경우 (상세 API와 동일 구조)
  if (!stayItem && !rentItem && store.items?.length) {
    for (const item of store.items) {
      if (item.sub_items?.length) {
        if (!stayItem) stayItem = item.sub_items.find((si) => si.category?.code === "010102")
        if (!rentItem) rentItem = item.sub_items.find((si) => si.category?.code === "010101")
      }
    }
  }

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

  // v2_support_flag → 활성 라벨 추출
  const supportFlags: string[] = []
  if (store.v2_support_flag) {
    for (const [key, val] of Object.entries(store.v2_support_flag)) {
      if (val === true && SUPPORT_FLAG_LABELS[key]) {
        supportFlags.push(SUPPORT_FLAG_LABELS[key])
      }
    }
  }

  // 쿠폰 최대 할인액 추출
  const couponDiscount = store.coupons?.length
    ? Math.max(...store.coupons.map((c) => c.discount_amount || 0))
    : undefined

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
    couponDiscount: couponDiscount && couponDiscount > 0 ? couponDiscount : undefined,
    address: store.location?.address || "",
    benefitTags: store.benefit_tags?.length ? store.benefit_tags : undefined,
    gradeTags: store.grade_tags?.length ? store.grade_tags : undefined,
    supportFlags: supportFlags.length > 0 ? supportFlags : undefined,
  }
}

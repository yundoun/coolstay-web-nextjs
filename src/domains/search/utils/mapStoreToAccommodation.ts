import type { StoreItem, ItemObj } from "@/lib/api/types"
import type { Accommodation } from "@/components/accommodation"
import { calcBestCouponPrice } from "@/lib/utils/coupon"

// v2_support_flag → 사용자 표시 라벨 매핑
const SUPPORT_FLAG_LABELS: Record<string, string> = {
  first_reserve: "첫 예약",
  low_price_korea: "국내최저가",
  visit_korea: "숙박대전",
  favor_coupon_store: "찜혜택",
  unlimited_coupon: "무제한쿠폰",
  revisit: "재방문",
}

/** extras 배열에서 특정 코드의 값 추출 */
function getExtra(item: ItemObj | undefined, code: string): string | undefined {
  if (!item?.extras?.length) return undefined
  const found = item.extras.find((e) => e.code === code)
  return found?.value || undefined
}

/** 대실 이용시간 텍스트 생성 ("최대 3시간") */
function getRentUseTime(item: ItemObj | undefined): string | undefined {
  const utime = getExtra(item, "UTIME")
  if (!utime) return undefined
  const hours = parseInt(utime, 10)
  if (isNaN(hours) || hours <= 0) return undefined
  return `최대 ${hours}시간`
}

/** 숙박 체크인 시간 텍스트 생성 ("17:00~") */
function getStayCheckIn(item: ItemObj | undefined): string | undefined {
  const stime = getExtra(item, "STIME")
  if (!stime) return undefined
  const hour = parseInt(stime, 10)
  if (isNaN(hour)) return undefined
  const hh = String(hour > 24 ? hour - 24 : hour).padStart(2, "0")
  return `${hh}:00~`
}

/** 잔여 객실 수 계산 */
function getRemainCount(item: ItemObj | undefined): number | undefined {
  const totalStr = getExtra(item, "TOTAL_SALES")
  const curStr = getExtra(item, "CUR_SALES")
  if (totalStr == null && curStr == null) return undefined
  const total = parseInt(totalStr || "0", 10)
  const cur = parseInt(curStr || "0", 10)
  const remain = total - cur
  return remain > 0 ? remain : undefined
}

/**
 * API StoreItem → AccommodationCard용 Accommodation 변환
 */
export function mapStoreToAccommodation(store: StoreItem): Accommodation {
  // 목록 API: items[]에서 직접 대실/숙박 찾기, 또는 items[].sub_items[]에서 찾기
  let stayItem: ItemObj | undefined = store.items?.find((i) => i.category?.code === "010102")
  let rentItem: ItemObj | undefined = store.items?.find((i) => i.category?.code === "010101")

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

  // 대실/숙박 별도 가격
  const rentPrice = rentItem ? (rentItem.discount_price ?? rentItem.price) : undefined
  const rentOriginalPrice =
    rentItem && rentItem.price > rentItem.discount_price ? rentItem.price : undefined
  const stayPrice = stayItem ? (stayItem.discount_price ?? stayItem.price) : undefined
  const stayOriginalPrice =
    stayItem && stayItem.price > stayItem.discount_price ? stayItem.price : undefined

  // extras에서 부가 정보 추출 (검색 목록에서는 extras 미반환, 상세에서만 제공)
  const rentUseTime = getRentUseTime(rentItem)
  const rentRemainCount = getRemainCount(rentItem)
  const stayCheckIn = getStayCheckIn(stayItem)
  const stayRemainCount = getRemainCount(stayItem)

  // 쿠폰 적용 최저가
  const rentCoupons = rentItem?.coupons?.length ? rentItem.coupons : store.coupons
  const stayCoupons = stayItem?.coupons?.length ? stayItem.coupons : store.coupons
  const rentCouponResult = rentPrice != null ? calcBestCouponPrice(rentCoupons, rentPrice) : null
  const stayCouponResult = stayPrice != null ? calcBestCouponPrice(stayCoupons, stayPrice) : null

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

  // 현장결제 여부 (Motel 상세에만 있는 필드이므로 옵셔널 체크)
  const sitePayment = (store as unknown as Record<string, unknown>).site_payment_yn === "Y"

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
    rentPrice,
    rentOriginalPrice,
    rentCouponAppliedPrice: rentCouponResult?.appliedPrice,
    rentCouponLabel: rentCouponResult?.label,
    rentUseTime,
    rentRemainCount,
    stayPrice,
    stayOriginalPrice,
    stayCouponAppliedPrice: stayCouponResult?.appliedPrice,
    stayCouponLabel: stayCouponResult?.label,
    stayCheckIn,
    stayRemainCount,
    sitePayment,
  }
}

import type { Motel, ItemObj } from "@/lib/api/types"
import type { AccommodationDetail, Room, AmenityItem, Policy } from "../types"

// 편의시설 코드 → 이름/아이콘 매핑
const CONVENIENCE_MAP: Record<string, { name: string; icon: string }> = {
  C01: { name: "WiFi", icon: "wifi" },
  C02: { name: "주차장", icon: "car" },
  C03: { name: "조식", icon: "utensils" },
  C04: { name: "수영장", icon: "waves" },
  C05: { name: "피트니스", icon: "dumbbell" },
  C06: { name: "스파/사우나", icon: "sparkles" },
  C07: { name: "세탁", icon: "shirt" },
  C08: { name: "짐보관", icon: "briefcase" },
  C09: { name: "반려동물", icon: "dog" },
  C10: { name: "흡연구역", icon: "cigarette" },
  C20: { name: "엘리베이터", icon: "arrow-up" },
}

/**
 * API Motel → AccommodationDetail 변환
 */
export function mapMotelToDetail(motel: Motel): AccommodationDetail {
  // 이미지 URL 추출
  const images = motel.images?.map((img) => img.url) ?? []

  // 편의시설 변환
  const amenities: AmenityItem[] = (motel.convenience_codes ?? []).map((code) => {
    const info = CONVENIENCE_MAP[code] || { name: code, icon: "check" }
    return {
      id: code,
      name: info.name,
      icon: info.icon,
      available: true,
    }
  })

  // 주차 정보
  if (motel.parking_yn === "Y") {
    amenities.unshift({
      id: "parking",
      name: `주차 가능 (${motel.parking_count ?? 0}대)`,
      icon: "car",
      available: motel.parking_full_yn !== "Y",
    })
  }

  // 객실 변환 — items[].sub_items[]에서 대실(010101)/숙박(010102) 패키지 추출
  const rooms: Room[] = (motel.items ?? []).map((item: ItemObj) => {
    const subItems = item.sub_items ?? []
    const stayItem = subItems.find((si) => si.category?.code === "010102")
    const rentItem = subItems.find((si) => si.category?.code === "010101")

    // daily_extras에서 시간 정보 추출 헬퍼
    const getExtra = (si: ItemObj | undefined, code: string): string | undefined => {
      const todayExtras = si?.daily_extras?.[0]?.extras ?? []
      return todayExtras.find((e) => e.code === code)?.value
    }

    const stayPrice = stayItem?.discount_price ?? stayItem?.price ?? 0
    const stayOriginal = stayItem?.price !== stayItem?.discount_price ? stayItem?.price : undefined
    const rentPrice = rentItem?.discount_price ?? rentItem?.price
    const rentOriginal = rentItem?.price !== rentItem?.discount_price ? rentItem?.price : undefined

    // extras에서 인원 정보 추출 (daily_extras의 MAX_ADULT/MAX_KIDS, 또는 item.extras의 MAX)
    const stayExtras = stayItem?.daily_extras?.[0]?.extras ?? []
    const rentExtras = rentItem?.daily_extras?.[0]?.extras ?? []
    const dailyExtras = stayExtras.length > 0 ? stayExtras : rentExtras
    const maxAdults = parseInt(dailyExtras.find((e) => e.code === "MAX_ADULT")?.value ?? "0")
    const maxKids = parseInt(dailyExtras.find((e) => e.code === "MAX_KIDS")?.value ?? "0")
    // MAX 코드 fallback (item.extras)
    const maxExtra = (item.extras ?? []).find((e) => e.code === "MAX")
    const maxGuests = (maxAdults + maxKids) || (maxExtra ? parseInt(maxExtra.value) : 2)

    // 객실 이미지
    const roomImages = (item.images ?? []).map((img) => img.url)

    return {
      id: item.key ?? "",
      name: item.name ?? "객실",
      description: "",
      imageUrl: roomImages[0] ?? images[0] ?? "",
      images: roomImages.length > 0 ? roomImages : images.slice(0, 3),
      maxGuests,
      maxAdults: maxAdults || maxGuests,
      maxKids: maxKids,
      amenities: [],
      isAvailable: true,
      remainingCount: parseInt(getExtra(stayItem, "CUR_SALES") || getExtra(rentItem, "CUR_SALES") || "0"),
      keywords: item.keywords ?? [],
      rentalPrice: rentPrice,
      rentalOriginalPrice: rentOriginal,
      rentalAvailable: !!rentItem,
      rentalPackageKey: rentItem?.key,
      rentalStartHour: getExtra(rentItem, "STIME") ? parseInt(getExtra(rentItem, "STIME")!) : undefined,
      rentalEndHour: getExtra(rentItem, "ETIME") ? parseInt(getExtra(rentItem, "ETIME")!) : undefined,
      rentalUseHours: getExtra(rentItem, "UTIME") ? parseInt(getExtra(rentItem, "UTIME")!) : undefined,
      rentalTime: getExtra(rentItem, "UTIME") ? `최대 ${getExtra(rentItem, "UTIME")}시간` : undefined,
      stayPrice,
      stayOriginalPrice: stayOriginal,
      stayAvailable: !!stayItem,
      stayPackageKey: stayItem?.key,
      stayStartHour: getExtra(stayItem, "STIME") ? parseInt(getExtra(stayItem, "STIME")!) : undefined,
      stayEndHour: getExtra(stayItem, "ETIME") ? parseInt(getExtra(stayItem, "ETIME")!) : undefined,
      rentalCoupons: rentItem?.coupons?.length ? rentItem.coupons : undefined,
      stayCoupons: stayItem?.coupons?.length ? stayItem.coupons : undefined,
    }
  })

  // 정책
  const policies: Policy[] = []
  if (motel.policy_msg) {
    policies.push({ title: "이용 안내", content: motel.policy_msg })
  }
  if (motel.refund_policy) {
    policies.push({ title: "취소/환불 규정", content: motel.refund_policy })
  }

  // 리뷰
  const rating = motel.rating
  const reviewCount = rating?.review_count ?? 0
  const avgScore = parseFloat(rating?.avg_score ?? "0")

  // 평점 분포 계산 (API에서 제공하지 않으므로 리뷰 데이터에서 직접 계산)
  const ratingDistribution: Record<number, number> = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  const allRatingReviews = [
    ...(rating?.reviews ?? []),
    ...(motel.best_rating ? [motel.best_rating] : []),
  ]
  // 중복 제거 후 분포 계산
  const seenKeys = new Set<number>()
  for (const r of allRatingReviews) {
    if (seenKeys.has(r.key)) continue
    seenKeys.add(r.key)
    const rounded = Math.round(parseFloat(r.score ?? "0"))
    if (rounded >= 1 && rounded <= 5) {
      ratingDistribution[rounded]++
    }
  }

  return {
    id: motel.key,
    name: motel.name,
    location: motel.location?.address ?? "",
    address: motel.location?.address ?? "",
    description: motel.greeting_msg ?? "",
    price: 0,
    rating: avgScore,
    reviewCount,
    images,
    tags: motel.benefit_tags ?? motel.grade_tags ?? [],
    amenities,
    policies,
    rooms,
    reviews: {
      averageRating: avgScore,
      totalCount: reviewCount,
      ratingDistribution,
    },
    bestReview: motel.best_rating
      ? (() => {
          // best_rating에 images가 없을 수 있으므로 rating.reviews에서 같은 key의 이미지를 보충
          const bestImages = motel.best_rating!.images?.map((img) => img.url).filter((u): u is string => !!u) ?? []
          const fallbackImages = bestImages.length > 0
            ? bestImages
            : (rating?.reviews ?? [])
                .find((r) => r.key === motel.best_rating!.key)
                ?.images?.map((img) => img.url)
                .filter((u): u is string => !!u) ?? []
          return {
            id: String(motel.best_rating!.key),
            userName: motel.best_rating!.user?.name ?? "익명",
            rating: parseFloat(motel.best_rating!.score ?? "0"),
            content: motel.best_rating!.text ?? "",
            createdAt: String(motel.best_rating!.reg_dt ?? ""),
            roomName: motel.best_rating!.item_description ?? "",
            isBest: true,
            images: fallbackImages,
            reply: motel.best_rating!.comment
              ? {
                  content: motel.best_rating!.comment.text,
                  createdAt: String(motel.best_rating!.comment.reg_dt),
                }
              : undefined,
          }
        })()
      : null,
    recentReviews: (rating?.reviews ?? []).map((r) => ({
      id: String(r.key),
      userName: r.user?.name ?? "익명",
      rating: parseFloat(r.score ?? "0"),
      content: r.text ?? "",
      createdAt: String(r.reg_dt ?? ""),
      roomName: r.item_description ?? "",
      images: r.images?.map((img) => img.url).filter((u): u is string => !!u),
    })),
    events: [
      ...(motel.event ?? []).map((ev) => ({
        id: String(ev.key),
        title: ev.title ?? "",
        description: ev.description ?? "",
        imageUrl: ev.banner_image_url,
        startDate: ev.start_dt ?? "",
        endDate: ev.end_dt ?? "",
      })),
      ...(motel.external_events ?? []).map((ev) => ({
        id: String(ev.key),
        title: ev.title ?? "",
        description: ev.description ?? "",
        imageUrl: ev.banner_image_url,
        startDate: ev.start_dt ?? "",
        endDate: ev.end_dt ?? "",
      })),
    ],
    benefitPointRate: motel.benefit_point_rate ?? 0,
    phoneNumber: motel.safe_number || motel.phone_number,
    directDiscountYn: motel.download_coupon_info?.status !== "NON_TARGET",
    greetingMsg: motel.greeting_msg,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    latitude: motel.location?.latitude ? parseFloat(motel.location.latitude) : undefined,
    longitude: motel.location?.longitude ? parseFloat(motel.location.longitude) : undefined,

    // 혜택/쿠폰
    coupons: motel.coupons ?? [],
    benefits: motel.benefits ?? [],
    downloadCouponInfo: motel.download_coupon_info ?? undefined,
    paymentBenefit: motel.payment_benefit
      ? {
          benefit_more_yn: motel.payment_benefit.benefit_more_yn ?? "",
          benefit_preview: motel.payment_benefit.benefit_preview,
          benefit_contents: motel.payment_benefit.benefit_contents
            ? JSON.stringify(motel.payment_benefit.benefit_contents)
            : undefined,
        }
      : undefined,

    // 서비스/시설
    extraServices: motel.extra_services ?? [],
    sitePaymentYn: motel.site_payment_yn ?? "",

    // 연박/특별
    consecutiveYn: motel.consecutive_yn ?? "",
    coolConsecutivePopup: motel.cool_consecutive_popup ?? false,
    v2SupportFlag: motel.v2_support_flag ?? undefined,

    // 외부 링크
    v2ExternalLinks: motel.v2_external_links ?? [],
    externalEvents: motel.external_events ?? [],

    // 숙소 정보
    likeCount: motel.like_count ?? 0,
    userLikeYn: motel.user_like_yn ?? "",
    businessInfo: motel.business_info ?? undefined,
    nearbyDescription: motel.location?.nearby_description ?? undefined,
    locationDescription: motel.location?.description ?? undefined,
  }
}

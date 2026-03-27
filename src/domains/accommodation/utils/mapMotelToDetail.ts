import type { Motel } from "@/lib/api/types"
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

  // 객실 변환 — 상세 API의 items는 { key, name, extras, images, sub_items } 구조
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const rooms: Room[] = (motel.items as any[] ?? []).map((item) => {
    const subItems = item.sub_items ?? item.items ?? []
    const stayItem = subItems.find((si: { category?: { code: string } }) => si.category?.code === "010102")
    const rentItem = subItems.find((si: { category?: { code: string } }) => si.category?.code === "010101")

    // daily_extras에서 시간 정보 추출 헬퍼
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const getExtra = (si: any, code: string): string | undefined => {
      const todayExtras = si?.daily_extras?.[0]?.extras ?? []
      return todayExtras.find((e: { code: string }) => e.code === code)?.value
    }

    const stayPrice = stayItem?.discount_price ?? stayItem?.price ?? 0
    const stayOriginal = stayItem?.price !== stayItem?.discount_price ? stayItem?.price : undefined
    const rentPrice = rentItem?.discount_price ?? rentItem?.price
    const rentOriginal = rentItem?.price !== rentItem?.discount_price ? rentItem?.price : undefined

    // extras에서 인원 정보 추출
    const maxExtra = (item.extras ?? []).find((e: { code: string }) => e.code === "MAX")
    const maxGuests = maxExtra ? parseInt(maxExtra.value) : 2

    // 객실 이미지
    const roomImages = (item.images ?? []).map((img: { url: string }) => img.url)

    return {
      id: item.key ?? "",
      name: item.name ?? "객실",
      description: "",
      imageUrl: roomImages[0] ?? images[0] ?? "",
      images: roomImages.length > 0 ? roomImages : images.slice(0, 3),
      maxGuests,
      amenities: [],
      isAvailable: true,
      remainingCount: 0,
      keywords: [],
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
      ratingDistribution: {},
    },
    bestReview: motel.best_rating
      ? {
          id: String(motel.best_rating.key),
          userName: "",
          rating: parseFloat(motel.best_rating.score ?? "0"),
          content: motel.best_rating.text ?? "",
          createdAt: motel.best_rating.reg_dt ?? "",
          roomName: motel.best_rating.item_description ?? "",
          isBest: true,
          reply: motel.best_rating.comment
            ? {
                content: motel.best_rating.comment.text,
                createdAt: motel.best_rating.comment.reg_dt,
              }
            : undefined,
        }
      : null,
    recentReviews: (rating?.reviews ?? []).map((r) => ({
      id: String(r.key),
      userName: "",
      rating: parseFloat(r.score ?? "0"),
      content: r.text ?? "",
      createdAt: r.reg_dt ?? "",
      roomName: r.item_description ?? "",
      images: r.images?.map((img) => img.url),
    })),
    events: [],
    benefitPointRate: motel.benefit_point_rate ?? 0,
    phoneNumber: motel.safe_number || motel.phone_number,
    directDiscountYn: false,
    greetingMsg: motel.greeting_msg,
    checkInTime: "15:00",
    checkOutTime: "11:00",
    latitude: motel.location?.latitude ? parseFloat(motel.location.latitude) : undefined,
    longitude: motel.location?.longitude ? parseFloat(motel.location.longitude) : undefined,
  }
}

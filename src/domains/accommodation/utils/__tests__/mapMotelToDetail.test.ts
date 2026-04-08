import { describe, it, expect } from "vitest"
import { mapMotelToDetail } from "../mapMotelToDetail"
import type { Motel } from "@/lib/api/types"

// 최소 Motel 객체 생성 헬퍼
function createMockMotel(overrides: Partial<Motel> = {}): Motel {
  return {
    key: "D_KCST_001",
    partnership_type: "COOLSTAY",
    business_type: "MOTEL",
    name: "테스트 숙소",
    phone_number: "02-1234-5678",
    safe_number: "050-1234-5678",
    location: {
      address: "서울시 강남구",
      latitude: "37.5",
      longitude: "127.0",
      description: "강남역 3번 출구",
      nearby_description: "강남역 3분",
    },
    images: [{ key: 1, description: "", url: "https://img.test/1.jpg", thumb_url: "https://img.test/1_thumb.jpg", priority: 0 }],
    rating: { avg_score: "4.5", review_count: 100, reviews: [] },
    business_info: { trade_name: "테스트", owner_name: "홍길동", address: "서울", email: "test@test.com", phone_number: "02-1234", business_number: "123-45-67890" },
    filter_bit: 3,
    greeting_msg: "환영합니다",
    policy_msg: "22시 이후 정숙",
    convenience_codes: ["C01", "C02"],
    like_count: 50,
    distance: "500",
    benefit_point_rate: 5,
    user_point_amount: 1000,
    consecutive_yn: "Y",
    user_like_yn: "N",
    parking_yn: "Y",
    parking_count: 30,
    parking_full_yn: "N",
    parking_info: "지하 1층",
    benefit_room: "드라이기, 냉장고",
    benefit_extra: "프론트 24시간",
    site_payment_yn: "Y",
    refund_policy: "체크인 3일전 100%",
    point_reward_type: "RATING",
    best_rating: { key: 1, best_yn: "Y", item_description: "디럭스", score: "5.0", text: "최고!", status: "A", reg_dt: 1700000000 },
    download_coupon_info: { status: "AVAILABLE", coupon_avail_days: 7, stay_amount: 5000, rent_amount: 3000 },
    items: [],
    event: [],
    benefit_tags: ["마일리지 적립"],
    benefits: [{ name: "조식 제공", description: "7~9시", image_url: "https://img.test/b.jpg", active_yn: "Y", priority: 1 }],
    grade_tags: [],
    coupons: [],
    external_events: [],
    payment_benefit: { benefit_more_yn: "N", benefit_preview: "", benefit_contents: { key: "", title: "", start_dt: "", end_dt: "", logo_url: "", contents: [] } },
    extra_services: [],
    v2_support_flag: { first_reserve: true, visit_korea: false, low_price_korea: true, favor_coupon_store: false, unlimited_coupon: false, revisit: false },
    v2_external_links: [],
    v2_low_price_btn: { type: "", sub_type: "", target: "", btn_name: "", thumb_url: "", bg_url: "", bg_color: "", title_color: "", mapping_business_types: [] },
    area_cd1: 11,
    area_cd2: 680,
    cool_consecutive_popup: false,
    ...overrides,
  }
}

describe("mapMotelToDetail", () => {
  describe("기본 필드 매핑", () => {
    it("Motel 기본 정보를 AccommodationDetail로 변환한다", () => {
      const motel = createMockMotel()
      const result = mapMotelToDetail(motel)

      expect(result.id).toBe("D_KCST_001")
      expect(result.name).toBe("테스트 숙소")
      expect(result.address).toBe("서울시 강남구")
      expect(result.rating).toBe(4.5)
      expect(result.reviewCount).toBe(100)
      expect(result.benefitPointRate).toBe(5)
      expect(result.phoneNumber).toBe("050-1234-5678") // safe_number 우선
    })
  })

  describe("items → rooms 변환", () => {
    it("ItemObj의 sub_items에서 대실/숙박 패키지를 추출한다", () => {
      const motel = createMockMotel({
        items: [
          {
            key: "ROOM_001",
            price: 0,
            discount_price: 0,
            consecutive_price: 0,
            name: "디럭스 더블",
            description: "넓은 객실",
            category: { code: "ROOM", name: "객실" },
            extras: [{ code: "MAX", value: "4" }],
            images: [{ key: 10, description: "", url: "https://img.test/room.jpg", thumb_url: "", priority: 0 }],
            sub_items: [
              {
                key: "PKG_RENT_001",
                price: 50000,
                discount_price: 40000,
                consecutive_price: 0,
                name: "대실",
                description: "",
                category: { code: "010101", name: "대실" },
                extras: [],
                daily_extras: [{ date: "20240308", extras: [{ code: "STIME", value: "10" }, { code: "ETIME", value: "23" }, { code: "UTIME", value: "3" }] }],
              },
              {
                key: "PKG_STAY_001",
                price: 100000,
                discount_price: 80000,
                consecutive_price: 10000,
                name: "숙박",
                description: "",
                category: { code: "010102", name: "숙박" },
                extras: [],
                daily_extras: [{ date: "20240308", extras: [{ code: "STIME", value: "15" }, { code: "ETIME", value: "11" }] }],
              },
            ],
          },
        ],
      })

      const result = mapMotelToDetail(motel)
      expect(result.rooms).toHaveLength(1)

      const room = result.rooms[0]
      expect(room.id).toBe("ROOM_001")
      expect(room.name).toBe("디럭스 더블")
      expect(room.maxGuests).toBe(4)

      // 대실
      expect(room.rentalAvailable).toBe(true)
      expect(room.rentalPackageKey).toBe("PKG_RENT_001")
      expect(room.rentalPrice).toBe(40000)
      expect(room.rentalOriginalPrice).toBe(50000)
      expect(room.rentalStartHour).toBe(10)
      expect(room.rentalEndHour).toBe(23)
      expect(room.rentalUseHours).toBe(3)

      // 숙박
      expect(room.stayAvailable).toBe(true)
      expect(room.stayPackageKey).toBe("PKG_STAY_001")
      expect(room.stayPrice).toBe(80000)
      expect(room.stayOriginalPrice).toBe(100000)
      expect(room.stayStartHour).toBe(15)
      expect(room.stayEndHour).toBe(11)
    })

    it("sub_items가 없으면 대실/숙박 모두 미제공으로 처리한다", () => {
      const motel = createMockMotel({
        items: [{
          key: "ROOM_EMPTY",
          price: 0, discount_price: 0, consecutive_price: 0,
          name: "빈 객실",
          description: "",
          category: { code: "ROOM", name: "" },
          extras: [],
        }],
      })

      const result = mapMotelToDetail(motel)
      const room = result.rooms[0]
      expect(room.rentalAvailable).toBe(false)
      expect(room.stayAvailable).toBe(false)
      expect(room.stayPrice).toBe(0)
    })
  })

  describe("coupons (배열 타입)", () => {
    it("coupons 배열을 그대로 전달한다", () => {
      const motel = createMockMotel({
        coupons: [
          {
            coupon_pk: 1, discount_amount: 5000, total_amount: 5000, remain_amount: 5000,
            code: "C001", title: "5천원 할인", description: "", category_code: "", sub_category_code: "",
            type: "", discount_type: "AMOUNT", dup_use_yn: "N", usable_yn: "Y", status: "A", dimmed_yn: "N",
            start_dt: 0, end_dt: 0, usable_start_dt: 0, usable_end_dt: 0,
            enterable_start_dt: 0, enterable_end_dt: 0, reg_dt: 0,
            constraints: [],
          },
          {
            coupon_pk: 2, discount_amount: 10, total_amount: 0, remain_amount: 0,
            code: "C002", title: "10% 할인", description: "", category_code: "", sub_category_code: "",
            type: "", discount_type: "RATE", dup_use_yn: "N", usable_yn: "Y", status: "A", dimmed_yn: "N",
            start_dt: 0, end_dt: 0, usable_start_dt: 0, usable_end_dt: 0,
            enterable_start_dt: 0, enterable_end_dt: 0, reg_dt: 0,
            constraints: [],
          },
        ],
      })

      const result = mapMotelToDetail(motel)
      expect(result.coupons).toHaveLength(2)
      expect(result.coupons[0].discount_amount).toBe(5000)
      expect(result.coupons[1].discount_type).toBe("RATE")
    })

    it("coupons가 undefined이면 빈 배열이 된다", () => {
      const motel = createMockMotel({ coupons: undefined as unknown as [] })
      const result = mapMotelToDetail(motel)
      expect(result.coupons).toEqual([])
    })
  })

  describe("event/external_events (배열 타입)", () => {
    it("event 배열과 external_events 배열을 합쳐서 events로 변환한다", () => {
      const motel = createMockMotel({
        event: [
          { key: 1, view_count: 0, type: "", sub_type: "", title: "이벤트1", description: "설명1", position: 0, badge_image_url: "", banner_image_url: "https://img/e1.jpg", detail_banner_image_url: "", bottom_image_url: "", status: "", webview_link: "", extra: "", benefit_more_yn: "", benefit_preview: "", thumb_description: "", image_urls: [], link: { type: "", sub_type: "", target: "", btn_name: "", thumb_url: "", bg_url: "", bg_color: "", title_color: "", mapping_business_types: [] }, comment: { key: 0, text: "", reg_dt: 0 }, buttons: { type: "", sub_type: "", target: "", btn_name: "", thumb_url: "", bg_url: "", bg_color: "", title_color: "", mapping_business_types: [] }, tags: [], default_sort_type: "", v2_pull_coupons: {} as never, v2_total_coupons: {} as never, reg_dt: "", start_dt: "2024-01-01", end_dt: "2024-12-31" },
        ],
        external_events: [
          { key: 2, view_count: 0, type: "", sub_type: "", title: "외부이벤트1", description: "외부설명1", position: 0, badge_image_url: "", banner_image_url: "https://img/ext1.jpg", detail_banner_image_url: "", bottom_image_url: "", status: "", webview_link: "", extra: "", benefit_more_yn: "", benefit_preview: "", thumb_description: "", image_urls: [], link: { type: "", sub_type: "", target: "", btn_name: "", thumb_url: "", bg_url: "", bg_color: "", title_color: "", mapping_business_types: [] }, comment: { key: 0, text: "", reg_dt: 0 }, buttons: { type: "", sub_type: "", target: "", btn_name: "", thumb_url: "", bg_url: "", bg_color: "", title_color: "", mapping_business_types: [] }, tags: [], default_sort_type: "", v2_pull_coupons: {} as never, v2_total_coupons: {} as never, reg_dt: "", start_dt: "2024-03-01", end_dt: "2024-06-30" },
        ],
      })

      const result = mapMotelToDetail(motel)
      expect(result.events).toHaveLength(2)
      expect(result.events[0].title).toBe("이벤트1")
      expect(result.events[1].title).toBe("외부이벤트1")
    })
  })

  describe("benefits (배열 타입)", () => {
    it("benefits 배열을 그대로 전달한다", () => {
      const motel = createMockMotel({
        benefits: [
          { name: "조식", description: "7~9시", image_url: "", active_yn: "Y", priority: 1 },
          { name: "석식", description: "18~20시", image_url: "", active_yn: "N", priority: 2 },
        ],
      })

      const result = mapMotelToDetail(motel)
      expect(result.benefits).toHaveLength(2)
      expect(result.benefits[0].name).toBe("조식")
    })
  })

  describe("v2_support_flag", () => {
    it("support flag 필드를 그대로 전달한다", () => {
      const motel = createMockMotel({
        v2_support_flag: {
          first_reserve: true,
          visit_korea: false,
          low_price_korea: true,
          favor_coupon_store: false,
          unlimited_coupon: true,
          revisit: false,
        },
      })

      const result = mapMotelToDetail(motel)
      expect(result.v2SupportFlag?.first_reserve).toBe(true)
      expect(result.v2SupportFlag?.low_price_korea).toBe(true)
      expect(result.v2SupportFlag?.unlimited_coupon).toBe(true)
      expect(result.v2SupportFlag?.visit_korea).toBe(false)
    })
  })
})

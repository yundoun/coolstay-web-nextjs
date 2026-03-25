import type { EventItem } from "../types"

export const eventsMock: EventItem[] = [
  {
    id: "ev1",
    title: "봄맞이 특가! 전 숙소 최대 30% 할인",
    description:
      "따뜻한 봄바람과 함께 떠나는 여행!\n\n꿀스테이가 준비한 봄맞이 특가 프로모션으로 전국 인기 숙소를 최대 30% 할인된 가격에 만나보세요.\n\n■ 이벤트 기간: 2026.03.01 ~ 2026.04.30\n■ 대상: 전체 회원\n■ 혜택: 제주, 강원, 부산, 경주 지역 숙소 최대 30% 할인\n■ 사용 방법: 아래 쿠폰을 다운로드하여 예약 시 적용\n\n※ 쿠폰은 1인 1매 발급 가능하며, 다른 할인과 중복 적용되지 않습니다.",
    imageUrl: "https://images.unsplash.com/photo-1522199710521-72d69614c702?w=600&h=300&fit=crop",
    startDate: "2026-03-01",
    endDate: "2026-04-30",
    status: "ongoing",
    hasCoupon: true,
    couponName: "봄특가 20% 할인쿠폰",
  },
  {
    id: "ev2",
    title: "신규회원 웰컴 혜택 — 10,000원 즉시 할인",
    description:
      "꿀스테이에 오신 것을 환영합니다!\n\n신규 가입 회원이라면 누구나 받을 수 있는 웰컴 쿠폰을 놓치지 마세요.\n\n■ 이벤트 기간: 상시\n■ 대상: 신규 가입 회원\n■ 혜택: 10,000원 할인 쿠폰 (5만원 이상 결제 시 사용 가능)\n■ 지급 방법: 회원가입 완료 즉시 자동 지급\n\n※ 가입 후 30일 이내 사용 가능합니다.",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=300&fit=crop",
    startDate: "2026-01-01",
    endDate: "2026-12-31",
    status: "ongoing",
    hasCoupon: true,
    couponName: "신규회원 10,000원 할인쿠폰",
  },
  {
    id: "ev3",
    title: "여름 성수기 얼리버드 예약 이벤트",
    description:
      "올 여름, 미리 예약하고 더 저렴하게!\n\n여름 성수기 숙소를 지금 예약하면 최대 25% 할인 혜택을 드립니다.\n\n■ 이벤트 기간: 2026.05.01 ~ 2026.06.15\n■ 숙박 대상 기간: 2026.07.01 ~ 2026.08.31\n■ 혜택: 최대 25% 할인 (조기 예약 시)\n\n인기 숙소는 조기 마감될 수 있으니 서둘러 예약하세요!",
    imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=600&h=300&fit=crop",
    startDate: "2026-05-01",
    endDate: "2026-06-15",
    status: "upcoming",
    hasCoupon: false,
  },
  {
    id: "ev4",
    title: "겨울 감성 숙소 기획전",
    description:
      "추운 겨울, 따뜻한 숙소에서 특별한 추억을 만들어보세요.\n\n전국 인기 감성 숙소를 모아 특별 할인가로 제공합니다.\n\n■ 이벤트 기간: 2025.12.01 ~ 2026.02.28\n■ 혜택: 선착순 쿠폰 지급 (소진 시 종료)\n\n※ 본 이벤트는 종료되었습니다.",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=300&fit=crop",
    startDate: "2025-12-01",
    endDate: "2026-02-28",
    status: "ended",
    hasCoupon: false,
  },
]

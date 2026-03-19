import type { AccommodationDetail } from "../types"

export const accommodationDetailMock: Record<string, AccommodationDetail> = {
  "s2-1": createMockDetail("s2-1", "제주 에코 스테이", "제주시 애월읍"),
  "s2-2": createMockDetail("s2-2", "서귀포 프리미엄 풀빌라", "서귀포시 중문동"),
  "1": createMockDetail("1", "파라다이스 호텔 부산", "부산 해운대구"),
  "2": createMockDetail("2", "그랜드 하얏트 제주", "제주 서귀포시"),
  "3": createMockDetail("3", "세인트존스 호텔", "강릉 강문동"),
}

function createMockDetail(
  id: string,
  name: string,
  location: string
): AccommodationDetail {
  return {
    id,
    name,
    location,
    address: `${location} 123-45`,
    description: `${name}은(는) ${location}에 위치한 프리미엄 숙소입니다. 편안한 휴식과 함께 특별한 경험을 선사합니다. 최고급 인테리어와 세심한 서비스로 잊지 못할 추억을 만들어 보세요.`,
    price: 200000,
    originalPrice: 250000,
    rating: 4.8,
    reviewCount: 328,
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1200&q=80",
      "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
      "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
      "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    ],
    tags: ["오션뷰", "조식포함", "무료주차"],
    badges: ["eco", "localPick"],
    amenities: [
      { id: "wifi", name: "무료 Wi-Fi", icon: "wifi", available: true },
      { id: "parking", name: "무료 주차", icon: "parking", available: true },
      { id: "pool", name: "수영장", icon: "pool", available: true },
      { id: "breakfast", name: "조식 제공", icon: "breakfast", available: true },
      { id: "spa", name: "스파", icon: "spa", available: true },
      { id: "fitness", name: "피트니스", icon: "fitness", available: true },
      { id: "lounge", name: "라운지", icon: "lounge", available: false },
      { id: "vod", name: "VOD", icon: "vod", available: true },
    ],
    policies: [
      {
        title: "체크인/체크아웃",
        content: "체크인 15:00 / 체크아웃 11:00",
      },
      {
        title: "취소 규정",
        content:
          "체크인 3일 전: 전액 환불 | 체크인 1일 전: 50% 환불 | 당일: 환불 불가",
      },
      {
        title: "추가 안내",
        content: "반려동물 동반 불가 | 실내 흡연 금지 | 미성년자 단독 투숙 불가",
      },
    ],
    rooms: [
      {
        id: "room-1",
        name: "스탠다드 더블",
        description: "넓은 창문으로 자연광이 가득한 아늑한 객실",
        price: 150000,
        originalPrice: 190000,
        imageUrl:
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&q=80",
          "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&q=80",
        ],
        maxGuests: 2,
        amenities: ["Wi-Fi", "에어컨", "TV", "미니바"],
        isAvailable: true,
        remainingCount: 3,
        keywords: ["커플추천", "가성비"],
      },
      {
        id: "room-2",
        name: "디럭스 트윈",
        description: "두 개의 싱글 베드와 넉넉한 공간",
        price: 200000,
        originalPrice: 250000,
        imageUrl:
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&q=80",
        ],
        maxGuests: 2,
        amenities: ["Wi-Fi", "에어컨", "TV", "미니바", "욕조"],
        isAvailable: true,
        remainingCount: 2,
        keywords: ["넓은객실", "욕조"],
      },
      {
        id: "room-3",
        name: "프리미엄 스위트",
        description: "거실과 침실이 분리된 프리미엄 스위트룸",
        price: 350000,
        originalPrice: 420000,
        imageUrl:
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&q=80",
        ],
        maxGuests: 4,
        amenities: [
          "Wi-Fi",
          "에어컨",
          "TV",
          "미니바",
          "욕조",
          "오션뷰",
          "라운지",
        ],
        isAvailable: true,
        remainingCount: 1,
        keywords: ["오션뷰", "럭셔리", "가족"],
      },
      {
        id: "room-4",
        name: "패밀리 룸",
        description: "가족 여행에 최적화된 넓은 객실",
        price: 280000,
        imageUrl:
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
        images: [
          "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&q=80",
        ],
        maxGuests: 4,
        amenities: ["Wi-Fi", "에어컨", "TV", "미니바", "키즈존"],
        isAvailable: false,
        remainingCount: 0,
        keywords: ["가족추천", "키즈존"],
      },
    ],
    reviews: {
      averageRating: 4.8,
      totalCount: 328,
      ratingDistribution: {
        5: 210,
        4: 78,
        3: 25,
        2: 10,
        1: 5,
      },
    },
    bestReviews: [
      {
        id: "review-1",
        userName: "여행**",
        rating: 5,
        content:
          "뷰가 정말 환상적이었어요! 객실도 깔끔하고 직원분들도 너무 친절했습니다. 조식도 다양하고 맛있었어요. 다음에 또 방문하고 싶습니다.",
        images: [
          "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&q=80",
        ],
        createdAt: "2026-03-15",
        roomName: "프리미엄 스위트",
        reply: {
          content: "소중한 후기 감사합니다. 다음 방문도 기대하겠습니다!",
          createdAt: "2026-03-16",
        },
      },
      {
        id: "review-2",
        userName: "힐링**",
        rating: 5,
        content:
          "위치가 너무 좋고, 주변에 볼거리도 많아요. 수영장에서 보는 석양이 정말 예뻤습니다. 강추합니다!",
        createdAt: "2026-03-10",
        roomName: "디럭스 트윈",
      },
      {
        id: "review-3",
        userName: "가족**",
        rating: 4,
        content:
          "가족 여행으로 다녀왔어요. 아이들이 너무 좋아했습니다. 키즈존이 잘 되어있어서 좋았어요.",
        createdAt: "2026-03-05",
        roomName: "패밀리 룸",
      },
    ],
    events: [
      {
        id: "event-1",
        title: "봄맞이 특가 이벤트",
        description: "3월 한 달간 스위트룸 30% 할인",
        startDate: "2026-03-01",
        endDate: "2026-03-31",
      },
      {
        id: "event-2",
        title: "연박 할인",
        description: "2박 이상 시 추가 10% 할인",
        startDate: "2026-01-01",
        endDate: "2026-12-31",
      },
    ],
    parkingInfo: "무료 주차 가능 (선착순 30대)",
    checkInTime: "15:00",
    checkOutTime: "11:00",
  }
}

export function getAccommodationDetail(
  id: string
): AccommodationDetail | null {
  return accommodationDetailMock[id] || accommodationDetailMock["1"]
}

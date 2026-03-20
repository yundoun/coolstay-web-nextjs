// 홈 화면 목업 데이터 (모바일 앱 기반)

// 이벤트 배너 (모바일: eventBanners)
export interface EventBannerItem {
  id: string
  imageUrl: string
  title: string
  link: string
}

// 카테고리 필터 (모바일: eventFilters + 기본 정렬)
export interface CategoryFilter {
  code: string
  label: string
}

// 숙소 카드 (모바일: searchedMotels)
export interface HomeMotel {
  id: string
  name: string
  location: string
  imageUrl: string
  rating: number
  reviewCount: number
  rentalTime?: string
  rentalPrice?: number
  stayTime?: string
  stayPrice: number
  stayOriginalPrice?: number
  benefitPointRate: number
  eventTitle?: string
  tags?: string[]
}

// 이벤트 배너 데이터
export const eventBanners: EventBannerItem[] = [
  {
    id: "banner-1",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=400&fit=crop",
    title: "봄맞이 특가 최대 50% 할인",
    link: "/search?sort=price-asc",
  },
  {
    id: "banner-2",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop",
    title: "제주 인기 숙소 마일리지 2배 적립",
    link: "/search?region=jeju",
  },
  {
    id: "banner-3",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=400&fit=crop",
    title: "신규 회원 첫 예약 5,000원 쿠폰",
    link: "/coupons",
  },
]

// 카테고리 필터 데이터
export const categoryFilters: CategoryFilter[] = [
  { code: "rating", label: "평점순" },
  { code: "price-asc", label: "낮은가격" },
  { code: "mileage", label: "마일리지" },
  { code: "popular", label: "인기순" },
]

// 숙소 카드 데이터
export const homeMotels: HomeMotel[] = [
  {
    id: "1",
    name: "파라다이스 호텔 부산",
    location: "해운대구",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    rating: 4.8,
    reviewCount: 2341,
    rentalTime: "최대 4시간",
    rentalPrice: 80000,
    stayTime: "오후 03:00~",
    stayPrice: 289000,
    stayOriginalPrice: 350000,
    benefitPointRate: 5,
    eventTitle: "얼리체크인 이벤트",
    tags: ["조식포함", "수영장"],
  },
  {
    id: "2",
    name: "그랜드 하얏트 제주",
    location: "서귀포시",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    rating: 4.9,
    reviewCount: 1876,
    stayTime: "오후 03:00~",
    stayPrice: 420000,
    benefitPointRate: 3,
    tags: ["오션뷰", "스파"],
  },
  {
    id: "3",
    name: "세인트존스 호텔",
    location: "강릉 강문동",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    rating: 4.7,
    reviewCount: 943,
    rentalTime: "최대 3시간",
    rentalPrice: 55000,
    stayTime: "오후 06:00~",
    stayPrice: 198000,
    stayOriginalPrice: 250000,
    benefitPointRate: 7,
    eventTitle: "연박 10% 추가 할인",
  },
  {
    id: "4",
    name: "롯데호텔 서울",
    location: "서울 중구",
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
    rating: 4.6,
    reviewCount: 3201,
    stayTime: "오후 03:00~",
    stayPrice: 380000,
    benefitPointRate: 4,
    tags: ["수영장", "피트니스"],
  },
  {
    id: "5",
    name: "메종 글래드 제주",
    location: "제주시",
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    rating: 4.5,
    reviewCount: 1234,
    rentalTime: "최대 4시간",
    rentalPrice: 65000,
    stayTime: "오후 05:00~",
    stayPrice: 245000,
    stayOriginalPrice: 300000,
    benefitPointRate: 5,
    tags: ["조식포함", "오션뷰"],
  },
  {
    id: "6",
    name: "호텔 스카이파크 명동",
    location: "서울 중구",
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    rating: 4.3,
    reviewCount: 2876,
    rentalTime: "최대 3시간",
    rentalPrice: 40000,
    stayTime: "오후 09:00~",
    stayPrice: 129000,
    benefitPointRate: 8,
    eventTitle: "평일 특가",
    tags: ["역세권"],
  },
]

// 히어로 배경
export const heroBackgrounds = [
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=1080&fit=crop",
]

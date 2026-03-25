// 홈 화면 목업 데이터 (모바일 앱 기반 확장)

// 업태 카테고리
export interface BusinessType {
  code: string
  label: string
  emoji: string
  href: string
}

export const businessTypes: BusinessType[] = [
  { code: "motel", label: "모텔", emoji: "🏨", href: "/search?type=motel" },
  { code: "hotel_resort", label: "호텔·리조트", emoji: "🏢", href: "/search?type=hotel_resort" },
  { code: "pension", label: "펜션", emoji: "🏡", href: "/search?type=pension" },
  { code: "camping_glamping", label: "캠핑·글램핑", emoji: "⛺", href: "/search?type=camping_glamping" },
  { code: "guesthouse_hanok", label: "게하·한옥", emoji: "🛏️", href: "/search?type=guesthouse_hanok" },
  { code: "event", label: "이벤트", emoji: "🎉", href: "/events" },
  { code: "exhibition", label: "기획전", emoji: "📋", href: "/exhibitions" },
  { code: "rentcar", label: "렌터카", emoji: "🚗", href: "/rentcar" },
]

// 이벤트 배너
export interface EventBannerItem {
  id: string
  imageUrl: string
  title: string
  subtitle?: string
  link: string
}

export const eventBanners: EventBannerItem[] = [
  {
    id: "banner-1",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1200&h=400&fit=crop",
    title: "봄맞이 특가 최대 50% 할인",
    subtitle: "3월 한정 프로모션",
    link: "/search?sort=price-asc",
  },
  {
    id: "banner-2",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=1200&h=400&fit=crop",
    title: "제주 인기 숙소 마일리지 2배 적립",
    subtitle: "제주 여행의 모든 것",
    link: "/search?region=jeju",
  },
  {
    id: "banner-3",
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1200&h=400&fit=crop",
    title: "신규 회원 첫 예약 5,000원 쿠폰",
    subtitle: "지금 가입하고 혜택 받으세요",
    link: "/coupons",
  },
]

// 프로모션 카드
export interface PromoCard {
  id: string
  title: string
  description: string
  icon: string
  color: string
  href: string
}

export const promoCards: PromoCard[] = [
  {
    id: "promo-1",
    title: "무제한 혜택",
    description: "매일 새로운 쿠폰과 마일리지 적립",
    icon: "🎁",
    color: "from-violet-500/10 to-purple-500/10 border-violet-200",
    href: "/coupons",
  },
  {
    id: "promo-2",
    title: "국내 최저가",
    description: "최저가 보상제로 차액 200% 보상",
    icon: "💰",
    color: "from-amber-500/10 to-yellow-500/10 border-amber-200",
    href: "/search?sort=price-asc",
  },
  {
    id: "promo-3",
    title: "첫예약 선물",
    description: "첫 예약 완료 시 5,000P 즉시 지급",
    icon: "🎉",
    color: "from-rose-500/10 to-pink-500/10 border-rose-200",
    href: "/register",
  },
]

// 최근 본 숙소
export interface RecentMotel {
  id: string
  name: string
  location: string
  imageUrl: string
  stayPrice: number
  rating: number
}

export const recentMotels: RecentMotel[] = [
  { id: "1", name: "파라다이스 호텔 부산", location: "해운대구", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=300&h=200&fit=crop", stayPrice: 289000, rating: 4.8 },
  { id: "3", name: "세인트존스 호텔", location: "강릉 강문동", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=300&h=200&fit=crop", stayPrice: 198000, rating: 4.7 },
  { id: "5", name: "메종 글래드 제주", location: "제주시", imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=300&h=200&fit=crop", stayPrice: 245000, rating: 4.5 },
  { id: "6", name: "호텔 스카이파크 명동", location: "서울 중구", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=300&h=200&fit=crop", stayPrice: 129000, rating: 4.3 },
]

// 기획전
export interface FeatureItem {
  id: string
  title: string
  subtitle: string
  imageUrl: string
  href: string
}

export const featureItems: FeatureItem[] = [
  {
    id: "feat-1",
    title: "벚꽃 시즌 특별 숙소",
    subtitle: "봄을 만끽할 수 있는 숙소 모음",
    imageUrl: "https://images.unsplash.com/photo-1522383225653-ed111181a951?w=600&h=400&fit=crop",
    href: "/search?event=cherry-blossom",
  },
  {
    id: "feat-2",
    title: "오션뷰 베스트",
    subtitle: "바다가 보이는 인기 숙소 TOP 20",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    href: "/search?event=oceanview",
  },
  {
    id: "feat-3",
    title: "가성비 숙소 모음",
    subtitle: "10만원 이하 인기 숙소",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=600&h=400&fit=crop",
    href: "/search?sort=price-asc",
  },
]

// 지역별 추천 숙소
export interface RegionRecommendation {
  region: string
  label: string
  motels: {
    id: string
    name: string
    imageUrl: string
    stayPrice: number
    stayOriginalPrice?: number
    rating: number
    reviewCount: number
    benefitPointRate: number
  }[]
}

export const regionRecommendations: RegionRecommendation[] = [
  {
    region: "seoul",
    label: "서울",
    motels: [
      { id: "r-1", name: "롯데호텔 서울", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop", stayPrice: 380000, rating: 4.6, reviewCount: 3201, benefitPointRate: 4 },
      { id: "r-2", name: "호텔 스카이파크 명동", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=400&h=300&fit=crop", stayPrice: 129000, rating: 4.3, reviewCount: 2876, benefitPointRate: 8 },
      { id: "r-3", name: "스위소텔 앰배서더", imageUrl: "https://images.unsplash.com/photo-1563911302283-d2bc129e7570?w=400&h=300&fit=crop", stayPrice: 298000, rating: 4.6, reviewCount: 2134, benefitPointRate: 5 },
      { id: "r-4", name: "노보텔 앰배서더 동대문", imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop", stayPrice: 210000, stayOriginalPrice: 260000, rating: 4.5, reviewCount: 1567, benefitPointRate: 6 },
    ],
  },
  {
    region: "jeju",
    label: "제주",
    motels: [
      { id: "r-5", name: "그랜드 하얏트 제주", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=400&h=300&fit=crop", stayPrice: 420000, rating: 4.9, reviewCount: 1876, benefitPointRate: 3 },
      { id: "r-6", name: "메종 글래드 제주", imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=400&h=300&fit=crop", stayPrice: 245000, stayOriginalPrice: 300000, rating: 4.5, reviewCount: 1234, benefitPointRate: 5 },
      { id: "r-7", name: "제주 에코 스테이", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=400&h=300&fit=crop", stayPrice: 180000, stayOriginalPrice: 220000, rating: 4.9, reviewCount: 328, benefitPointRate: 7 },
      { id: "r-8", name: "해비치 호텔앤드리조트", imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=400&h=300&fit=crop", stayPrice: 350000, rating: 4.7, reviewCount: 1543, benefitPointRate: 4 },
    ],
  },
  {
    region: "busan",
    label: "부산",
    motels: [
      { id: "r-9", name: "파라다이스 호텔 부산", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=300&fit=crop", stayPrice: 289000, stayOriginalPrice: 350000, rating: 4.8, reviewCount: 2341, benefitPointRate: 5 },
      { id: "r-10", name: "시그니엘 부산", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=400&h=300&fit=crop", stayPrice: 520000, rating: 4.9, reviewCount: 987, benefitPointRate: 3 },
      { id: "r-11", name: "해운대 그랜드 호텔", imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=400&h=300&fit=crop", stayPrice: 198000, stayOriginalPrice: 240000, rating: 4.4, reviewCount: 1890, benefitPointRate: 6 },
      { id: "r-12", name: "센텀 프리미어 호텔", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=400&h=300&fit=crop", stayPrice: 165000, rating: 4.3, reviewCount: 876, benefitPointRate: 8 },
    ],
  },
]

// 매거진
export interface MagazineItem {
  id: string
  title: string
  description: string
  imageUrl: string
  category: string
  href: string
}

export const magazineItems: MagazineItem[] = [
  {
    id: "mag-1",
    title: "2026 봄 여행 트렌드 TOP 5",
    description: "올해 봄, 여행자들이 가장 주목하는 여행 스타일은?",
    imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=600&h=400&fit=crop",
    category: "트렌드",
    href: "/magazine/spring-trend",
  },
  {
    id: "mag-2",
    title: "제주 숨은 카페 로드",
    description: "현지인만 아는 제주 감성 카페 8곳",
    imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=600&h=400&fit=crop",
    category: "로컬",
    href: "/magazine/jeju-cafe",
  },
  {
    id: "mag-3",
    title: "아이와 함께하는 가족 여행",
    description: "키즈 프렌들리 숙소와 주변 놀거리 추천",
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=600&h=400&fit=crop",
    category: "가족",
    href: "/magazine/family-travel",
  },
]

export const heroBackgrounds = [
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=1080&fit=crop",
]

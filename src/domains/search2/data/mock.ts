import type { Search2Accommodation, BentoSize, SortOption } from "../types"

// 벤토 레이아웃 패턴 (8개 아이템 기준)
export const bentoPattern: BentoSize[] = [
  "large",  // 2x2 - Featured
  "small",  // 1x1
  "small",  // 1x1
  "wide",   // 2x1
  "tall",   // 1x2
  "small",  // 1x1
  "small",  // 1x1
  "wide",   // 2x1
]

// Mock 숙소 데이터
export const search2MockData: Search2Accommodation[] = [
  {
    id: "s2-1",
    name: "제주 에코 스테이",
    location: "제주시 애월읍",
    price: 180000,
    originalPrice: 220000,
    rating: 4.9,
    reviewCount: 328,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
    images: [
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=800&q=80",
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    ],
    tags: ["오션뷰", "조식포함"],
    badges: ["eco", "localPick"],
    lifestyle: ["eco", "quiet", "oceanview"],
    localHighlight: "월정리 해변 도보 5분",
    bentoSize: "large",
  },
  {
    id: "s2-2",
    name: "서귀포 프리미엄 풀빌라",
    location: "서귀포시 중문동",
    price: 350000,
    originalPrice: 420000,
    rating: 4.8,
    reviewCount: 215,
    imageUrl: "https://images.unsplash.com/photo-1582719508461-905c673771fd?w=800&q=80",
    tags: ["프라이빗 풀", "럭셔리"],
    badges: ["premium"],
    lifestyle: ["luxury", "romantic", "quiet"],
    bentoSize: "small",
  },
  {
    id: "s2-3",
    name: "애월 오션뷰 펜션",
    location: "제주시 애월읍",
    price: 150000,
    rating: 4.7,
    reviewCount: 189,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&q=80",
    tags: ["오션뷰"],
    badges: ["new"],
    lifestyle: ["oceanview", "family"],
    bentoSize: "small",
  },
  {
    id: "s2-4",
    name: "한림 워케이션 스튜디오",
    location: "제주시 한림읍",
    price: 120000,
    rating: 4.6,
    reviewCount: 156,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=800&q=80",
    tags: ["워크스테이션", "장기할인"],
    badges: ["eco"],
    lifestyle: ["workstation", "quiet"],
    localHighlight: "협재해변 차로 10분",
    bentoSize: "wide",
  },
  {
    id: "s2-5",
    name: "성산 일출봉 뷰 호텔",
    location: "서귀포시 성산읍",
    price: 200000,
    originalPrice: 250000,
    rating: 4.8,
    reviewCount: 402,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=800&q=80",
    tags: ["일출명소", "조식포함"],
    badges: ["localPick"],
    lifestyle: ["romantic", "oceanview"],
    bentoSize: "tall",
  },
  {
    id: "s2-6",
    name: "제주 힐링 독채",
    location: "제주시 조천읍",
    price: 170000,
    rating: 4.7,
    reviewCount: 98,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=800&q=80",
    tags: ["독채", "바베큐"],
    badges: ["eco"],
    lifestyle: ["quiet", "family", "eco"],
    bentoSize: "small",
  },
  {
    id: "s2-7",
    name: "서귀포 펫프렌들리 숙소",
    location: "서귀포시 남원읍",
    price: 140000,
    rating: 4.5,
    reviewCount: 76,
    imageUrl: "https://images.unsplash.com/photo-1596394516093-501ba68a0ba6?w=800&q=80",
    tags: ["반려동물", "정원"],
    lifestyle: ["pet", "family"],
    bentoSize: "small",
  },
  {
    id: "s2-8",
    name: "제주 럭셔리 부티크 호텔",
    location: "제주시 연동",
    price: 280000,
    originalPrice: 350000,
    rating: 4.9,
    reviewCount: 521,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=800&q=80",
    tags: ["스파", "루프탑"],
    badges: ["premium"],
    lifestyle: ["luxury", "romantic"],
    bentoSize: "wide",
  },
  // 추가 아이템들
  {
    id: "s2-9",
    name: "함덕 비치 게스트하우스",
    location: "제주시 조천읍",
    price: 80000,
    rating: 4.4,
    reviewCount: 234,
    imageUrl: "https://images.unsplash.com/photo-1445019980597-93fa8acb246c?w=800&q=80",
    tags: ["함덕해변", "가성비"],
    lifestyle: ["oceanview", "family"],
    bentoSize: "small",
  },
  {
    id: "s2-10",
    name: "우도 프라이빗 빌라",
    location: "제주시 우도면",
    price: 250000,
    rating: 4.8,
    reviewCount: 167,
    imageUrl: "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=800&q=80",
    tags: ["우도", "섬속의섬"],
    badges: ["localPick"],
    lifestyle: ["quiet", "romantic", "oceanview"],
    bentoSize: "wide",
  },
  {
    id: "s2-11",
    name: "제주 가족 리조트",
    location: "서귀포시 색달동",
    price: 190000,
    originalPrice: 230000,
    rating: 4.6,
    reviewCount: 312,
    imageUrl: "https://images.unsplash.com/photo-1584132967334-10e028bd69f7?w=800&q=80",
    tags: ["키즈존", "워터파크"],
    lifestyle: ["family"],
    bentoSize: "small",
  },
  {
    id: "s2-12",
    name: "한라산 뷰 글램핑",
    location: "제주시 봉개동",
    price: 160000,
    rating: 4.7,
    reviewCount: 89,
    imageUrl: "https://images.unsplash.com/photo-1504280390367-361c6d9f38f4?w=800&q=80",
    tags: ["글램핑", "한라산뷰"],
    badges: ["eco", "new"],
    lifestyle: ["eco", "romantic", "quiet"],
    bentoSize: "small",
  },
]

// 정렬 옵션
export const sortOptions: SortOption[] = [
  { value: "recommend", label: "추천순" },
  { value: "price-asc", label: "가격 낮은순" },
  { value: "price-desc", label: "가격 높은순" },
  { value: "rating", label: "평점 높은순" },
  { value: "review", label: "리뷰 많은순" },
]

// 검색 결과 총 개수 (가상)
export const totalSearchResults = 234

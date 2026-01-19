// 홈 화면 목업 데이터

export interface Accommodation {
  id: string
  name: string
  location: string
  price: number
  originalPrice?: number
  rating: number
  reviewCount: number
  imageUrl: string
  tags?: string[]
  isSoldOut?: boolean
}

export interface Region {
  id: string
  name: string
  imageUrl: string
  accommodationCount: number
}

export interface CurationItem {
  id: string
  title: string
  subtitle?: string
  imageUrl: string
  link: string
  size: "large" | "wide" | "tall" | "small"
}

// 인기 지역 데이터
export const popularRegions: Region[] = [
  {
    id: "1",
    name: "제주",
    imageUrl: "https://images.unsplash.com/photo-1590523278191-995cbcda646b?w=400&h=300&fit=crop",
    accommodationCount: 2341,
  },
  {
    id: "2",
    name: "부산",
    imageUrl: "https://images.unsplash.com/photo-1596422846543-75c6fc197f07?w=400&h=300&fit=crop",
    accommodationCount: 1892,
  },
  {
    id: "3",
    name: "강릉",
    imageUrl: "https://images.unsplash.com/photo-1551918120-9739cb430c6d?w=400&h=300&fit=crop",
    accommodationCount: 987,
  },
  {
    id: "4",
    name: "경주",
    imageUrl: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=400&h=300&fit=crop",
    accommodationCount: 756,
  },
  {
    id: "5",
    name: "여수",
    imageUrl: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=300&fit=crop",
    accommodationCount: 643,
  },
  {
    id: "6",
    name: "속초",
    imageUrl: "https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=400&h=300&fit=crop",
    accommodationCount: 521,
  },
  {
    id: "7",
    name: "전주",
    imageUrl: "https://images.unsplash.com/photo-1594849667839-5e3ce3dd439d?w=400&h=300&fit=crop",
    accommodationCount: 432,
  },
]

// 이번 주 추천 큐레이션 데이터
export const curationItems: CurationItem[] = [
  {
    id: "1",
    title: "겨울 바다가 보고 싶을 때",
    subtitle: "감성 오션뷰 숙소",
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=800&h=600&fit=crop",
    link: "/curation/ocean-view",
    size: "large",
  },
  {
    id: "2",
    title: "커플 인기 숙소",
    subtitle: "분위기 있는 프라이빗 공간",
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    link: "/curation/couple",
    size: "wide",
  },
  {
    id: "3",
    title: "럭셔리 호캉스",
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=400&h=600&fit=crop",
    link: "/curation/luxury",
    size: "tall",
  },
  {
    id: "4",
    title: "가성비 숙소",
    imageUrl: "https://images.unsplash.com/photo-1631049307264-da0ec9d70304?w=400&h=300&fit=crop",
    link: "/curation/budget",
    size: "small",
  },
]

// MD 추천 숙소 데이터
export const featuredAccommodations: Accommodation[] = [
  {
    id: "1",
    name: "파라다이스 호텔 부산",
    location: "부산 해운대구",
    price: 289000,
    originalPrice: 350000,
    rating: 4.8,
    reviewCount: 2341,
    imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=600&h=400&fit=crop",
    tags: ["조식포함", "수영장"],
  },
  {
    id: "2",
    name: "그랜드 하얏트 제주",
    location: "제주 서귀포시",
    price: 420000,
    rating: 4.9,
    reviewCount: 1876,
    imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=600&h=400&fit=crop",
    tags: ["오션뷰", "스파"],
  },
  {
    id: "3",
    name: "세인트존스 호텔",
    location: "강릉 강문동",
    price: 198000,
    originalPrice: 250000,
    rating: 4.7,
    reviewCount: 943,
    imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=600&h=400&fit=crop",
    tags: ["조식포함"],
  },
  {
    id: "4",
    name: "롯데호텔 서울",
    location: "서울 중구",
    price: 380000,
    rating: 4.6,
    reviewCount: 3201,
    imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=600&h=400&fit=crop",
    tags: ["수영장", "피트니스"],
  },
  {
    id: "5",
    name: "메종 글래드 제주",
    location: "제주 제주시",
    price: 245000,
    originalPrice: 300000,
    rating: 4.5,
    reviewCount: 1234,
    imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=600&h=400&fit=crop",
    tags: ["조식포함", "오션뷰"],
  },
  {
    id: "6",
    name: "호텔 스카이파크 명동",
    location: "서울 중구",
    price: 129000,
    rating: 4.3,
    reviewCount: 2876,
    imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=600&h=400&fit=crop",
    tags: ["역세권"],
  },
  {
    id: "7",
    name: "시그니엘 부산",
    location: "부산 해운대구",
    price: 520000,
    rating: 4.9,
    reviewCount: 987,
    imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=600&h=400&fit=crop",
    tags: ["럭셔리", "오션뷰"],
  },
  {
    id: "8",
    name: "설악 켄싱턴 스타",
    location: "속초 설악동",
    price: 175000,
    originalPrice: 220000,
    rating: 4.4,
    reviewCount: 654,
    imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=600&h=400&fit=crop",
    tags: ["마운틴뷰", "조식포함"],
  },
]

// 히어로 섹션 배경 이미지들
export const heroBackgrounds = [
  "https://images.unsplash.com/photo-1571003123894-1f0594d2b5d9?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=1920&h=1080&fit=crop",
  "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=1920&h=1080&fit=crop",
]

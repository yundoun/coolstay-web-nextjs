/* ── 검색 자동완성 데이터 ── */

/** 키워드 자동완성용 지역/관광지명 */
export const AUTOCOMPLETE_KEYWORDS = [
  "오이도", "용인", "을왕리", "양양", "안양", "여의도",
  "대구", "서면", "경주", "부산", "서울", "해운대", "강남", "제주",
  "속초", "전주", "동대문", "명동", "강릉", "여수", "서귀포",
  "인천", "수원", "대전", "광주", "울산", "춘천", "목포",
]

/** 지역 제안 (📍 지역, 🚇 역) */
export type RegionSuggestion = {
  name: string
  icon: "pin" | "train"
  area?: string
}

export const REGION_SUGGESTIONS: RegionSuggestion[] = [
  { name: "서울 전체", icon: "pin", area: "서울" },
  { name: "서울 강남/역삼", icon: "pin", area: "서울" },
  { name: "서울 홍대/합정/마포", icon: "pin", area: "서울" },
  { name: "서울 명동/을지로", icon: "pin", area: "서울" },
  { name: "서울역", icon: "train", area: "서울" },
  { name: "부산 전체", icon: "pin", area: "부산" },
  { name: "부산 해운대/센텀", icon: "pin", area: "부산" },
  { name: "부산 서면/부산역", icon: "pin", area: "부산" },
  { name: "부산역", icon: "train", area: "부산" },
  { name: "제주 전체", icon: "pin", area: "제주" },
  { name: "제주시", icon: "pin", area: "제주" },
  { name: "서귀포시", icon: "pin", area: "제주" },
  { name: "강남역", icon: "train", area: "서울" },
  { name: "홍대입구역", icon: "train", area: "서울" },
  { name: "해운대역", icon: "train", area: "부산" },
  { name: "강릉역", icon: "train", area: "강원" },
  { name: "경주역", icon: "train", area: "경북" },
  { name: "전주역", icon: "train", area: "전북" },
  { name: "대구역", icon: "train", area: "대구" },
  { name: "대전역", icon: "train", area: "대전" },
  { name: "인천 전체", icon: "pin", area: "인천" },
  { name: "강릉 전체", icon: "pin", area: "강원" },
  { name: "속초 전체", icon: "pin", area: "강원" },
  { name: "여수 전체", icon: "pin", area: "전남" },
  { name: "경주 전체", icon: "pin", area: "경북" },
]

/** 숙소 자동완성 데이터 */
export type AccommodationSuggestion = {
  id: string
  name: string
  type: string
  location: string
  imageUrl: string
}

export const ACCOMMODATION_SUGGESTIONS: AccommodationSuggestion[] = [
  { id: "1", name: "파라다이스 호텔 부산", type: "호텔/리조트", location: "부산", imageUrl: "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=80&h=80&fit=crop" },
  { id: "2", name: "그랜드 하얏트 제주", type: "호텔/리조트", location: "제주", imageUrl: "https://images.unsplash.com/photo-1520250497591-112f2f40a3f4?w=80&h=80&fit=crop" },
  { id: "3", name: "세인트존스 호텔", type: "호텔/리조트", location: "강원", imageUrl: "https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=80&h=80&fit=crop" },
  { id: "6", name: "호텔 스카이파크 명동", type: "호텔/리조트", location: "서울", imageUrl: "https://images.unsplash.com/photo-1618773928121-c32242e63f39?w=80&h=80&fit=crop" },
  { id: "4", name: "롯데호텔 서울", type: "호텔/리조트", location: "서울", imageUrl: "https://images.unsplash.com/photo-1551882547-ff40c63fe5fa?w=80&h=80&fit=crop" },
  { id: "5", name: "메종 글래드 제주", type: "호텔/리조트", location: "제주", imageUrl: "https://images.unsplash.com/photo-1564501049412-61c2a3083791?w=80&h=80&fit=crop" },
  { id: "7", name: "해운대 그랜드 호텔", type: "호텔/리조트", location: "부산", imageUrl: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=80&h=80&fit=crop" },
  { id: "8", name: "경주 힐튼 호텔", type: "호텔/리조트", location: "경주", imageUrl: "https://images.unsplash.com/photo-1542314831-068cd1dbfeeb?w=80&h=80&fit=crop" },
]

/** 인기검색어 (헤더 드롭다운 + 검색 페이지 공유) */
export const POPULAR_KEYWORDS = [
  "해운대",
  "제주 오션뷰",
  "강남 호텔",
  "속초 펜션",
  "경주 한옥",
  "여수 바다",
  "전주 한옥마을",
  "부산 광안리",
  "강릉 커피",
  "서울 호캉스",
]

/** 해시태그 키워드 (검색 페이지 인기 키워드 칩) */
export const HASHTAG_KEYWORDS = [
  "수영장",
  "바베큐",
  "스파",
  "오션뷰",
  "루프탑",
  "넷플릭스",
  "조식포함",
  "애견동반",
  "커플추천",
  "가족여행",
  "파티룸",
  "키즈풀",
]

/* ── 제안 로직 ── */

export function suggestKeywords(query: string) {
  if (!query) return []
  return AUTOCOMPLETE_KEYWORDS.filter((k) => k.includes(query)).slice(0, 5)
}

export function suggestRegions(query: string) {
  if (!query) return []
  return REGION_SUGGESTIONS.filter((r) => r.name.includes(query) || (r.area && r.area.includes(query))).slice(0, 5)
}

export function suggestAccommodations(query: string) {
  if (!query) return []
  return ACCOMMODATION_SUGGESTIONS.filter(
    (a) => a.name.includes(query) || a.location.includes(query)
  ).slice(0, 3)
}

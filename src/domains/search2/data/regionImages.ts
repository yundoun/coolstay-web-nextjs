import type { RegionImage } from "../types"

export const regionImages: RegionImage[] = [
  {
    region: "jeju",
    label: "제주",
    heroImage: "https://images.unsplash.com/photo-1590523741831-ab7e8b8f9c7f?w=1920&q=80",
    description: "제주의 숨겨진 보석들을 발견하세요",
  },
  {
    region: "busan",
    label: "부산",
    heroImage: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&q=80",
    description: "부산의 특별한 공간을 만나보세요",
  },
  {
    region: "gangneung",
    label: "강릉",
    heroImage: "https://images.unsplash.com/photo-1596178065887-1198b6148b2b?w=1920&q=80",
    description: "강릉에서 바다와 커피 한 잔의 여유를",
  },
  {
    region: "gyeongju",
    label: "경주",
    heroImage: "https://images.unsplash.com/photo-1534502746855-7ea4a6b27b64?w=1920&q=80",
    description: "천년 고도의 품격 있는 하룻밤",
  },
  {
    region: "yeosu",
    label: "여수",
    heroImage: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=1920&q=80",
    description: "여수 밤바다의 낭만을 품다",
  },
  {
    region: "sokcho",
    label: "속초",
    heroImage: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=1920&q=80",
    description: "설악과 바다가 만나는 곳",
  },
  {
    region: "jeonju",
    label: "전주",
    heroImage: "https://images.unsplash.com/photo-1583417319070-4a69db38a482?w=1920&q=80",
    description: "한옥마을의 정취를 느끼다",
  },
  {
    region: "seoul",
    label: "서울",
    heroImage: "https://images.unsplash.com/photo-1538485399081-7191377e8241?w=1920&q=80",
    description: "서울에서 즐기는 특별한 호캉스",
  },
]

// 기본 히어로 이미지 (지역 미선택 시)
export const defaultHeroImage: RegionImage = {
  region: "default",
  label: "전국",
  heroImage: "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=1920&q=80",
  description: "꿀같은 휴식을 위한 완벽한 숙소",
}

export function getRegionImage(region?: string): RegionImage {
  if (!region) return defaultHeroImage
  return regionImages.find((r) => r.region === region) || defaultHeroImage
}

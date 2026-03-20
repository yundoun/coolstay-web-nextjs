export interface RegionArea {
  name: string
}

export interface CityRegion {
  city: string
  areas: RegionArea[]
}

export const cityRegions: CityRegion[] = [
  {
    city: "서울",
    areas: [
      { name: "강남/역삼/삼성" },
      { name: "서초/교대/방배" },
      { name: "잠실/송파/강동" },
      { name: "명동/을지로/종로" },
      { name: "홍대/합정/마포" },
      { name: "영등포/여의도" },
      { name: "건대/성수/왕십리" },
      { name: "신촌/이대/아현" },
    ],
  },
  {
    city: "부산",
    areas: [
      { name: "해운대/마린시티" },
      { name: "서면/부산진" },
      { name: "광안리/수영" },
      { name: "남포동/자갈치" },
      { name: "센텀시티" },
      { name: "기장/일광" },
    ],
  },
  {
    city: "제주",
    areas: [
      { name: "제주시/공항" },
      { name: "서귀포" },
      { name: "중문/색달" },
      { name: "애월/한림" },
      { name: "성산/우도" },
      { name: "함덕/조천" },
    ],
  },
  {
    city: "경기",
    areas: [
      { name: "수원/화성" },
      { name: "용인/기흥" },
      { name: "파주/일산" },
      { name: "가평/양평" },
      { name: "동탄/오산" },
      { name: "안양/과천" },
    ],
  },
  {
    city: "인천",
    areas: [
      { name: "송도/연수" },
      { name: "부평/계양" },
      { name: "중구/을왕리" },
      { name: "강화/영종" },
    ],
  },
  {
    city: "강원",
    areas: [
      { name: "강릉/주문진" },
      { name: "속초/양양" },
      { name: "춘천/홍천" },
      { name: "평창/정선" },
      { name: "원주/횡성" },
    ],
  },
  {
    city: "대구",
    areas: [
      { name: "동성로/중앙" },
      { name: "수성구/범어" },
      { name: "동대구역/신천" },
    ],
  },
  {
    city: "대전",
    areas: [
      { name: "유성구/온천동" },
      { name: "둔산동/서구" },
      { name: "대전역/동구" },
    ],
  },
  {
    city: "경주",
    areas: [
      { name: "보문단지" },
      { name: "불국사/석굴암" },
      { name: "경주시내" },
      { name: "양남/감포" },
    ],
  },
  {
    city: "여수",
    areas: [
      { name: "여수시내" },
      { name: "돌산/향일암" },
      { name: "여수엑스포" },
    ],
  },
]

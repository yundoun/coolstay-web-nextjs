import type { LocalCuration } from "../types"

export const localCurations: Record<string, LocalCuration> = {
  jeju: {
    region: "jeju",
    title: "현지인이 추천하는 제주 스팟",
    items: [
      {
        id: "lc-jeju-1",
        type: "restaurant",
        name: "흑돼지거리 맛집",
        description: "제주 토종 흑돼지의 진짜 맛",
        imageUrl: "https://images.unsplash.com/photo-1544025162-d76694265947?w=400&q=80",
        distance: "숙소에서 10분",
      },
      {
        id: "lc-jeju-2",
        type: "cafe",
        name: "월정리 해변 카페",
        description: "에메랄드빛 바다를 바라보며",
        imageUrl: "https://images.unsplash.com/photo-1495474472287-4d71bcdd2085?w=400&q=80",
        distance: "숙소에서 15분",
      },
      {
        id: "lc-jeju-3",
        type: "spot",
        name: "비자림 숲길",
        description: "천년 비자나무 숲에서의 힐링",
        imageUrl: "https://images.unsplash.com/photo-1448375240586-882707db888b?w=400&q=80",
        distance: "숙소에서 20분",
      },
    ],
  },
  busan: {
    region: "busan",
    title: "부산 로컬이 사랑하는 공간",
    items: [
      {
        id: "lc-busan-1",
        type: "restaurant",
        name: "자갈치 시장 회센터",
        description: "싱싱한 해산물의 천국",
        imageUrl: "https://images.unsplash.com/photo-1579631542720-3a87824fff86?w=400&q=80",
        distance: "숙소에서 5분",
      },
      {
        id: "lc-busan-2",
        type: "cafe",
        name: "전포 카페거리",
        description: "힙한 분위기의 로스터리 카페",
        imageUrl: "https://images.unsplash.com/photo-1501339847302-ac426a4a7cbb?w=400&q=80",
        distance: "숙소에서 10분",
      },
      {
        id: "lc-busan-3",
        type: "spot",
        name: "이기대 해안 산책로",
        description: "오륙도를 바라보는 절경",
        imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e?w=400&q=80",
        distance: "숙소에서 25분",
      },
    ],
  },
  gangneung: {
    region: "gangneung",
    title: "강릉 숨은 명소 가이드",
    items: [
      {
        id: "lc-gangneung-1",
        type: "cafe",
        name: "안목 커피거리",
        description: "동해 일출과 함께하는 커피",
        imageUrl: "https://images.unsplash.com/photo-1442512595331-e89e73853f31?w=400&q=80",
        distance: "숙소에서 8분",
      },
      {
        id: "lc-gangneung-2",
        type: "restaurant",
        name: "초당 순두부마을",
        description: "강릉의 대표 로컬 맛집",
        imageUrl: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&q=80",
        distance: "숙소에서 12분",
      },
      {
        id: "lc-gangneung-3",
        type: "spot",
        name: "경포 솔숲길",
        description: "소나무 향기 가득한 산책",
        imageUrl: "https://images.unsplash.com/photo-1476231682828-37e571bc172f?w=400&q=80",
        distance: "숙소에서 5분",
      },
    ],
  },
}

export const defaultCuration: LocalCuration = {
  region: "default",
  title: "여행자들이 사랑한 로컬 스팟",
  items: [
    {
      id: "lc-default-1",
      type: "spot",
      name: "숨겨진 명소 탐험",
      description: "지역을 선택하면 맞춤 추천을 받아보세요",
      imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=400&q=80",
    },
    {
      id: "lc-default-2",
      type: "restaurant",
      name: "로컬 맛집",
      description: "현지인만 아는 찐 맛집",
      imageUrl: "https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=400&q=80",
    },
    {
      id: "lc-default-3",
      type: "cafe",
      name: "분위기 좋은 카페",
      description: "여행의 여유를 더하는 공간",
      imageUrl: "https://images.unsplash.com/photo-1445116572660-236099ec97a0?w=400&q=80",
    },
  ],
}

export function getLocalCuration(region?: string): LocalCuration {
  if (!region) return defaultCuration
  return localCurations[region] || defaultCuration
}

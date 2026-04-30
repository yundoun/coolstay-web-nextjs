import { api } from "@/lib/api/client"
import type {
  MagazineHomeResponse,
  RegionsResponse,
  BoardListResponse,
  BoardDetailResponse,
  PackageListResponse,
  PackageDetailResponse,
  PackageBannerResponse,
  MagazineStoreListResponse,
  TourApiResponse,
  BoardType,
} from "../types"

/** 매거진 홈 — 배너/동영상/게시글/패키지 4개 섹션 */
export function getMagazineHome(params?: {
  provinceCode?: string
  code?: string
}) {
  return api.get<MagazineHomeResponse>("/aiMagazine/home", {
    provinceCode: params?.provinceCode,
    code: params?.code,
  })
}

/** 지역 선택 — 정적 캐시 데이터 */
export function getMagazineRegions() {
  return api.get<RegionsResponse>("/aiMagazine/regions")
}

/** 게시글 목록 — 타입 필터 + 커서 페이징 */
export function getBoardList(params?: {
  type?: BoardType
  cursor?: string
  count?: number
}) {
  return api.get<BoardListResponse>("/aiMagazine/board/list", {
    type: params?.type,
    cursor: params?.cursor,
    count: params?.count ?? 10,
  })
}

/** 게시글 상세 */
export function getBoardDetail(key: number) {
  return api.get<BoardDetailResponse>("/aiMagazine/board/detail", { key })
}

/** 패키지 목록 — 커서 페이징 */
export function getPackageList(params?: {
  cursor?: string
  count?: number
}) {
  return api.get<PackageListResponse>("/aiMagazine/package/list", {
    cursor: params?.cursor,
    count: params?.count ?? 20,
  })
}

/** 패키지 상세 */
export function getPackageDetail(params: {
  key: number
  sales_date?: string
  customer_count?: string
}) {
  return api.get<PackageDetailResponse>("/aiMagazine/package/detail", {
    key: params.key,
    sales_date: params.sales_date,
    customer_count: params.customer_count,
  })
}

/** 추천 숙소 — 위치 기반 10km 반경, 최대 10개 */
export function getMagazineStores(params?: {
  latitude?: string
  longitude?: string
}) {
  return api.get<MagazineStoreListResponse>("/aiMagazine/store/list", {
    latitude: params?.latitude,
    longitude: params?.longitude,
  })
}

/** 한국관광공사 관광정보 — Next.js 프록시 경유 */
export async function getTourSpots(params: {
  contentTypeId: number
  areaCode?: number
  sigunguCode?: number
  numOfRows?: number
}): Promise<TourApiResponse> {
  const searchParams = new URLSearchParams({
    contentTypeId: String(params.contentTypeId),
    numOfRows: String(params.numOfRows ?? 10),
  })
  if (params.areaCode) searchParams.set("areaCode", String(params.areaCode))
  if (params.sigunguCode) searchParams.set("sigunguCode", String(params.sigunguCode))

  const res = await fetch(`/api/tour?${searchParams.toString()}`)
  if (!res.ok) throw new Error("Tour API failed")
  return res.json()
}

/** 패키지 배너 — 지역별 */
export function getPackageBanners(params?: {
  provinceCode?: string
  code?: string
}) {
  return api.get<PackageBannerResponse>("/aiMagazine/package/banner", {
    provinceCode: params?.provinceCode,
    code: params?.code,
  })
}

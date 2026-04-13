import { api } from "@/lib/api/client"
import type {
  MagazineHomeResponse,
  RegionsResponse,
  BoardListResponse,
  BoardDetailResponse,
  PackageListResponse,
  PackageDetailResponse,
  PackageBannerResponse,
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

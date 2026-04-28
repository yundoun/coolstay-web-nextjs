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

/**
 * 매거진 도메인 Repository 포트
 */
export interface MagazineRepository {
  /** 매거진 홈 */
  getMagazineHome(params?: { provinceCode?: string; code?: string }): Promise<MagazineHomeResponse>
  /** 지역 선택 */
  getMagazineRegions(): Promise<RegionsResponse>
  /** 게시글 목록 */
  getBoardList(params?: { type?: BoardType; cursor?: string; count?: number }): Promise<BoardListResponse>
  /** 게시글 상세 */
  getBoardDetail(key: number): Promise<BoardDetailResponse>
  /** 패키지 목록 */
  getPackageList(params?: { cursor?: string; count?: number }): Promise<PackageListResponse>
  /** 패키지 상세 */
  getPackageDetail(params: { key: number; sales_date?: string; customer_count?: string }): Promise<PackageDetailResponse>
  /** 패키지 배너 */
  getPackageBanners(params?: { provinceCode?: string; code?: string }): Promise<PackageBannerResponse>
}

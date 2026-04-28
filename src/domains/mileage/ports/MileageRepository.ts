import type {
  MileageDetailParams,
  MileageDetailResponse,
  MileageDeleteRequest,
} from "../types"

/**
 * 마일리지 도메인 Repository 포트
 */
export interface MileageRepository {
  /** 마일리지 상세 조회 */
  getMileageDetail(params: MileageDetailParams): Promise<MileageDetailResponse>
  /** 마일리지 적립 모텔 삭제 */
  deleteMileageStores(body: MileageDeleteRequest): Promise<void>
}

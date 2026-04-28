import type { Exhibition } from "@/lib/api/types"
import type { BoardListResponse } from "@/domains/cs/types"

/**
 * 기획전 도메인 Repository 포트
 */
export interface ExhibitionRepository {
  /** 기획전 목록 조회 */
  getExhibitionList(): Promise<Exhibition[]>
  /** 기획전 상세 조회 */
  getExhibitionDetail(key: number, boardSubType?: string): Promise<BoardListResponse>
}

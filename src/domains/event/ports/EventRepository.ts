import type { BoardListResponse } from "@/domains/cs/types"
import type { EventListParams } from "../types"

/**
 * 이벤트 도메인 Repository 포트
 */
export interface EventRepository {
  /** 이벤트/기획전 목록 조회 */
  getEventList(params?: EventListParams): Promise<BoardListResponse>
  /** 이벤트/기획전 개별 조회 */
  getEventDetail(key: number): Promise<BoardListResponse>
}

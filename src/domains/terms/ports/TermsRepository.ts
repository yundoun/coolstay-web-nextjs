import type { TermListParams, TermListResponse } from "../types"

/**
 * 약관 도메인 Repository 포트
 */
export interface TermsRepository {
  /** 약관 목록 조회 */
  getTermList(params?: TermListParams): Promise<TermListResponse>
}

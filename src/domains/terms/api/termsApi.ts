import { api } from "@/lib/api/client"
import type { TermListParams, TermListResponse } from "../types"

/** 약관 목록 조회 */
export function getTermList(params?: TermListParams) {
  return api.get<TermListResponse>("/manage/terms/list", params)
}

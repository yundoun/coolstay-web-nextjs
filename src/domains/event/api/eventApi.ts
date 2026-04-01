import { api } from "@/lib/api/client"
import type { BoardListResponse } from "@/domains/cs/types"
import type { EventListParams } from "../types"

/** 이벤트/기획전 목록 조회 */
export function getEventList(params?: EventListParams) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "EVENT",
    ...params,
  })
}

/** 이벤트/기획전 개별 조회 */
export function getEventDetail(key: number) {
  return api.get<BoardListResponse>("/manage/board/list", {
    board_type: "EVENT",
    board_item_key: String(key),
  })
}

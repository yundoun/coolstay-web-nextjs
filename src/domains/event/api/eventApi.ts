import { api } from "@/lib/api/client"
import type { EventListParams, EventListResponse } from "../types"

/** 이벤트/기획전 목록 조회 */
export function getEventList(params?: EventListParams) {
  return api.get<EventListResponse>("/manage/event/list", params)
}

import { api } from "@/lib/api/client"
import type {
  AlarmListParams,
  AlarmListResponse,
  AlarmCardUpdateRequest,
  AlarmDeleteRequest,
} from "../types"

/** 알림 목록 조회 */
export function getAlarmList(params?: AlarmListParams) {
  return api.get<AlarmListResponse>("/auth/alarms/users/list", params)
}

/** 알림카드 상태 변경 (읽음 처리) */
export function updateAlarmCard(body: AlarmCardUpdateRequest) {
  return api.post<void>("/auth/alarms/card/update", body)
}

/** 알림 삭제 */
export function deleteAlarms(body: AlarmDeleteRequest) {
  return api.post<void>("/auth/alarms/delete", body)
}

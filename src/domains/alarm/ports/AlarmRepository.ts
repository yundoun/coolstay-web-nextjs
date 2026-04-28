import type {
  AlarmListParams,
  AlarmListResponse,
  AlarmCardUpdateRequest,
  AlarmDeleteRequest,
} from "../types"

/**
 * 알림 도메인 Repository 포트
 */
export interface AlarmRepository {
  /** 알림 목록 조회 */
  getAlarmList(params?: AlarmListParams): Promise<AlarmListResponse>
  /** 알림카드 상태 변경 */
  updateAlarmCard(body: AlarmCardUpdateRequest): Promise<void>
  /** 알림 삭제 */
  deleteAlarms(body: AlarmDeleteRequest): Promise<void>
}

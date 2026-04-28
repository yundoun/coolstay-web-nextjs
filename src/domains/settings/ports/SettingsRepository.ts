import type { UserSettingsResponse, UserSettingsUpdateRequest } from "../types"

/**
 * 설정 도메인 Repository 포트
 */
export interface SettingsRepository {
  /** 설정 목록 조회 */
  getUserSettings(): Promise<UserSettingsResponse>
  /** 설정 변경 */
  updateUserSettings(body: UserSettingsUpdateRequest): Promise<UserSettingsResponse>
}

import { api } from "@/lib/api/client"
import type { UserSettingsResponse, UserSettingsUpdateRequest } from "../types"

/** 설정 목록 조회 */
export function getUserSettings() {
  return api.get<UserSettingsResponse>("/auth/users/settings/list")
}

/** 설정 변경 */
export function updateUserSettings(body: UserSettingsUpdateRequest) {
  return api.post<UserSettingsResponse>("/auth/users/settings/update", body)
}

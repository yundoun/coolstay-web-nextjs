import type { HttpClient } from "@/lib/ports/HttpClient"
import type { SettingsRepository } from "../ports/SettingsRepository"
import type { UserSettingsResponse, UserSettingsUpdateRequest } from "../types"

export class ApiSettingsRepository implements SettingsRepository {
  constructor(private http: HttpClient) {}

  getUserSettings() {
    return this.http.get<UserSettingsResponse>("/auth/users/settings/list")
  }

  updateUserSettings(body: UserSettingsUpdateRequest) {
    return this.http.post<UserSettingsResponse>("/auth/users/settings/update", body)
  }
}

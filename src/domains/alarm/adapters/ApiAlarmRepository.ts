import type { HttpClient } from "@/lib/ports/HttpClient"
import type { AlarmRepository } from "../ports/AlarmRepository"
import type {
  AlarmListParams,
  AlarmListResponse,
  AlarmCardUpdateRequest,
  AlarmDeleteRequest,
} from "../types"

export class ApiAlarmRepository implements AlarmRepository {
  constructor(private http: HttpClient) {}

  getAlarmList(params?: AlarmListParams) {
    return this.http.get<AlarmListResponse>("/auth/alarms/users/list", {
      ...params,
    })
  }

  updateAlarmCard(body: AlarmCardUpdateRequest) {
    return this.http.post<void>("/auth/alarms/card/update", body)
  }

  deleteAlarms(body: AlarmDeleteRequest) {
    return this.http.post<void>("/auth/alarms/delete", body)
  }
}

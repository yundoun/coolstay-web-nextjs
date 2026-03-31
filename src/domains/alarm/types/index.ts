// ─── 알림 목록 조회 ───

export interface AlarmListParams {
  category?: string
  count?: number
  cursor?: string
}

export interface Alarm {
  key: number
  type: string
  title: string
  description: string
  summary: string
  read_yn: string
  link: string
  image: string
  reg_dt: number
  category_code: string
}

export interface AlarmListResponse {
  total_count: number
  next_cursor?: string
  alarms: Alarm[]
}

// ─── 알림카드 상태 변경 (읽음 처리) ───

export interface AlarmCardUpdateRequest {
  type: string
  alarm_key: number[]
}

// ─── 알림 삭제 ───

export interface AlarmDeleteRequest {
  category?: string
  delete_type: string
  alarm_key: number[]
}

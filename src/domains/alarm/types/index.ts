// ─── 알림 목록 조회 ───

export interface AlarmListParams {
  category?: string
  count?: number
  cursor?: string
}

export interface AlarmLink {
  type: string       // "APP_LINK" | "URL" | "URL_DETAIL"
  sub_type: string   // "A_MR_09" 등
  target: string     // 링크 대상
  btn_name: string   // 버튼 텍스트
}

export interface AlarmCategory {
  code: string
  name: string
}

export interface Alarm {
  key: number
  title: string
  summary: string
  read_yn: string
  category_code: string
  link?: AlarmLink             // 객체 (BoardItemLink와 동일 구조)
  reg_dt: number               // 초 단위 timestamp
  // 아래 필드는 실제 응답에서 미확인이나, 알림 유형별 차이 가능성을 위해 optional 유지
  type?: string
  description?: string
  image?: string
}

export interface AlarmListResponse {
  total_count: number
  next_cursor?: string
  alarm_categories?: AlarmCategory[]
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

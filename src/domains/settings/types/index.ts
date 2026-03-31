// ─── API 타입 ───

export interface SettingCode {
  code: string
  value: string
}

export interface UserSettingsResponse {
  settings: SettingCode[]
}

export interface UserSettingsUpdateRequest {
  settings: SettingCode[]
}

// ─── Legacy (mock용) ───

export interface NotificationSettings {
  emailNotification: boolean
  smsNotification: boolean
  marketingConsent: boolean
}

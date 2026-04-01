// ─── 세션/토큰 ───

export interface AuthToken {
  access_token: string
  secret: string
}

export interface AuthUser {
  key: number
  type: string        // U (이메일), SK (카카오), SN (네이버)
  id: string
  nickname: string
  email: string
  phone_number: string
  status: string      // S1 (정상), D (탈퇴), B1~B3 (차단)
}

export interface SessionResponse {
  token: AuthToken
  user: AuthUser
}

// ─── 로그인 요청 ───

export interface LoginRequest {
  user_id: string
  enc_password: string
  push_id?: string
}

export interface SnsLoginRequest {
  sns_type: "K" | "N"   // K: 카카오, N: 네이버
  enc_sns_uid: string
  sns_email?: string
  push_id?: string
}

// ─── 인증코드 ───

export interface CodeSendRequest {
  phone_number?: string
  email?: string
}

export interface CodeSendResponse {
  sms_auth_key: string
}

export interface CodeCheckRequest {
  sms_auth_key: string
  sms_auth_code: string
  auth_method: string  // 이메일 또는 전화번호 값 자체
}

export interface CodeCheckResponse {
  isVerified: boolean
  remainTryCount: number
}

export interface AuthMethodResponse {
  auth_method: {
    email: string
    phone_number: string
  }
}

// ─── 회원가입 ───

export interface RegisterRequest {
  user_id: string
  enc_password: string
  nickname: string
  term_codes: string          // 콤마 구분: "100,200"
  phone_number: string
  sms_auth_key: string
  sms_auth_code: string
  push_id?: string
  invitator_key?: number
}

export interface SnsRegisterRequest {
  sns_type: "K" | "N"
  enc_sns_uid: string
  nickname: string
  term_codes: string
  phone_number: string
  sms_auth_key: string
  sms_auth_code: string
  email?: string
  name?: string
  push_id?: string
  invitator_key?: number
}

// ─── 계정 찾기 ───

export interface PwFindRequest {
  user_id: string
  phone_number: string
  sms_auth_key: string
  sms_auth_code: string
}

export interface PwFindResponse {
  method: string       // "BY_ID" 등
  target: string       // 마스킹된 대상
  tempPassword: string
}

export interface IdFindRequest {
  email: string
  sms_auth_key: string
  sms_auth_code: string
}

import type { SessionResponse } from "@/domains/auth/types"

// ─── 마이페이지 정보 조회 ───

export interface MypageInfo {
  coupon_count: number
  mileage_store_count: number
  reservation_count: number
  new_alarm_date: number    // Unix timestamp (초 단위)
  new_notice_date: number   // Unix timestamp (초 단위)
}

// ─── 회원정보 변경 ───

export interface UserUpdateRequest {
  name?: string
  nickname?: string
  enc_old_password?: string
  enc_new_password?: string
  phone_number?: string
  sms_auth_key?: string
  sms_auth_code?: string
}

export type UserUpdateResponse = SessionResponse

// ─── 비밀번호 확인 ───

export interface PwCheckRequest {
  enc_password: string
}

export interface PwCheckResponse {
  isVerified: boolean            // 실측: camelCase 반환 확인됨 (P11C-12)
}

// ─── 회원 탈퇴 ───

export interface UserDeleteRequest {
  reason_type: string
  reason_description?: string
}

// ─── 찜 등록/삭제 ───

export interface DibsRegisterRequest {
  motel_key: string
}

export interface DibsRegisterResponse {
  storeKey: string
  isLikeBenefitActive: boolean
  isFirstLikeToday: boolean
}

export interface DibsDeleteRequest {
  type: string
  motel_keys: string
  flag?: string
}

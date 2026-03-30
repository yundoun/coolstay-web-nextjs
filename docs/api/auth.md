# Auth API 명세서

> **도메인**: 인증/회원 (Session, Auth Code, Users)
> **Base Path**: `/api/v2/mobile/auth`
> **공통 헤더**: `app-token`, `app-secret-code` (임시 세션 토큰 기반)
> **작성일**: 2026-03-30

---

## 목차

1. [세션/로그인](#1-세션로그인)
2. [인증코드 (SMS/이메일)](#2-인증코드)
3. [회원가입](#3-회원가입)
4. [계정 찾기](#4-계정-찾기)

---

## 공통 응답 구조

```json
{
  "code": "20000000",
  "desc": "요청 성공",
  "result": { ... }
}
```

### 에러 코드

| 코드 | 설명 |
|------|------|
| `20000000` | 성공 |
| `40000004` | 토큰 만료 (재발급 필요) |
| `40400000` | Not Found |
| `50000000` | 내부 서버 오류 |

---

## 1. 세션/로그인

### 1-1. 이메일 로그인

```
POST /auth/sessions/users
```

> 이메일/비밀번호로 사용자 인증 후 세션 토큰 발급.
> 로그인 성공 후 `user.phone_number`가 없으면 휴대폰 인증 플로우로 이동.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `user_id` | string | ✅ | 이메일 |
| `enc_password` | string | ✅ | 암호화된 비밀번호 (token.secret으로 암호화) |
| `push_id` | string | - | FCM 푸시 토큰 (웹에서는 미사용) |

**Response** `200 (20000000)`

```json
{
  "token": {
    "access_token": "string",
    "secret": "string"
  },
  "user": {
    "key": 0,
    "type": "string",
    "id": "string",
    "name": "string",
    "nickname": "string",
    "email": "string",
    "phone_number": "string",
    "status": "string",
    "history_yn": "string"
  }
}
```

**User 필드 상세**

| 필드 | 설명 | 값 예시 |
|------|------|--------|
| `key` | 사용자 고유 ID | `12345` |
| `type` | 가입 유형 | `U` (이메일), `SK` (카카오), `SN` (네이버) |
| `status` | 계정 상태 | `S1` (정상), `D` (탈퇴), `B1~B3` (차단) |
| `history_yn` | 가입 이력 | `Y` (기존 회원), `N` (신규) |

**웹 컴포넌트 매핑**: `LoginPage.tsx` → email, password 입력 후 호출

---

### 1-2. 소셜 로그인

```
POST /auth/sessions/users/sns
```

> SNS 인증키로 사용자 인증 후 세션 토큰 발급.
> 미가입 사용자인 경우 404 → 회원가입 플로우(`/auth/users/sns/register`)로 이동.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `sns_type` | string | ✅ | `K` (카카오), `N` (네이버) |
| `enc_sns_uid` | string | ✅ | 암호화된 SNS 사용자 ID |
| `sns_email` | string | - | SNS 이메일 |
| `push_id` | string | - | FCM 푸시 토큰 (웹에서는 미사용) |

**Response**: 1-1과 동일

**웹 컴포넌트 매핑**: `LoginPage.tsx` → 카카오/네이버 버튼 클릭 시 호출

---

## 2. 인증코드

### 2-1. 인증번호 발송

```
POST /auth/code/send
```

> SMS 또는 이메일로 인증번호 발송. 회원가입/비밀번호 찾기에서 사용.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `phone_number` | string | 택1 | 휴대폰 번호 |
| `email` | string | 택1 | 이메일 |

> `phone_number` 또는 `email` 중 하나 필수

**Response** `200 (20000000)`

```json
{
  "sms_auth_key": "string"
}
```

| 필드 | 설명 |
|------|------|
| `sms_auth_key` | 인증번호 확인 시 사용할 키 |

**웹 컴포넌트 매핑**: `PhoneVerificationStep.tsx` → "인증번호 발송" 버튼

---

### 2-2. 인증번호 확인

```
POST /auth/code/check
```

> 사용자가 입력한 인증번호를 검증.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `sms_auth_key` | string | ✅ | 발송 시 받은 키 |
| `sms_auth_code` | string | ✅ | 사용자가 입력한 인증번호 (6자리) |
| `auth_method` | string | ✅ | 인증 대상 (이메일 또는 전화번호 값 자체) |

**Response** `200 (20000000)`

```json
{
  "isVerified": true,
  "remainTryCount": 0
}
```

| 필드 | 설명 |
|------|------|
| `isVerified` | 인증 성공 여부 |
| `remainTryCount` | 남은 시도 횟수 |

**웹 컴포넌트 매핑**: `PhoneVerificationStep.tsx` → "확인" 버튼

---

### 2-3. 인증수단 조회

```
GET /auth/code/list?email={email}
```

> 비밀번호 재설정 시 사용. 해당 이메일로 가입된 계정의 인증 가능 수단(이메일/전화번호)을 조회.

**Query Parameters**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `email` | string | ✅ | 가입 이메일 |

**Response** `200 (20000000)`

```json
{
  "auth_method": {
    "email": "string",
    "phone_number": "string"
  }
}
```

**웹 컴포넌트 매핑**: `ForgotPasswordPage.tsx` Step 1 → 이메일 입력 후 호출 → Step 2에서 선택지 표시

---

## 3. 회원가입

### 3-1. 이메일 회원가입

```
POST /auth/users/register
```

> 이메일/비밀번호 기반 회원가입. 약관 동의 + 휴대폰 인증 완료 후 호출.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `user_id` | string | ✅ | 이메일 |
| `enc_password` | string | ✅ | 암호화된 비밀번호 |
| `nickname` | string | ✅ | 닉네임 |
| `term_codes` | string | ✅ | 동의한 약관 코드 (콤마 구분, 예: `"100,200"`) |
| `phone_number` | string | ✅ | 휴대폰 번호 |
| `sms_auth_key` | string | ✅ | 인증 키 |
| `sms_auth_code` | string | ✅ | 인증 번호 |
| `push_id` | string | - | FCM 토큰 (웹 미사용) |
| `invitator_key` | number | - | 추천인 키 |

**Response**: 1-1과 동일 (token + user)

> 가입 성공 시 자동 로그인 (세션 토큰 발급됨)

**웹 플로우 매핑**:
```
RegisterPage Step 1 (약관) → term_codes
RegisterPage Step 2 (인증) → phone_number, sms_auth_key, sms_auth_code
RegisterPage Step 3 (정보) → user_id, enc_password, nickname
```

---

### 3-2. 소셜 회원가입

```
POST /auth/users/sns/register
```

> SNS 로그인 시 미가입 사용자의 회원가입. 임시 세션 토큰 필요.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `sns_type` | string | ✅ | `K` (카카오), `N` (네이버) |
| `enc_sns_uid` | string | ✅ | 암호화된 SNS 사용자 ID |
| `nickname` | string | ✅ | 닉네임 |
| `term_codes` | string | ✅ | 동의 약관 코드 |
| `phone_number` | string | ✅ | 휴대폰 번호 |
| `sms_auth_key` | string | ✅ | 인증 키 |
| `sms_auth_code` | string | ✅ | 인증 번호 |
| `email` | string | - | 이메일 |
| `name` | string | - | 이름 |
| `push_id` | string | - | FCM 토큰 (웹 미사용) |
| `invitator_key` | number | - | 추천인 키 |

**Response**: 1-1과 동일 (token + user)

**이메일 가입과 차이점**:
- `user_id` / `enc_password` 대신 `sns_type` / `enc_sns_uid` 사용
- `email`, `name` 선택적으로 전달 가능 (SNS에서 제공 시)

---

## 4. 계정 찾기

### 4-1. 비밀번호 찾기

```
POST /auth/users/pw/find
```

> 인증 완료 후 임시 비밀번호를 발급.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `user_id` | string | ✅ | 가입 이메일 |
| `phone_number` | string | ✅ | 휴대폰 번호 |
| `sms_auth_key` | string | ✅ | 인증 키 |
| `sms_auth_code` | string | ✅ | 인증 번호 |

**Response** `200 (20000000)`

```json
{
  "method": "BY_ID",
  "target": "string",
  "tempPassword": "string"
}
```

| 필드 | 설명 |
|------|------|
| `method` | 비밀번호 전달 방식 (`BY_ID` 등) |
| `target` | 전달 대상 (마스킹된 이메일/전화번호) |
| `tempPassword` | 임시 비밀번호 |

**웹 플로우 매핑**:
```
ForgotPasswordPage Step 1 → email 입력 → GET /auth/code/list (인증수단 조회)
ForgotPasswordPage Step 2 → 인증수단 선택 → POST /auth/code/send → POST /auth/code/check
ForgotPasswordPage Step 3 → POST /auth/users/pw/find → 완료 안내
```

---

### 4-2. 아이디 찾기

```
POST /auth/users/id/find
```

> SMS 인증 후 가입된 이메일(아이디)을 조회.

**Request Body**

| 필드 | 타입 | 필수 | 설명 |
|------|------|------|------|
| `email` | string | ✅ | 이메일 (확인용) |
| `sms_auth_key` | string | ✅ | 인증 키 |
| `sms_auth_code` | string | ✅ | 인증 번호 |

**Response** `200 (20000000)`: 일반 성공 응답

> **참고**: Swagger 응답 예시가 generic 형태. AOS 앱에서는 현재 미사용 (UI 없음).
> 웹에서도 비밀번호 찾기와 통합하여 처리 가능.

---

## 플로우별 API 호출 순서

### 이메일 로그인
```
1. POST /auth/sessions/temporary        ← 이미 연동 (client.ts)
2. POST /auth/sessions/users             ← 이메일 + 암호화된 비밀번호
3. → 성공: 토큰 저장 → 홈 이동
   → phone_number 없음: 휴대폰 인증 플로우
```

### 소셜 로그인
```
1. 카카오/네이버 SDK 인증 → sns_uid 획득
2. POST /auth/sessions/users/sns         ← sns_type + enc_sns_uid
3. → 성공: 토큰 저장 → 홈 이동
   → 404: 미가입 → 소셜 회원가입 플로우
```

### 이메일 회원가입
```
1. Step 1: 약관 동의 → term_codes 수집
2. Step 2: POST /auth/code/send          ← phone_number
3. Step 2: POST /auth/code/check         ← sms_auth_key + sms_auth_code
4. Step 3: POST /auth/users/register     ← 전체 데이터
5. → 성공: 자동 로그인 → 홈 이동
```

### 비밀번호 찾기
```
1. Step 1: GET /auth/code/list?email=    ← 인증수단 조회
2. Step 2: POST /auth/code/send          ← 선택한 수단으로 발송
3. Step 2: POST /auth/code/check         ← 인증번호 확인
4. Step 3: POST /auth/users/pw/find      ← 임시 비밀번호 발급
5. → 완료 안내 → 로그인 페이지
```

---

## 비밀번호 암호화 참고

> AOS 앱에서는 `EncryptUtil.encode(password, token.secret)`으로 암호화.
> 웹에서 동일한 암호화 로직 구현 필요 (AES-256 기반 추정).
> **확인 필요**: 백엔드팀에 암호화 스펙 확인 (알고리즘, IV, 패딩 등)

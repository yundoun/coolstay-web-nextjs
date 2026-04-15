# 회원가입 API 연동 버그 수정

## 작업 내용

### 1. 인증번호 확인 응답 필드명 수정
- `is_verified` → `isVerified`, `remain_try_count` → `remainTryCount`
- 실측 API 응답이 camelCase (스펙은 snake_case)
- PhoneVerificationStep, ProfileEditPage 모두 수정

### 2. 약관 코드 실제 값으로 변경
- 임의 코드 `"100,200,300,400"` → 실제 TermType enum `"TC001,TC002,TC003,TC102"`
- 백엔드 AuthService에서 "TC" 접두사 필터링 후 TermType.ofLegacyCode() 호출
- INITIAL_AGREEMENTS의 id를 실제 약관 코드로 변경

### 3. 토큰 만료 시 AES 복호화 실패 방지
- 임시 토큰 5분 만료 → 폼 작성 중 만료 가능
- request() 토큰 갱신 시 body의 enc_password는 구 secret으로 암호화된 채 유지
- register 직전 refreshTempToken()으로 토큰 강제 갱신하여 동일 secret 보장

### 4. 숙소 찜하기 로그인 체크
- AccommodationCard, AccommodationInfo에서 비로그인 시 로그인 페이지로 리다이렉트

## 수정 파일
- src/domains/auth/types/index.ts
- src/domains/auth/components/PhoneVerificationStep.tsx
- src/domains/auth/components/RegisterPage.tsx
- src/domains/mypage/components/ProfileEditPage.tsx
- src/lib/api/client.ts
- src/components/accommodation/AccommodationCard.tsx
- src/domains/accommodation/components/AccommodationInfo.tsx

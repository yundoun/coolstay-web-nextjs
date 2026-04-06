# AUTH AU-1~4 타입 정렬

## 변경 요약

### AU-1: 타입 정렬
- AuthUser: phone_number → string | null (애플 null 허용), history_yn 추가, name 추가
- AuthUser.type 주석: E/K/N/A (스펙 레거시코드)
- CodeCheckResponse: isVerified → is_verified, remainTryCount → remain_try_count (snake_case)

### AU-2: 참조 업데이트
- PhoneVerificationStep: is_verified, remain_try_count 사용
- ProfileEditPage: is_verified 사용

### AU-3~4: 확인
- 마이페이지, 알림센터, 찜, 설정, 회원탈퇴 모두 이미 구현됨
- SNS 로그인은 Phase 6에서 보류 상태 유지

## 테스트
- 132 tests passed

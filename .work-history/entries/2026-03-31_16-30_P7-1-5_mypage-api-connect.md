# Phase 7 마이페이지 API 연동 강화 [P7-1~5]

## 작업 내용
- P7-1: MyPage 쿠폰/마일리지 카운트 → getMypageInfo() 연동
- P7-2: 찜 목록 조회 → GET /contents/list?search_type=ST006 (AOS 코드에서 확인)
- P7-3: ProfileEditPage → mock 제거, auth store + updateUser() + SMS 인증
- P7-4: PasswordChangePage → encryptPassword() + updateUser() + 세션 갱신
- P7-5: WithdrawPage → 실제 카운트 표시 + deleteUser() + clearSession

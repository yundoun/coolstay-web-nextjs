# fix: 설정 페이지 로그아웃 기능 수정

## 변경 사항
- SettingsPage의 handleLogout에서 실제 clearSession() 호출 및 홈으로 리다이렉트
- 기존: confirm/alert만 표시하는 stub 구현
- 수정: clearSession() → router.push("/") (MyPage와 동일한 동작)

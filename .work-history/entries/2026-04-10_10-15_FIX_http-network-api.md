# fix: HTTP 네트워크 IP 환경에서 API 호출 불가 수정

## 변경 사항

### encrypt.ts — crypto.subtle 폴백 추가
- `crypto.subtle`은 HTTPS 또는 localhost에서만 사용 가능
- `http://192.168.0.13:3000` 같은 네트워크 IP 접속 시 암호화 실패 → API 호출 불가
- 순수 JS AES-128-CBC 구현을 폴백으로 추가하여 모든 환경에서 동작

### client.ts — 토큰 에러 재발급 로직 수정
- 임시 토큰 에러 시에도 재발급 처리되도록 조건 완화
- `onAuthError()` 호출을 `clearToken()` 전으로 이동

### layout.tsx — protected 라우트 redirect 개선
- 로그인 리다이렉트 시 searchParams도 포함하도록 수정

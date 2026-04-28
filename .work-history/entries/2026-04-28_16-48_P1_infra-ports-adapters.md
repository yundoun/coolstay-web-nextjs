# P1: 인프라 포트 및 어댑터 추출

## 변경 사항

### 포트 (인터페이스)
- `src/lib/ports/HttpClient.ts` — HTTP 클라이언트 포트 (get, post)
- `src/lib/ports/TokenManager.ts` — 토큰 관리 포트 (getToken, setToken, clearToken, isAuthenticated, onAuthError)
- `src/lib/ports/Storage.ts` — 저장소 포트 (get, set, remove, keys)

### 어댑터 (구현체)
- `src/lib/adapters/FetchHttpClient.ts` — fetch 기반 HttpClient, TokenManager 주입
- `src/lib/adapters/ApiTokenManager.ts` — 임시/로그인 토큰 관리, 재발급 직렬화
- `src/lib/adapters/LocalStorageAdapter.ts` — localStorage 래핑, SSR 안전

### 상수
- `src/lib/constants/apiCodes.ts` — SUCCESS_CODE, TOKEN_ERROR_CODES
- `src/lib/api/client.ts` — 매직 스트링을 상수로 교체

## 테스트
- 7개 테스트 파일, 55 cases 전체 통과

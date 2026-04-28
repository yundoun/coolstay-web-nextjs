# P2: DI 컨테이너 및 Provider 설정

## 변경 사항

- `src/lib/di/types.ts` — Container 인터페이스 (httpClient, tokenManager, storage)
- `src/lib/di/container.ts` — createDefaultContainer() + defaultContainer 싱글톤
- `src/lib/di/DIProvider.tsx` — React Context 기반 DI Provider + useDI() 훅
- `src/app/providers.tsx` — DIProvider 통합

## 설계 결정

- 기존 `api` 객체(`client.ts`)를 제거하지 않고 유지 → 18개 도메인 API 파일 변경 없음
- 새로운 코드는 `useDI().httpClient`로 접근, 기존 코드는 `api` import 유지
- Phase 3 이후 점진적으로 도메인 Repository를 Container에 추가

## 테스트
- 2개 테스트 파일, 8 cases 전체 통과

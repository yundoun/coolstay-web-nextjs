# CLAUDE.md Hexagonal Architecture 업데이트

## 변경 사항

- 디렉토리 구조: ports/adapters/services/di 레이어 반영
- 데이터 흐름 다이어그램 추가 (Component → Hook → Port → Adapter → HttpClient)
- 신규 도메인 추가 6단계 패턴 (포트 → 어댑터 → 서비스 → Container → Hook → 컴포넌트)
- 신규 코드 작성 규칙: useDI() 사용, localStorage 직접 호출 금지, 비즈니스 로직 Service 추출
- 테스트 컨벤션: 포트 모킹 원칙, 레이어별 테스트 가이드

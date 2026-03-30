# 로그인 상태 관리 + Route Group 리팩토링 태스크 설계

## 작업 내용
- TASKS.md에 P1-11 ~ P1-20 세부 태스크 추가
- 4단계 구성: 토큰 일원화 → Route Group 재구성 → UI 반영 → 로그인 후 복귀

## 설계 결정
- client.ts의 임시 토큰과 auth store의 사용자 토큰을 단일 소스로 통합
- Route Group `(public)` / `(protected)`으로 인증 가드를 레이아웃 레벨에서 처리
- zustand persist로 localStorage 영속화 (새로고침 시 로그인 유지)

# E2E Phase 5 Mock→API 전환 테스트 결과

> **일시**: 2026-03-31
> **환경**: localhost:3000 → dev.server.coolstay.co.kr:9000
> **방식**: Playwright MCP 직접 조작

---

## 테스트 결과

| 페이지 | URL | API 호출 | 상태 | 비고 |
|--------|-----|---------|------|------|
| 쿠폰 | `/coupons` | `GET /benefit/coupons/list` | **200 OK** | 실제 4장 표시 |
| 이벤트 | `/events` | `GET /manage/event/list` | **200 OK** | dev 데이터 없어 빈 목록 |

## 발견된 이슈

### ISSUE-3: 쿠폰 날짜 포맷 에러 (수정 완료)

**현상**: `dt.slice is not a function` — `usable_start_dt`가 숫자(timestamp)인데 문자열 함수 호출
**수정**: `formatDate()`에서 number/string 분기 처리
**상태**: 즉시 수정 완료

## 미확인 (API 응답 없는 페이지)

settings, terms, notification, notice, faq, inquiry, review — 로그인 토큰 필요 또는 dev 데이터 없음.
API 함수 호출 구조는 코드 리뷰로 확인 완료.

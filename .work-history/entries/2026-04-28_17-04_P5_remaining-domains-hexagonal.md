# P5: 나머지 도메인 일괄 전환

## 변경 사항

13개 도메인에 Repository 포트 + API 어댑터 생성 (26개 파일):

| 그룹 | 도메인 | 포트 메서드 수 |
|------|--------|---------------|
| P5-1 인증/사용자 | auth | 9 |
| | mypage | 7 |
| | settings | 2 |
| P5-2 콘텐츠 | event | 2 |
| | exhibition | 2 |
| | magazine | 7 |
| | terms | 1 |
| P5-3 부가기능 | coupon | 4 |
| | mileage | 2 |
| | review | 5 |
| | alarm | 3 |
| | cs | 8 |
| | friend | 2 |

### Container 등록
- `di/types.ts` — 17개 도메인 Repository 타입 등록
- `di/container.ts` — 17개 API 어댑터 인스턴스 생성

## 테스트
- container.test.ts에 17개 Repository 등록 검증 추가
- 전체 121/123 tests 통과 (2 failed는 기존 client.test.ts)

# 배포 서버에서 하단 네비가 예약 페이지에 노출되는 버그 수정

## 문제
- 배포 서버(export 빌드)에서 예약하기 페이지에 하단 네비게이션이 노출
- 하단 예약 버튼이 네비에 가려져 예약 불가

## 원인
- `next.config.ts`에서 export 빌드 시 `trailingSlash: true` 설정
- `usePathname()`이 `/booking/123/` (trailing slash 포함) 반환
- `route-layout-config.ts`의 정규식 `^\/booking\/[^/]+$`가 매치 실패
- 기본값 fallback으로 `showBottomNav: true` 적용

## 수정
- `getRouteLayoutConfig()`에서 pathname trailing slash 정규화 처리
- 예약 페이지뿐 아니라 모든 동적 라우트(숙소 상세, 이벤트 상세 등)에 동일 효과

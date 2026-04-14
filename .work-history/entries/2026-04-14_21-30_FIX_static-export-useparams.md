# static export useParams → usePathname 수정

## 작업 내용
- 매거진 board/package 클라이언트에서 useParams() → usePathname() 패턴 전환
  - static export에서 useParams()는 빌드 시 값("_")을 반환하여 동적 라우트 파라미터 추출 실패
  - usePathname()으로 실제 URL에서 파싱하는 방식으로 변경 (숙소 상세 페이지와 동일 패턴)
- serve.js에 basePath strip 로직 추가
  - Apache가 /web/coolstay/ prefix를 포함한 채 프록시하므로 동적 라우트 매칭 실패
  - URL에서 basePath를 제거한 후 라우트 매칭 수행

## 수정 파일
- src/app/(public)/magazine/board/[key]/client.tsx
- src/app/(public)/magazine/package/[key]/client.tsx
- serve.js

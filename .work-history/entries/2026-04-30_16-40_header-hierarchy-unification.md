# 전체 페이지 헤더 계층 구조 통일

## 작업 내용
- 탭 루트(/, /search, /favorites, /coupons, /mypage)만 default 헤더(로고+검색바) 유지
- 1뎁스 목록(/events, /exhibitions, /magazine, /magazine/board, /magazine/package)을 back 헤더(←+타이틀+홈)로 변경
- 2뎁스 상세 페이지의 인페이지 중복 뒤로가기/공유 버튼 제거 → 글로벌 헤더로 통합
- /events/[id], /exhibitions/[id] rightActions에 share 추가

## 변경 파일
- route-layout-config.ts: 목록 페이지 헤더 variant 변경, 상세 페이지 share 추가
- EventDetailPage.tsx: 플로팅 뒤로가기/공유 버튼, handleShare 함수 제거
- ExhibitionDetailPage.tsx: 인페이지 "기획전 목록" 링크, Share 버튼 제거
- PackageExhibitionPage.tsx: 인페이지 "기획전 목록" 링크 제거
- BoardListPage.tsx: 인페이지 뒤로가기 제거
- BoardDetailPage.tsx: 인페이지 뒤로가기 제거
- PackageListPage.tsx: 인페이지 뒤로가기 제거
- PackageDetailPage.tsx: 플로팅 뒤로가기 제거

## 개선 효과
- 뒤로가기/홈/공유가 글로벌 헤더 한 곳에 통일
- 헤더 모양만으로 현재 페이지 계층 인지 가능
- 인페이지 중복 네비 제거로 UI 정리

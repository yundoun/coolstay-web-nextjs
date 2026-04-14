# 숙소 상세 탭 재구성

## 작업 내용
- 탭 순서 변경: 리뷰 → 꿀혜택(모바일만) → 객실선택 → 숙소소개 → 시설/서비스 → 위치/교통 → 기타
- 숙소소개 섹션을 헤더 영역에서 분리, description + 사장님 인사말을 통합하여 별도 탭으로 구성
- 꿀혜택 탭/콘텐츠를 모바일 전용으로 전환 (데스크톱은 사이드바 위젯으로 대체)
- 이용안내 + 국내 최저가 + 사업자 정보를 "기타" 탭으로 통합
- 외부 링크 제목을 "국내 최저가"로 변경
- 서브 네비 트리거를 갤러리 IntersectionObserver에서 scrollY 기반으로 변경 (최상위 숨김, 스크롤 시 표시)

## 수정 파일
- AccommodationDetailLayout.tsx — 탭 정의, 섹션 순서, 스크롤 리스너
- AccommodationInfo.tsx — description 블록 제거
- ExternalLinkSection.tsx — 제목 변경
- SectionTabNav.tsx — mobileOnly 탭 지원

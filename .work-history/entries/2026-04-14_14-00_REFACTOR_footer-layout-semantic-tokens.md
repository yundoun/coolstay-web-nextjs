# 푸터 경량화, 레이아웃 배경색 통일, 시맨틱 토큰 전환

## 작업 내용

### 푸터 리디자인
- 불필요한 브랜드 소개/로고 제거, 전체 크기 축소
- 모바일: 고객센터 + 회사정보 병렬 2컬럼 레이아웃
- 소셜 링크 URL 업데이트 (Instagram, YouTube, Blog 실제 주소)
- 하단 네비게이션바 겹침 방지 (pb-16 md:pb-0)

### 레이아웃 정렬 통일
- 헤더/푸터 Container size: wide → normal (본문과 동일 1200px)
- body 배경: bg-background → bg-muted 단일화
- 개별 페이지/푸터의 중복 배경색 제거 (bg-neutral-100, bg-muted/30 등)
- Section 기본 배경을 투명(상속)으로 변경

### 하드코딩 gray-* → 시맨틱 토큰 일괄 전환
- SearchModal.tsx (~62건), SearchConditionBar.tsx (~35건) 등 12개 파일
- gray-100~700 → muted, muted-foreground, foreground, border 등
- bg-white → bg-background
- 유일한 예외: EventDetailPage의 bg-gray-900 (이미지 다크 배경)

## 변경 파일 (21개)
- src/app/layout.tsx, src/app/(public)/page.tsx
- src/components/layout/Footer.tsx, Header.tsx, Section.tsx
- src/components/search/SearchModal.tsx
- src/domains/search/components/SearchConditionBar.tsx
- src/domains/{accommodation,booking,coupon,event,home,magazine,notification} 하위 컴포넌트

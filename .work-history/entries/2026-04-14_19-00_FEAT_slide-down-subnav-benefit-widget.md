# Slide-down 서브 네비, 꿀혜택 위젯, 헤더 숙소명

## 변경 사항

### 숙소 상세 레이아웃 대개편
- 사장님 인사말 `AccommodationInfo`에서 분리 → 편의시설/위치 사이 독립 배치
- "혜택" → "꿀혜택" 명칭 변경 (탭 라벨, 섹션 제목)
- `BookingWidget` 제거 → `BenefitSidebarWidget` (꿀혜택 사이드바 위젯) 대체

### Slide-down 서브 네비게이션
- 모바일/PC 레이아웃 분기 제거, 단일 코드로 통합
- `IntersectionObserver`로 이미지 갤러리 감시
- 이미지가 뷰포트를 벗어나면 헤더 아래로 탭+pill 슬라이드 다운
- 위로 돌아가면 슬라이드 업으로 자연스럽게 사라짐
- 헤더와 동일한 배경 (`backdrop-blur-md`) 적용

### SectionTabNav 개선
- `variant="inline"` 추가 (pill 스타일 탭, 부모가 positioning 처리)
- 기존 `variant="sticky"` (underline 스타일) 유지

### 헤더 동적 숙소명 표시
- `useHeaderStore` zustand store 신규 생성 (`src/lib/stores/header.ts`)
- `AccommodationDetailPage`에서 숙소명을 store에 설정
- `Header` back variant에서 `dynamicTitle` 읽어 표시

### 모바일 pill 버튼 개선
- `flex-1` + `justify-center`로 양옆 균등 분배 + 중앙정렬
- PC에서는 `lg:flex-none`으로 auto 사이즈 유지

## 영향받는 파일
- `src/components/layout/Header/Header.tsx`
- `src/domains/accommodation/components/AccommodationDetailLayout.tsx`
- `src/domains/accommodation/components/AccommodationDetailPage.tsx`
- `src/domains/accommodation/components/AccommodationInfo.tsx`
- `src/domains/accommodation/components/BenefitSection.tsx`
- `src/domains/accommodation/components/SectionTabNav.tsx`
- `src/lib/stores/header.ts` (신규)

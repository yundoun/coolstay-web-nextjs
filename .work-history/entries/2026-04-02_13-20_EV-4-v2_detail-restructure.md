## EV-4 v2: EventDetailPage 구조 변경 — CMS 구조 반영

**브랜치:** `feat/event-ui-improvement`

### CMS 구조 분석
- 썸네일 이미지 (badge_image_url): 가로형 배너 → 히어로
- 상세 이미지 (image_urls): 모바일 기준 세로로 매우 긴 랜딩 이미지 → 콘텐츠 자체
- description: 텍스트 설명 (선택)
- webview_link: 외부 페이지 (선택)
- buttons: CTA 버튼 (선택)

### 변경 사항
1. **상세 이미지를 풀너비 세로 스택으로 변경** — 횡스크롤 갤러리(ImageGallery) 제거
   - `<img>` 네이티브 태그로 w-full h-auto 표시 (세로 긴 이미지에 적합)
   - Next.js Image의 fill 모드 대신 자연 비율 유지
2. **히어로 이미지 우선순위 변경** — badge_image_url (썸네일) > detail_banner_image_url
   - image_urls는 히어로에서 제외 (상세 콘텐츠 영역에서 표시)
3. **모바일 CTA 스티키 바 제거** — BottomNav(z-1030) 뒤에 숨겨지는 버그 수정
   - CTA 버튼을 콘텐츠 하단 인라인으로 통합 (모바일/데스크탑 공통)
4. **CTAButtons/ImageGallery 헬퍼 컴포넌트 제거** — 불필요한 추상화 정리

### 버그 수정
- 모바일에서 CTA 버튼이 BottomNav 뒤에 숨겨지던 문제 해결

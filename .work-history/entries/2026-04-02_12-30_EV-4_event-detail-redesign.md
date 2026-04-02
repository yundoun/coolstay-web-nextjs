## EV-4: EventDetailPage 재설계

**브랜치:** `feat/event-ui-improvement`

### 변경 사항
- 콘텐츠 카드 겹침 -mt-4 → -mt-8, 그림자 강화 (shadow-[0_-4px_24px])
- description 빈 경우 빈 border-b 제거, 콘텐츠 없으면 "준비 중" 메시지
- ImageGallery 컴포넌트 분리 + 스크롤 인디케이터 dots 추가 (active dot 확대 + primary 색상)
- 데스크탑 CTA를 콘텐츠 카드 내부로 이동 (스크롤 없이 노출)
- CTAButtons 공통 컴포넌트 분리 (모바일 sticky / 데스크탑 inline 공유)
- 기존 데스크탑 별도 Container + rounded-b-2xl 구조 제거 → 카드 내부 통합

### 개선 효과
- Before: 히어로와 콘텐츠 분리감 → After: -mt-8 겹침으로 자연스러운 연결
- Before: description "."이면 빈 border-b만 → After: 깔끔하게 갤러리 직행
- Before: 데스크탑 CTA 페이지 최하단 → After: 콘텐츠 카드 내 즉시 노출

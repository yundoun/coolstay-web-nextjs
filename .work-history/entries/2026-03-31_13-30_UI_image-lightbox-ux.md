# 이미지 Lightbox 및 UX 개선

## 작업 내용
- ImageLightbox 컴포넌트 신규 생성 (풀스크린 뷰어, 키보드/스와이프/핀치줌/썸네일)
- ImageGallery: overflow-hidden 추가, hover 스케일 축소, Lightbox 연결
- AccommodationCard: hover 트랜지션 자연스럽게 조정 (scale-105→1.03, 500→300ms)
- RoomDetailModal: 이미지 클릭 시 Lightbox 열기
- ReviewSection: 리뷰 이미지 썸네일 클릭 시 Lightbox 열기
- globals.css: slide-in-from-left/right 키프레임 추가

## 테스트
- Playwright MCP로 데스크톱/모바일 양방향 검증 완료
- 갤러리, 객실모달, 리뷰 이미지 모두 Lightbox 정상 동작 확인

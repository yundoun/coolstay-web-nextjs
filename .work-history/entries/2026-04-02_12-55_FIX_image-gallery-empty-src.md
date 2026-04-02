## FIX: 숙소 상세 ImageGallery 빈 src 에러 수정

**브랜치:** `feat/event-ui-improvement`

### 문제
- 숙소 상세 페이지의 ImageGallery에 빈 문자열("")이 images 배열에 포함되어 전달
- Next.js Image 컴포넌트가 빈 src에 대해 콘솔 에러 11개 이상 발생
- "An empty string was passed to the src attribute" 에러

### 수정
- `ImageGallery` 컴포넌트 진입 시 `images.filter(src => src && src.trim() !== "")` 로 빈 문자열 필터링
- 필터링 후 이미지가 0개면 `null` 반환
- API에서 빈 문자열이 오는 것은 데이터 품질 이슈이므로 UI 레벨에서 방어

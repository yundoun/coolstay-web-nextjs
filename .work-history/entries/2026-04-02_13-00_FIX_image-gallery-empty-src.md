## FIX: ImageGallery 빈 문자열 src 에러 수정

**브랜치:** `feat/event-ui-improvement`

### 문제
- 숙소 상세 ImageGallery에서 `images` 배열에 빈 문자열 `""` 포함 시 `<Image src="">` 에러
- "An empty string was passed to the src attribute" 콘솔 에러 11건+

### 원인
- API 응답의 이미지 URL 배열에 빈 문자열이 포함되는 경우 존재
- 컴포넌트에서 배열 필터링 없이 그대로 사용

### 수정
- `images` prop을 받자마자 빈 문자열 필터링: `rawImages.filter(url => url && url.trim() !== "")`
- 필터 후 이미지가 0개면 `null` 반환

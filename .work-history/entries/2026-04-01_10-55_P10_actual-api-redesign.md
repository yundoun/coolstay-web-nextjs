# Phase 10 (2차) — 실제 API 응답 기반 UI 재설계

## 배경
dev 서버 실제 API 호출 결과, 기존 타입/컴포넌트와 다수 불일치 발견:
- 타임스탬프: 밀리초가 아닌 **초 단위**
- BoardItem.key: string이 아닌 **number**
- link: string이 아닌 **객체** (type, sub_type, target, btn_name)
- 이미지: images가 아닌 **image_urls: string[]**
- 이벤트: banner_image_url 대신 **badge_image_url / detail_banner_image_url**
- 쿠폰: discount_type "FIXED"가 아닌 **"AMOUNT"**

## 작업 내용

### 공통 타입 (BoardItem) 전면 수정
- key: number, link: BoardItemLink 객체, image_urls: string[]
- webview_link (web_view_link → webview_link)
- badge_image_url, detail_banner_image_url, buttons[], thumb_description 추가
- FAQ AccordionItem value, Notice/Inquiry expandedId 타입 수정

### formatTimestamp 유틸 강화
- 초 단위 자동 감지 (< 10_000_000_000)
- formatTimestampDot (YYYY.MM.DD), toMillis 헬퍼 추가

### 꿀팁 가이드 UI 재설계
- 2컬럼 카드 그리드, image_urls[0] 썸네일
- view_count + reg_dt 메타데이터
- 상세: 히어로 이미지 + 갤러리 + link CTA 버튼
- 테스트 10 cases

### 기획전(Event) UI 재설계
- badge_image_url 목록 썸네일, detail_banner_image_url 상세 히어로
- 날짜 기반 status 판단 (코드값 불투명)
- buttons[] 배열 CTA, webview_link, HTML description
- 종료 이벤트 그레이아웃
- 테스트 18 cases

### 쿠폰 UI 재설계
- discount_type "AMOUNT"→원, "RATE"→%
- 초 단위 타임스탬프 → formatTimestampDot
- 7일 만료 뱃지 (remain7day_count)
- 할인 금액 티어별 좌측 액센트 보더
- 중복 사용/잔여 횟수 표시
- constraints 필터링 (내부 코드 숨김)
- 테스트 14 cases

## 테스트 결과
- 25 files, 139 tests passed
- 빌드 성공

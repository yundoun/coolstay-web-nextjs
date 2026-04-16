# 객실 모달 제거 및 서브 네비 개선

## 작업 내용

### 1. RoomDetailModal 제거
- 객실 카드에 이미 예약 버튼, 가격, 정보가 모두 표시되므로 모달 불필요
- 이미지 클릭 시 ImageLightbox로 바로 연결
- 이미지 여러 장일 때 +N 뱃지 표시

### 2. 서브 네비 z-index 겹침 수정
- 모달 열릴 때 서브 네비(z-1030)가 Dialog(z-50) 위에 표시되던 문제
- 모달 열리면 서브 네비 숨김 처리
- 트랜지션 애니메이션 제거 (즉시 표시/숨김)

### 3. 사업자 정보 기본 열림
- BusinessInfoSection Accordion defaultValue 추가

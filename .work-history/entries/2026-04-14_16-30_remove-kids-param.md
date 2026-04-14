# 아동(kids) 인원 선택 제거 및 검색 UI 정리

## 변경 사항
- 검색 모달 GuestPanel에서 아동 인원 선택 UI 제거
- SearchConditionBar, CompactSearchBar에서 kids 파라미터 제거
- searchParams 유틸에서 kids 관련 코드 제거
- search-modal store에서 kids 상태 제거
- DateGuestPicker, AccommodationDetailLayout, HeroSection 정리
- 관련 테스트 코드 정리

## 사유
- API가 아동 파라미터(kidCnt)를 항상 0으로 전송하므로 불필요한 UI

# [P3-5] 객실 상세 모달 RoomDetailModal

## 작업 내용
- RoomDetailModal 컴포넌트 신규 생성 (Dialog 기반)
- 이미지 캐러셀 (좌우 네비게이션 + 도트 인디케이터)
- 객실명, 설명, 정원, 키워드 표시
- 대실/숙박 가격 정보 (할인율 배지 포함)
- 편의시설 목록, 취소/환불 규정 안내
- 하단 "대실 예약" / "숙박 예약" 버튼
- RoomCard에 onDetailClick prop 추가 (클릭 시 모달 오픈)
- AccommodationDetailLayout에 모달 상태 관리 및 통합

## 변경 파일
- src/domains/accommodation/components/RoomDetailModal.tsx (신규)
- src/domains/accommodation/components/RoomCard.tsx (수정)
- src/domains/accommodation/components/AccommodationDetailLayout.tsx (수정)
- src/domains/accommodation/components/index.ts (수정)

## Phase
- Phase 3: 기능 보강

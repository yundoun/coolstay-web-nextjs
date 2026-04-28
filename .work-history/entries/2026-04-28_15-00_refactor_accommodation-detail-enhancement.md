# 숙소 상세 페이지 구성 요소 보강 및 가격 표시 통일

## 변경 사항

### 객실 카드 가격/쿠폰 표시 재디자인 (RoomCard)
- 가격 표시 흐름 통일: 원가(취소선) → 할인% → 판매가(취소선, 쿠폰시) → 쿠폰 할인 → 최종가
- PC: 이미지 좌측 + 객실정보/대실·숙박 가로 배치 (컴팩트)
- 모바일: 세로 스택
- 마일리지 적립 예상액 표시

### 숙소 정보 영역 보강 (AccommodationInfo)
- 쿠폰 배너 추가 (downloadCouponInfo 활용)
- 마일리지 적립률 + 첫 예약 혜택 배지 추가

### 편의시설 코드 버그 수정 (mapMotelToDetail)
- CONVENIENCE_MAP C01~C25 전체 매핑 (AOS strings.xml 기준)
- C13→주차장, C14→미니바, C23→배틀그라운드 등 25개 코드 한글명 표시

### 하단 고정 CTA 추가 (AccommodationDetailLayout)
- 모바일 하단에 "전화 + 객실 선택하기" 고정 버튼
- 하단 네비바(bottom-14) 위에 배치

### 이벤트 배너 섹션 추가
- externalEvents 데이터 있을 때 가로 스크롤 이벤트 배너 표시

### 검색 카드 가격 표시 통일 (AccommodationCard)
- PriceColumn 가격 흐름을 RoomCard와 동일하게 통일

## 변경 파일
- `src/components/accommodation/AccommodationCard.tsx`
- `src/domains/accommodation/components/AccommodationDetailLayout.tsx`
- `src/domains/accommodation/components/AccommodationInfo.tsx`
- `src/domains/accommodation/components/AmenityList.tsx`
- `src/domains/accommodation/components/RoomCard.tsx`
- `src/domains/accommodation/utils/mapMotelToDetail.ts`

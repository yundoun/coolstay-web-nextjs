# Phase 2 마이페이지/회원관리 API 연동 [P2-1~9]

## 작업 내용
- Users API: 마이페이지 조회, 회원정보 변경, 비밀번호 확인, 회원 탈퇴
- Dibs API: 찜 등록/삭제
- Coupon API: 목록 조회/등록/다운로드/삭제 (benefit 도메인)
- Mileage API: 적립 모텔 삭제 (목록 조회는 AOS/서버 확인 필요)
- mypage 도메인 API 명세서 작성

## 변경 파일
- `src/domains/mypage/{types,api}/` — 타입 + API 함수
- `src/domains/coupon/{types,api}/` — 쿠폰 타입 + API 함수
- `src/domains/mileage/{types,api}/` — 마일리지 타입 + API 함수
- `docs/api/mypage.md` — API 명세서
- 테스트: 16 cases (mypageApi 7, couponApi 7, mileageApi 2)

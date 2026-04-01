# Phase 11-C — 인증/마이페이지/찜/마일리지 API 검증

## API 호출 결과 (9/18 검증)
- POST /auth/sessions/users → user에 name/history_yn 없음
- GET /auth/users/mypage/list → new_alarm_date/new_notice_date는 number(초)
- GET /auth/code/list → auth_method 구조 확인
- POST /auth/code/send → sms_auth_key 반환
- POST /auth/users/update → token+user 반환
- GET /contents/list?search_type=ST006 → motels[] + rating/download_coupon_info 확인
- POST /auth/dibs/register → storeKey(camelCase) 확인
- GET /benefit/users/mileage/list → points[] (amount 등 optional)
- POST /auth/users/pw/check → 에러 (enc_password 형식 문제)

## 타입 수정
- AuthUser: name, history_yn 삭제
- MypageInfo: new_alarm_date/new_notice_date string→number
- StoreItem: rating, benefit_point_rate, location, download_coupon_info 추가
- MileageDetailResponse: amount/total_amount/expire_amount optional
- ProfileEditPage: authUser.name 참조 제거
- 테스트 4개 파일 수정
- auth.md, mypage.md 명세 업데이트

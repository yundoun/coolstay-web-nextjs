# 기획전 쿠폰 다운로드 key/type 수정

## 문제
기획전(패키지형) 쿠폰 다운로드 시 "쿠폰정보 없음" 에러 발생.

## 원인
- benefit/coupon-flow-logic.md 스펙: EXHIBITION/PACKAGE 타입에서 key는 쿠폰 PK(콤마 구분)
- 기존 코드: exhibitionKey(기획전 키)를 key로 전송 → 404
- PACKAGE_EXHIBITION_GROUP 타입은 download type이 PACKAGE여야 함

## 수정
- key: exhibitionKey → couponPk
- type: PACKAGE_EXHIBITION_GROUP일 때 PACKAGE, 그 외 EXHIBITION

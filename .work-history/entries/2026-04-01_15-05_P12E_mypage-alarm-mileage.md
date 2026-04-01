# Phase 12-E — 마이페이지/알림/마일리지 API 필드 100% 활용

## 마이페이지 (P12E-1~3)
- new_alarm_date → 알림 메뉴 "NEW" 뱃지 (7일 이내)
- new_notice_date → 공지 메뉴 "NEW" 뱃지 (7일 이내)
- reservation_count → 예약 메뉴 카운트 뱃지
- 하드코딩 메뉴 → 동적 빌드 (useMypageInfo 데이터 기반)

## 알림 (P12E-4~6)
- alarm_categories → 카테고리 필터 탭 (전체/예약/혜택 등)
- alarm.link.btn_name → CTA 버튼 텍스트 표시
- alarm.description → 접이식 상세 설명

## 마일리지 (P12E-7~8)
- points[].reason → 거래 사유 텍스트
- points[].remained_point → 거래 후 잔액 표시
- 금액 컬러코딩 (적립 blue / 사용 red)

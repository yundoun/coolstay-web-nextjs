# 홈 화면 헤더 투명 모드 제거

## 작업 내용
- 히어로 배경 이미지 제거 후 투명 헤더가 불필요해져서 solid 모드로 변경
- TRANSPARENT_HEADER_PATHS에서 "/" 제거 → 모든 페이지에서 헤더 항상 solid

## 변경 파일
- src/components/layout/Header/Header.tsx

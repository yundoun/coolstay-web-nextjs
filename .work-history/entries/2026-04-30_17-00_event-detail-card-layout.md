# 이벤트 상세 페이지 카드형 레이아웃 전환

## 작업 내용
- 이벤트 상세 히어로를 풀블리드에서 Container 내 카드형(article)으로 변경
- 기획전 상세와 동일한 구조: rounded-xl border + aspect-[2/1] 이미지 + Badge 상태 표시
- 플로팅 뒤로가기/공유 버튼 제거 (글로벌 헤더로 통합, 이전 커밋)
- deploy-dev.sh에 API route 임시 제외 로직 추가 (static export 호환)

## 변경 파일
- EventDetailPage.tsx: 전체 레이아웃 리팩토링
- deploy-dev.sh: 빌드 시 src/app/api 임시 백업/복원

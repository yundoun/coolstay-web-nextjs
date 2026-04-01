# 이벤트 UI 모던 리디자인

## 홈 EventSection
- 2컬럼 그리드 → 가로 스크롤 캐러셀 (snap)
- 세로형 카드 (aspect-[3/4]), 그라디언트 오버레이
- 종료 이벤트 desaturation + "종료" 오버레이

## EventListPage
- 첫 번째 히어로 카드 (full-width aspect-[2/1])
- 나머지 2컬럼 이미지 중심 그리드
- 필터 탭 추가 (전체/진행중/종료)
- 상태 표시: 컬러 dot + glow 효과

## EventDetailPage
- 풀블리드 히어로 + 그라디언트 오버레이 위 타이틀
- 플로팅 뒤로가기/공유 버튼
- 화이트 카드 오버랩 (rounded-t-3xl, -mt-4)
- 이미지 갤러리 가로 스크롤
- 모바일 하단 고정 CTA 바

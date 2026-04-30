# 에러 바운더리 추가 + 홈 페이지 서버 에러 처리

## 변경 사항
- `src/app/error.tsx` — 루트 에러 바운더리 (다시 시도 + 홈으로 이동)
- `src/app/(public)/error.tsx` — 공개 페이지 에러 바운더리
- `src/app/(protected)/error.tsx` — 인증 페이지 에러 바운더리
- `src/app/(public)/page.tsx` — isError 상태 처리 추가 (서버 다운 시 ErrorState 표시)

## 배경
- 서버 다운 시 홈 화면이 스켈레톤 상태에서 멈추는 문제
- React Query는 에러를 throw하지 않고 isError 상태로 관리하므로 error.tsx만으로는 부족
- 홈 페이지에 isError 체크 + ErrorState 컴포넌트 렌더링 추가

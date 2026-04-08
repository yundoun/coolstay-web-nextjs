# 패키지형 기획전 하위 목록 페이지 구현

## 배경
PACKAGE_EXHIBITION_GROUP 타입 기획전은 폴더/컨테이너 역할로, 클릭 시 하위 기획전 목록을 보여줘야 함.
기존에는 임시로 첫 번째 하위 기획전 상세를 바로 표시하고 있었음.

## 변경 내용

### 신규 파일
- `src/domains/exhibition/hooks/usePackageExhibitionList.ts` — 패키지 그룹 하위 기획전 목록 조회 훅
- `src/domains/exhibition/components/PackageExhibitionPage.tsx` — 패키지 기획전 목록 페이지 컴포넌트

### 수정 파일
- `src/domains/cs/types/index.ts` — BoardListResponse에 menu_title 필드 추가
- `src/app/(public)/exhibitions/[id]/page.tsx` — type=PACKAGE_EXHIBITION_GROUP 분기 처리
- `src/domains/exhibition/components/index.ts` — PackageExhibitionPage export 추가

## 동작 흐름
```
기획전 목록 → PACKAGE_EXHIBITION_GROUP 카드 클릭
  → PackageExhibitionPage (menu_title + 하위 기획전 카드 그리드)
  → 하위 기획전 카드 클릭 → ExhibitionDetailPage (기존 상세)
```

## E2E 검증
- 돌돌꿀 초특가[테스트] (87292): 하위 1개 표시, 카드 클릭 → 상세 정상
- 랜딩테스트123 (87290): 하위 1개 + 진행중 카운트 표시 정상
- 콘솔 에러 0건

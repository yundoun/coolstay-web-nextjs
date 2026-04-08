# 기획전 상세 API board_type 수정

## 작업 내용
기획전 상세 API 호출 시 `board_type=EVENT`를 사용하여 PACKAGE_EXHIBITION_GROUP 타입
기획전(예: key=87292)에서 빈 결과가 반환되는 버그 수정.

## 원인
- domain-analysis 스펙(manage/flow.md, api-spec.json)에 따르면 기획전은
  `board_type=MOBILE_BOARD` + `board_sub_type=EXHIBITION|PACKAGE_EXHIBITION_GROUP`으로 호출해야 함
- 기존 코드는 모든 기획전을 `board_type=EVENT`로 호출 → MOBILE_BOARD 타입 아이템은 빈 결과

## 수정 사항
- `exhibitionApi.ts`: `board_type=EVENT` → `MOBILE_BOARD` + `board_sub_type` 파라미터 추가
- `useExhibitionDetail.ts`: `boardSubType` 파라미터 전달, queryKey에 포함
- `ExhibitionDetailPage.tsx`: `exhibitionType` prop 추가
- `ExhibitionListPage.tsx`: 링크에 `?type=` query param 추가
- `FeatureSection.tsx`: 홈 기획전 링크에 `?type=` query param 추가
- `page.tsx` (detail route): searchParams에서 type 읽어서 전달

## E2E 검증
- EXHIBITION 타입(87286): 정상 렌더링
- PACKAGE_EXHIBITION_GROUP 타입(87292): 정상 렌더링
- 홈/목록 페이지 모든 링크에 `?type=` 파라미터 포함 확인

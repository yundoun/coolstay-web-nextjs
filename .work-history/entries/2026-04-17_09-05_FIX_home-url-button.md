# 홈 업태 외부 이동 버튼 클릭 미동작 수정

## 문제
- 홈 화면 업태 카테고리에서 `type: "URL"` 항목(외부 이동 버튼) 클릭 시 아무 반응 없음
- `SPECIAL_HREF` 매핑에도 없고, `mapping_business_types`도 없어서 `handleClick`이 무시

## 원인
- API 응답의 `new_item_categories`에 `type: "URL"`, `target: "https://..."` 형태의 외부 링크 항목이 존재
- `BusinessTypeGrid`에서 이 타입을 처리하는 분기가 없었음

## 수정
- `BusinessTypeGrid.tsx`: `item.type === "URL" && item.target` 조건 분기 추가
- `<a target="_blank" rel="noopener noreferrer">`로 새 탭에서 외부 링크 열기
